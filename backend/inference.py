"""
inference.py — 새 리뷰 1건을 받아 분석 결과 dict를 반환

노트북(Trilingual_FE_v2.ipynb)의 함수들을 재구성:
  - 형태소 분석 (spaCy / Kiwi / fugashi)
  - 강도 프로파일 lookup (artifacts에서 로드)
  - 표현 6축 계산 (Global Z-Score)
  - Zero-shot ABSA (multilingual 임베딩)
  - 보정 별점 회귀 예측 (Option A: 표현 feature만)
  - expressionType 분류
"""
from __future__ import annotations
import re
import pickle
import warnings
from pathlib import Path
import numpy as np

warnings.filterwarnings('ignore')

# ════════════════════════════════════════════════════════════════
# 1. 모델 로드 — 서버 시작 시 한 번만
# ════════════════════════════════════════════════════════════════
print('[inference] loading artifacts...')
ARTIFACTS_PATH = Path(__file__).parent / 'artifacts_inference.pkl'
with open(ARTIFACTS_PATH, 'rb') as f:
    ARTIFACTS = pickle.load(f)

LANG_CONFIG       = ARTIFACTS['lang_config']
CHARSET_PATTERNS  = ARTIFACTS['charset_patterns']
ATTR_PROTOTYPES   = ARTIFACTS['attr_prototypes']
ATTR_KOR          = ARTIFACTS['attr_kor']
GLOBAL_STATS      = ARTIFACTS['global_stats']
ATTR_NAMES        = list(ATTR_PROTOTYPES.keys())

print('[inference] loading parsers...')
import spacy
from kiwipiepy import Kiwi
import fugashi
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

NLP_EN     = spacy.load('en_core_web_sm', disable=['ner'])
KIWI       = Kiwi()
JA_TAGGER  = fugashi.Tagger()
VADER      = SentimentIntensityAnalyzer()

print('[inference] loading embedder (multilingual)...')
import torch
from sentence_transformers import SentenceTransformer
from scipy.spatial.distance import cdist
DEVICE   = 'cuda' if torch.cuda.is_available() else 'cpu'
EMBEDDER = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2', device=DEVICE)
ATTR_EMB = EMBEDDER.encode(list(ATTR_PROTOTYPES.values()), convert_to_numpy=True)

# 강도 프로파일 lookup dict 미리 생성
LOOKUPS = {}
for lang in ('en', 'ko', 'ja'):
    prof = ARTIFACTS['per_lang'][lang]['intensity_profile']
    if hasattr(prof, 'itertuples'):
        LOOKUPS[lang] = {(r.word, r.pos): (r.intensity, r.polarity) for r in prof.itertuples()}
    else:
        LOOKUPS[lang] = {(r['word'], r['pos']): (r['intensity'], r['polarity']) for r in prof}

print(f'[inference] ready. Lookup sizes: en={len(LOOKUPS["en"])}, ko={len(LOOKUPS["ko"])}, ja={len(LOOKUPS["ja"])}')

LANG_LABEL = {'en': 'English', 'ko': '한국어', 'ja': '日本語'}
LANG_PATTERN_TEMPLATE = {
    'en': '영어 리뷰는 장단점을 직접 분리해서 진술하는 경향이 강합니다.',
    'ko': '한국어 리뷰는 완곡한 어미와 양보 표현으로 아쉬움을 부드럽게 전달합니다.',
    'ja': '일본어 리뷰는 정중한 표현 안에 약화된 부정 신호를 자주 포함합니다.',
}


# ════════════════════════════════════════════════════════════════
# 2. 형태소 분석 — 언어별 dict 토큰 생성
# ════════════════════════════════════════════════════════════════
def parse_en(text: str) -> list[dict]:
    doc = NLP_EN(text[:500])
    return [{'word': t.text, 'lemma': t.lemma_.lower(), 'pos': t.pos_, 'tag': t.tag_,
             'dep': t.dep_, 'is_sent_start': bool(t.is_sent_start), 'inflect': None}
            for t in doc if not t.is_space]


def parse_ko(text: str) -> list[dict]:
    out = []
    for t in KIWI.tokenize(text[:500]):
        out.append({'word': t.form, 'lemma': t.form, 'pos': t.tag, 'tag': t.tag,
                    'dep': None, 'is_sent_start': False, 'inflect': None})
    return out


