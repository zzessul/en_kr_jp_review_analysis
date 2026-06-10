# ReviewCal Backend — Inference Server

새 리뷰 1건을 받아 분석 결과를 반환하는 FastAPI 서버.

## 사전 준비

1. **artifacts_inference.pkl** 파일을 이 `backend/` 폴더에 둡니다.
   - 노트북 `Trilingual_FE_v2.ipynb`의 셀 43이 생성한 파일
   - 모델·scaler·강도 프로파일이 모두 들어있음

2. Python 3.10+ 권장

## 설치

```bash
cd backend
python -m venv .venv
source .venv/bin/activate           # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

설치 시간: 10~15분 (sentence-transformers·torch가 큼)

## 실행

```bash
uvicorn api:app --reload --port 8000
```

처음 로드 시 모델 다운로드/캐싱으로 30초~1분 소요. 콘솔에:

```
[inference] loading artifacts...
[inference] loading parsers...
[inference] loading embedder (multilingual)...
[inference] ready. Lookup sizes: en=530, ko=583, ja=2126
INFO:     Uvicorn running on http://127.0.0.1:8000
```

이 메시지 나오면 준비 완료.

## 사용

브라우저에서 http://localhost:8000/docs 열면 Swagger UI에서 직접 호출 가능.

curl로 테스트:

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"좋긴 한데 좀 아쉬워요","star":5,"language":"ko"}'
```

응답 예시:

```json
{
  "language": "KO",
  "languageLabel": "한국어",
  "originalRating": 5,
  "calibratedRating": 3.4,
  "expressionType": "완곡한 불만",
  "attributes": ["품질"],
  "translatedNote": "높은 별점(5) 안에 완곡한 부정 신호 포함",
  "reason": "완곡한 부정 표현이 다수 포함되어 실제 만족도는 3.4점으로 낮게 조정됩니다.",
  "languagePattern": "한국어 리뷰는 완곡한 어미와 양보 표현으로 ...",
  "expression": {
    "directness": -0.2, "euphemism": 1.4, "intensify": 0.0,
    "modality": 0.8, "subjectivity": 0.3, "comparative": -0.1
  },
  "title": "",
  "body": "좋긴 한데 좀 아쉬워요"
}
```

## 메모리 사용량

- 시작 시: ~1.2GB
- 일본어 fugashi(UniDic)이 가장 큼 (~600MB)
- GPU 있으면 자동 사용 (`DEVICE = cuda`)

## 문제 해결

### `FileNotFoundError: artifacts_inference.pkl`
노트북에서 생성한 pkl을 backend 폴더에 복사.

### `spacy: model not found`
```bash
python -m spacy download en_core_web_sm
```

### sklearn 버전 mismatch warning
노트북이 학습된 sklearn 버전과 백엔드 버전이 다를 때 나옴. 보통 동작은 함. 정확성 위해서는 같은 버전 권장.
