"""
api.py — FastAPI 서버
실행:
    uvicorn api:app --reload --port 8000

POST /analyze
    body: { "text": "...", "star": 5, "language": "ko" }
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal

from inference import analyze_review

app = FastAPI(title='ReviewCal Inference API', version='0.1.0')

# 프론트(localhost:5173)에서 호출 가능하게 CORS 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description='리뷰 본문')
    star: int = Field(..., ge=1, le=5, description='원래 별점 (1~5)')
    language: Literal['en', 'ko', 'ja'] = Field(..., description='언어 코드')


@app.get('/')
def root():
    return {
        'status': 'ready',
        'name': 'ReviewCal Inference API',
        'supported_languages': ['en', 'ko', 'ja'],
        'endpoints': {'POST /analyze': 'Analyze a single review'},
    }


@app.post('/analyze')
def analyze(req: AnalyzeRequest):
    try:
        return analyze_review(req.text, req.star, req.language)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Inference error: {e}')


@app.get('/health')
def health():
    return {'ok': True}