def parse_ja(text: str) -> list[dict]:
    out = []
    for w in JA_TAGGER(text[:500]):
        feat = w.feature
        pos = feat.pos1 if hasattr(feat, 'pos1') else '*'
        lemma = feat.lemma if (hasattr(feat, 'lemma') and feat.lemma) else w.surface
        inflect = None
        for attr in ('cForm', 'inflectionForm', 'form'):
            if hasattr(feat, attr):
                v = getattr(feat, attr)
                if v and v != '*':
                    inflect = str(v); break
        out.append({'word': w.surface, 'lemma': str(lemma),
                    'pos': str(pos) if pos else '*',
                    'tag': str(pos) if pos else '*',
                    'dep': None, 'is_sent_start': False, 'inflect': inflect})
    return out


PARSERS = {'en': parse_en, 'ko': parse_ko, 'ja': parse_ja}


# ════════════════════════════════════════════════════════════════
# 3. 표현 원시 성분 — 노트북 expression_raw와 동일 로직
# ════════════════════════════════════════════════════════════════
def expression_raw(text: str, tokens: list[dict], lang: str) -> dict:
    cfg = LANG_CONFIG[lang]
    lookup = LOOKUPS[lang]
    valid = [t for t in tokens if isinstance(t, dict)]
    n_tok = max(len(valid), 1)
    n_char = max(len(text), 1)

    # 강도 5단계
    matched, pos_counts, tag_counts, grammar_count = [], {}, {}, 0
    for tok in valid:
        lemma = str(tok.get('lemma', tok.get('word', ''))).lower()
        pos = str(tok.get('pos', ''))
        tag = str(tok.get('tag', ''))
        pos_counts[pos] = pos_counts.get(pos, 0) + 1
        if tag:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
        if pos in cfg['grammar_pos']:
            grammar_count += 1
        key_pos = tag if (lang == 'en' and tag) else pos
        info = lookup.get((lemma, key_pos))
        if info:
            matched.append(info)
    tm = max(len(matched), 1)
    high_neg = sum((i > 0.5) and (p == -1) for i, p in matched) / tm
    low_neg  = sum((0.1 < i <= 0.5) and (p == -1) for i, p in matched) / tm
    high_pos = sum((i > 0.5) and (p == 1) for i, p in matched) / tm
    low_pos  = sum((0.1 < i <= 0.5) and (p == 1) for i, p in matched) / tm
    neutral_w = sum((i < 0.1) for i, p in matched) / tm

    def pos_match(target_set):
        if lang == 'en':
            return sum(tag_counts.get(t, 0) for t in target_set)
        return sum(pos_counts.get(t, 0) for t in target_set)

    adj_ratio   = pos_match(cfg['adj_pos']) / n_tok
    adv_ratio   = pos_match(cfg['adv_pos']) / n_tok
    noun_ratio  = pos_match(cfg['noun_pos']) / n_tok
    verb_ratio  = pos_match(cfg['verb_pos']) / n_tok
    num_ratio   = pos_match(cfg['number_pos']) / n_tok
    modal_ratio = pos_match(cfg['modal_tag']) / n_tok
    comparative = pos_match(cfg['comparative_tag'])
    superlative = pos_match(cfg['superlative_tag'])
    concession_pos_cnt = pos_match(cfg['concession_pos'])

    # ADV→ADJ 연속
    adv_adj_seq = 0
    for i in range(len(valid) - 1):
        a_tag = str(valid[i].get('tag', '')) if lang == 'en' else str(valid[i].get('pos', ''))
        b_tag = str(valid[i+1].get('tag', '')) if lang == 'en' else str(valid[i+1].get('pos', ''))
        if a_tag in cfg['adv_pos'] and b_tag in cfg['adj_pos']:
            adv_adj_seq += 1

    # 닫힌 문법어
    neg_count = sum(1 for t in valid
                    if str(t.get('lemma', t.get('word', ''))).lower() in cfg['neg_words'])
    concession_word = sum(1 for t in valid
                          if str(t.get('lemma', t.get('word', ''))).lower() in cfg['concession_words'])
    concession_morph = 0
    if 'concession_morphs' in cfg:
        for t in valid:
            w = str(t.get('word', '')).lower()
            tag = str(t.get('pos', ''))
            if w in cfg['concession_morphs'] and tag in cfg['concession_pos']:
                concession_morph += 1

    # 명령형
    imperative = 0
    if cfg.get('use_dep_imperative'):
        for t in valid:
            if (t.get('is_sent_start') and
                str(t.get('tag', '')) == 'VB' and
                str(t.get('dep', '')) == 'ROOT'):
                imperative += 1
    elif 'imperative_morphs' in cfg:
        for t in valid:
            if (str(t.get('word', '')).lower() in cfg['imperative_morphs'] and
                str(t.get('pos', '')) == 'EF'):
                imperative += 1
    elif 'imperative_inflect' in cfg:
        for t in valid:
            if str(t.get('inflect', '')) in cfg['imperative_inflect']:
                imperative += 1

    # 표면
    caps     = len(re.findall(r'\b[A-Z]{2,}\b', text))
    exclaim  = text.count('!') + text.count('!')
    question = text.count('?') + text.count('?')
    char_rep = len(re.findall(r'(.)\1{2,}', text))
    ellipsis = len(re.findall(r'\.{3,}|…', text))
    first_p  = sum(1 for t in valid if str(t.get('word', '')).lower() in cfg['first_person']) / n_tok

    charset = {name: len(re.findall(pat, text)) / n_char
               for name, pat in CHARSET_PATTERNS[lang].items()}

    out = {
        'r_high_neg': high_neg, 'r_low_neg': low_neg,
        'r_high_pos': high_pos, 'r_low_pos': low_pos, 'r_neutral_w': neutral_w,
        'r_adj': adj_ratio, 'r_adv': adv_ratio, 'r_noun': noun_ratio,
        'r_verb': verb_ratio, 'r_num': num_ratio, 'r_modal': modal_ratio,
        'r_comparative': comparative, 'r_superlative': superlative,
        'r_adv_adj_seq': adv_adj_seq,
        'r_neg': neg_count / n_tok,
        'r_concession_word': concession_word,
        'r_concession_morph': concession_morph,
        'r_concession_pos': concession_pos_cnt / n_tok,
        'r_imperative': imperative,
        'r_caps': caps, 'r_exclaim': exclaim, 'r_question': question,
        'r_char_rep': char_rep, 'r_ellipsis': ellipsis,
        'r_first_person': first_p,
        'r_grammar': grammar_count / n_tok,
    }
    out.update(charset)
    return out


