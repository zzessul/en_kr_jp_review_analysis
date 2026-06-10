const languageLabel = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
};

const languagePattern = {
  ko: "한국어 리뷰는 높은 별점 안에서도 '좋긴 한데', '조금 아쉽다'처럼 완곡하게 불만을 덧붙이는 경향을 함께 반영합니다.",
  en: "English reviews often separate pros and cons directly, so positive value statements inside mid ratings can raise the calibrated score.",
  ja: "日本語レビューでは '少し', 'かもしれません' 처럼 정중하게 완화된 부정 표현을 문맥상 만족도 신호로 반영합니다.",
};

const dictionaries = {
  ko: {
    euphemism: ["좋긴 한데", "다만", "조금", "아쉽", "괜찮지만", "나쁘지 않"],
    positive: ["만족", "좋", "충분", "괜찮", "훌륭", "편하", "오래가"],
    negative: ["불편", "아쉽", "답답", "늦", "무겁", "별로", "문제"],
    attributes: [
      ["가격", ["가격", "가성비"]],
      ["성능", ["성능", "소음", "차단", "음질", "배터리"]],
      ["사용성", ["착용", "조작", "버튼", "쓰기", "불편"]],
      ["배송", ["배송", "도착", "늦"]],
      ["서비스", ["문의", "응대", "답변", "서비스"]],
    ],
  },
  en: {
    euphemism: ["not perfect", "but", "a bit", "could be", "however"],
    positive: ["good", "solid", "better", "surprisingly", "worth", "great", "satisfied"],
    negative: ["frustrating", "delayed", "slow", "heavy", "uncomfortable", "not premium"],
    attributes: [
      ["가격", ["price", "value", "worth"]],
      ["성능", ["noise", "sound", "battery", "performance"]],
      ["사용성", ["comfortable", "heavy", "button", "wear"]],
      ["배송", ["shipping", "delivery", "delayed"]],
      ["서비스", ["support", "reply", "service"]],
    ],
  },
  ja: {
    euphemism: ["少し", "ですが", "かもしれません", "気になる", "ただ"],
    positive: ["良い", "満足", "十分", "きれい", "問題ありません"],
    negative: ["重く", "使いにくい", "遅い", "気になる", "不便"],
    attributes: [
      ["가격", ["価格", "値段"]],
      ["성능", ["音", "音質", "ノイズ", "電池"]],
      ["사용성", ["長時間", "重く", "ボタン", "使いにくい"]],
      ["배송", ["配送", "遅い"]],
      ["서비스", ["対応", "サポート"]],
    ],
  },
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { text = "", star = 5, language = "ko" } = req.body ?? {};
  const lang = ["ko", "en", "ja"].includes(language) ? language : "ko";
  const originalRating = clamp(Number(star) || 5, 1, 5);
  const body = String(text).slice(0, 2000);

  if (!body.trim()) {
    res.status(400).json({ error: "Review text is required" });
    return;
  }

  const analysis = analyze(body, originalRating, lang);
  res.status(200).json({
    language: lang.toUpperCase(),
    languageLabel: languageLabel[lang],
    originalRating,
    calibratedRating: analysis.calibratedRating,
    expressionType: analysis.expressionType,
    attributes: analysis.attributes,
    translatedNote: analysis.translatedNote,
    reason: analysis.reason,
    languagePattern: languagePattern[lang],
    expression: analysis.expression,
    title: "",
    body,
  });
}

function analyze(text, star, lang) {
  const dict = dictionaries[lang];
  const lower = lang === "en" ? text.toLowerCase() : text;
  const positive = countMatches(lower, dict.positive);
  const negative = countMatches(lower, dict.negative);
  const euphemism = countMatches(lower, dict.euphemism);
  const attributes = dict.attributes
    .filter(([, words]) => countMatches(lower, words) > 0)
    .map(([label]) => label);

  const attrList = attributes.length ? attributes : ["표현"];
  const mismatch = star >= 4 && negative + euphemism > positive;
  const hiddenSatisfaction = star <= 3 && positive > negative;
  const attributeComplaint = attributes.some((item) => ["배송", "서비스", "사용성"].includes(item)) && negative > 0;

  let calibrated = star + positive * 0.16 - negative * 0.32 - euphemism * 0.18;
  if (hiddenSatisfaction) calibrated += 0.55;
  if (attributeComplaint) calibrated -= 0.35;
  if (mismatch) calibrated -= 0.45;
  calibrated = clamp(calibrated, 1, 5);

  const expressionType = classify({ star, calibrated, positive, negative, euphemism, attributeComplaint, hiddenSatisfaction });
  const direction = calibrated < star ? "낮게" : calibrated > star ? "높게" : "비슷하게";

  return {
    calibratedRating: round1(calibrated),
    expressionType,
    attributes: attrList,
    translatedNote: makeNote(lang, expressionType, star, calibrated),
    reason: `원래 별점 ${star.toFixed(1)}점과 텍스트의 ${attrList.join(", ")} 관련 표현을 비교한 결과, 실제 만족도 추정값이 ${direction} 조정되었습니다.`,
    expression: {
      directness: round2(lang === "en" ? 0.42 + negative * 0.08 : -0.08 + negative * 0.05),
      euphemism: round2(euphemism * 0.46 + (lang === "ja" ? 0.25 : 0)),
      intensify: round2(positive * 0.18),
      modality: round2((lang === "ko" || lang === "ja" ? 0.22 : 0.08) + euphemism * 0.1),
      subjectivity: round2((positive + negative) * 0.12),
      comparative: round2(text.match(/가격|price|value|価格|値段/g)?.length ? 0.38 : 0.02),
    },
  };
}

function classify({ star, calibrated, positive, negative, euphemism, attributeComplaint, hiddenSatisfaction }) {
  if (Math.abs(star - calibrated) < 0.35) return "별점-텍스트 일치";
  if (hiddenSatisfaction) return "숨은 만족";
  if (attributeComplaint) return "속성 불만";
  if (euphemism > 0 && calibrated < star) return "완곡한 불만";
  if (positive >= 2 && negative === 0) return "강조형 긍정";
  return "혼합 감정";
}

function makeNote(lang, expressionType, star, calibrated) {
  const delta = round1(calibrated - star);
  const sign = delta > 0 ? "+" : "";
  const base = {
    ko: "한국어 표현",
    en: "English expression",
    ja: "日本語表現",
  }[lang];
  return `${base}에서 ${expressionType} 패턴이 나타나 보정 폭 ${sign}${delta.toFixed(1)}점이 반영되었습니다.`;
}

function countMatches(text, words) {
  return words.reduce((sum, word) => sum + (text.includes(langSafe(word)) ? 1 : 0), 0);
}

function langSafe(word) {
  return /[A-Z]/.test(word) ? word.toLowerCase() : word;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function round2(value) {
  return Math.round(value * 100) / 100;
}