# ════════════════════════════════════════════════════════════════
# 4. 문장 단위 분산 + ABSA
# ════════════════════════════════════════════════════════════════
SENT_PAT = re.compile(r'[.!?。!?\n]')


def sentence_variance(text: str, lang: str) -> dict:
    scorer = (lambda s: VADER.polarity_scores(s)['compound']) if lang == 'en' else (lambda s: 0.0)
    sents = [s.strip() for s in SENT_PAT.split(str(text)) if len(s.strip()) > 3]
    if len(sents) < 2:
        return {'r_sent_var': 0.0, 'r_sent_range': 0.0, 'r_sent_mix': 0.0, 'r_sent_n': len(sents)}
    scores = [scorer(s) for s in sents]
    pos = sum(1 for s in scores if s > 0.05)
    neg = sum(1 for s in scores if s < -0.05)
    return {
        'r_sent_var': float(np.var(scores)),
        'r_sent_range': float(max(scores) - min(scores)),
        'r_sent_mix': min(pos, neg) / len(scores),
        'r_sent_n': len(scores),
    }


def absa(text: str, lang: str, threshold: float = 0.30) -> dict:
    scorer = (lambda s: VADER.polarity_scores(s)['compound']) if lang == 'en' else (lambda s: 0.0)
    sents = [s.strip() for s in SENT_PAT.split(str(text)) if len(s.strip()) > 3]
    result = {}
    if not sents:
        for a in ATTR_NAMES:
            result[f'attr_{a}'] = 0
            result[f'attrsent_{a}'] = 0.0
        return result
    emb = EMBEDDER.encode(sents, convert_to_numpy=True)
    sims = 1 - cdist(emb, ATTR_EMB, metric='cosine')
    for j, a in enumerate(ATTR_NAMES):
        hit = sims[:, j] > threshold
        if hit.any():
            result[f'attr_{a}'] = 1
            rel = [scorer(sents[k]) for k in np.where(hit)[0]]
            result[f'attrsent_{a}'] = float(np.mean(rel)) if rel else 0.0
        else:
            result[f'attr_{a}'] = 0
            result[f'attrsent_{a}'] = 0.0
    return result


# ════════════════════════════════════════════════════════════════
# 5. 표현 6축 (Global Z-Score 적용)
# ════════════════════════════════════════════════════════════════
RAW_COMPONENTS = {
    'EXP_directness':   ['r_high_neg', 'r_high_pos', 'r_superlative', 'r_neg', 'r_imperative', 'r_caps'],
    'EXP_euphemism':    ['r_low_neg', 'r_low_pos', 'r_concession_word', 'r_concession_morph',
                         'r_concession_pos', 'r_grammar', 'r_sent_var', 'r_sent_range'],
    'EXP_intensify':    ['r_adv_adj_seq', 'r_char_rep', 'r_exclaim'],
    'EXP_modality':     ['r_modal'],
    'EXP_subjectivity': ['r_first_person', 'r_adj', 'r_num'],
    'EXP_comparative':  ['r_comparative'],
}


def compute_axes(feat: dict) -> dict:
    """Global stats로 z-score 정규화 후 6축 평균."""
    def gz(col):
        v = feat.get(col, 0.0)
        if col in GLOBAL_STATS:
            mu, sd = GLOBAL_STATS[col]
            return (v - mu) / sd if sd > 0 else 0.0
        return v
    axes = {}
    for axis, comps in RAW_COMPONENTS.items():
        if axis == 'EXP_subjectivity':
            zs = [gz('r_first_person'), gz('r_adj'), -gz('r_num')]
        else:
            zs = [gz(c) for c in comps]
        axes[axis] = float(np.mean(zs)) if zs else 0.0
    return axes


# ════════════════════════════════════════════════════════════════
# 6. expressionType 분류 + 자연어 생성
# ════════════════════════════════════════════════════════════════
def classify_expression_type(orig: float, cal: float, intensify: float, attrsents: list) -> str:
    gap = orig - cal
    mentioned = [s for s in attrsents if s != 0]
    min_sent = min(mentioned) if mentioned else 0.0
    if abs(gap) < 0.5:
        return '별점-텍스트 일치'
    if orig >= 4 and cal < 3.5:
        return '완곡한 불만'
    if orig <= 3 and cal > 4:
        return '숨은 만족'
    if min_sent < -0.3:
        return '속성 불만'
    if intensify > 1.0 and cal >= 4:
        return '강조형 긍정'
    return '혼합 감정'


def mentioned_attrs(attrs_dict: dict, top_n: int = 3) -> list:
    items = []
    for ac in ATTR_NAMES:
        if attrs_dict.get(f'attr_{ac}', 0) == 1:
            sent = attrs_dict.get(f'attrsent_{ac}', 0)
            items.append((ATTR_KOR.get(ac, ac), abs(sent), sent))
    items.sort(key=lambda x: -x[1])
    return [x[0] for x in items[:top_n]]


def generate_text_fields(expr_type: str, orig: float, cal: float, attrs: list, lang: str) -> dict:
    attrs_str = ', '.join(attrs) if attrs else '전반'
    notes = {
        '별점-텍스트 일치':  f'표면 별점({int(orig)})과 텍스트 감성이 일관되게 나타남',
        '완곡한 불만':       f'높은 별점({int(orig)}) 안에 완곡한 부정 신호 포함',
        '숨은 만족':         f'중간 별점({int(orig)})이지만 강한 긍정 표현이 두드러짐',
        '속성 불만':         f'{attrs_str} 속성에서 부정 감성이 강하게 나타남',
        '강조형 긍정':       '느낌표·반복으로 강조된 강한 만족',
        '혼합 감정':         '긍정·부정 표현이 섞여 있음',
    }
    reasons = {
        '별점-텍스트 일치':  f'표현 신호가 별점과 일치해 보정 폭이 작습니다 ({cal:.1f}점).',
        '완곡한 불만':       f'완곡한 부정 표현이 다수 포함되어 실제 만족도는 {cal:.1f}점으로 낮게 조정됩니다.',
        '숨은 만족':         f'표현에서 긍정 신호가 강해 실제 만족도가 {cal:.1f}점으로 높게 조정됩니다.',
        '속성 불만':         f'{attrs_str} 속성의 부정 감성이 강해 보정 별점이 {cal:.1f}점으로 낮아집니다.',
        '강조형 긍정':       f'강조 표현(느낌표·반복)이 많아 보정 별점이 {cal:.1f}점으로 높게 유지됩니다.',
        '혼합 감정':         f'긍정·부정 표현이 혼재되어 보정 별점이 {cal:.1f}점으로 산출됩니다.',
    }
    return {
        'translatedNote': notes.get(expr_type, ''),
        'reason':         reasons.get(expr_type, ''),
        'languagePattern': LANG_PATTERN_TEMPLATE.get(lang, ''),
    }


# ════════════════════════════════════════════════════════════════
# 7. 메인 추론 함수
# ════════════════════════════════════════════════════════════════
def analyze_review(text: str, star: int, lang: str) -> dict:
    if lang not in ('en', 'ko', 'ja'):
        raise ValueError(f'Unknown language: {lang}')
    if not text or not text.strip():
        raise ValueError('Empty text')

    star = float(star)
    text = text.strip()

    # 1. 형태소
    tokens = PARSERS[lang](text)

    # 2. 원시 + 문장 분산 + ABSA
    raw = expression_raw(text, tokens, lang)
    raw.update(sentence_variance(text, lang))
    attrs_dict = absa(text, lang)
    raw.update(attrs_dict)

    # 3. 6축 (Global z-score)
    axes = compute_axes(raw)

    # 4. 보정 별점 예측
    calib = ARTIFACTS['per_lang'][lang]['calibration']
    feature_vec = []
    feat_all = {**raw, **axes}
    for col in calib['feature_cols']:
        feature_vec.append(feat_all.get(col, 0.0))
    X = np.array([feature_vec], dtype=float)
    Xz = calib['scaler'].transform(X)
    cal_star = float(np.clip(calib['model'].predict(Xz)[0], 1, 5))

    # 5. 분류 + 속성 + 텍스트
    attrsent_vals = [attrs_dict.get(f'attrsent_{a}', 0)
                     for a in ATTR_NAMES if attrs_dict.get(f'attr_{a}', 0) == 1]
    expr_type = classify_expression_type(star, cal_star, axes.get('EXP_intensify', 0), attrsent_vals)
    attrs = mentioned_attrs(attrs_dict)
    texts = generate_text_fields(expr_type, star, cal_star, attrs, lang)

    return {
        'language': lang.upper(),
        'languageLabel': LANG_LABEL[lang],
        'originalRating': star,
        'calibratedRating': round(cal_star, 2),
        'expressionType': expr_type,
        'attributes': attrs,
        'translatedNote': texts['translatedNote'],
        'reason':         texts['reason'],
        'languagePattern': texts['languagePattern'],
        'expression': {
            'directness':   round(axes.get('EXP_directness', 0), 2),
            'euphemism':    round(axes.get('EXP_euphemism', 0), 2),
            'intensify':    round(axes.get('EXP_intensify', 0), 2),
            'modality':     round(axes.get('EXP_modality', 0), 2),
            'subjectivity': round(axes.get('EXP_subjectivity', 0), 2),
            'comparative':  round(axes.get('EXP_comparative', 0), 2),
        },
        'title': '',
        'body': text,
    }


if __name__ == '__main__':
    # 빠른 self-test
    samples = [
        ('en', 'Worked great, very happy with this purchase!', 5),
        ('ko', '좋긴 한데 좀 아쉬워요. 가격은 괜찮은데 품질이 별로네요.', 4),
        ('ja', '音は良いですが、少し重く感じます。', 5),
    ]
    for lang, text, star in samples:
        result = analyze_review(text, star, lang)
        print(f'\n[{lang}] "{text}" ({star}★)')
        print(f'  → calibrated: {result["calibratedRating"]}★')
        print(f'  → type:       {result["expressionType"]}')
        print(f'  → attributes: {result["attributes"]}')
        print(f'  → note:       {result["translatedNote"]}')
