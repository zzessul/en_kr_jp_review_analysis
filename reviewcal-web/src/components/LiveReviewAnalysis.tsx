import { useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";

type ApiLanguage = "en" | "ko" | "ja";

type AnalyzeResult = {
  language: "EN" | "KO" | "JA";
  languageLabel: string;
  originalRating: number;
  calibratedRating: number;
  expressionType: string;
  attributes: string[];
  translatedNote: string;
  reason: string;
  languagePattern: string;
  expression: {
    directness: number;
    euphemism: number;
    intensify: number;
    modality: number;
    subjectivity: number;
    comparative: number;
  };
  body: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const samples: Record<ApiLanguage, string> = {
  ko: "좋긴 한데 오래 쓰면 조금 아쉬워요. 소음 차단은 좋은데 착용감이 불편하네요.",
  en: "Surprisingly good for the price. Not premium but works better than I thought.",
  ja: "音は良いですが、少し重く感じます。長時間つけると気になるかもしれません。",
};

const axisLabels: Array<[keyof AnalyzeResult["expression"], string]> = [
  ["directness", "직설"],
  ["euphemism", "완곡"],
  ["intensify", "강조"],
  ["modality", "양태"],
  ["subjectivity", "주관"],
  ["comparative", "비교"],
];

export default function LiveReviewAnalysis() {
  const [text, setText] = useState(samples.ko);
  const [star, setStar] = useState(5);
  const [language, setLanguage] = useState<ApiLanguage>("ko");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!text.trim()) {
      setError("분석할 리뷰를 입력하세요.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, star, language }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`API ${response.status}: ${body.slice(0, 160)}`);
      }

      setResult(await response.json());
    } catch (err) {
      const message = err instanceof Error ? err.message : "분석 요청에 실패했습니다.";
      setError(
        message.includes("Failed to fetch")
          ? `백엔드 서버에 연결할 수 없습니다. 로컬에서는 ${API_BASE_URL} 서버를 먼저 실행하세요.`
          : message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-amber-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-navy-700">실시간 모델 연결</p>
            <h2 className="text-xl font-bold text-slate-950">새 리뷰 분석</h2>
          </div>
        </div>
        <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          POST /analyze
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-bold text-slate-700">리뷰 텍스트</label>
            <button
              type="button"
              onClick={() => setText(samples[language])}
              className="text-sm font-semibold text-navy-700 hover:underline"
            >
              샘플 채우기
            </button>
          </div>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="h-28 w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm leading-6 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            placeholder="한·영·일 리뷰를 입력하세요"
            maxLength={2000}
          />

          <div className="grid gap-3 md:grid-cols-[180px_1fr]">
            <label className="block">
              <span className="mb-1 block text-sm font-bold text-slate-700">언어</span>
              <select
                value={language}
                onChange={(event) => {
                  const next = event.target.value as ApiLanguage;
                  setLanguage(next);
                  setText(samples[next]);
                }}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>
            </label>

            <div>
              <span className="mb-1 block text-sm font-bold text-slate-700">원래 별점</span>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStar(value)}
                    className={`rounded-md border px-2 py-2 text-sm font-bold transition ${
                      star === value
                        ? "border-amber-400 bg-amber-100 text-amber-800"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {value}★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

          <button
            type="button"
            onClick={analyze}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-navy-900 px-4 py-3 font-bold text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={17} className="animate-spin" />}
            분석하기
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          {!result ? (
            <div className="flex h-full min-h-56 items-center justify-center text-center text-sm leading-6 text-slate-500">
              백엔드가 실행 중이면 입력한 리뷰의 보정 별점, 표현 유형, 보정 사유가 여기에 표시됩니다.
            </div>
          ) : (
            <div>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-navy-700">{result.languageLabel}</p>
                  <h3 className="font-bold text-slate-950">{result.expressionType}</h3>
                </div>
                <button type="button" onClick={() => setResult(null)} className="text-slate-400 hover:text-slate-700">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <ScoreBox label="원래 별점" value={result.originalRating} tone="amber" />
                <ScoreBox label="보정 별점" value={result.calibratedRating} tone="navy" />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {result.attributes.map((attribute) => (
                  <span key={attribute} className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-700">
                    {attribute}
                  </span>
                ))}
              </div>

              <p className="mt-3 rounded-md bg-blue-50 px-3 py-2 text-sm leading-6 text-navy-800">{result.translatedNote}</p>
              <p className="mt-2 rounded-md bg-white px-3 py-2 text-sm leading-6 text-slate-700">
                <span className="font-bold text-slate-900">보정 사유: </span>
                {result.reason}
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                {axisLabels.map(([key, label]) => (
                  <div key={key} className="rounded bg-white px-2 py-1.5">
                    <div className="font-semibold text-slate-500">{label}</div>
                    <div className="font-mono font-bold text-slate-900">{formatSigned(result.expression[key])}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ScoreBox({ label, value, tone }: { label: string; value: number; tone: "amber" | "navy" }) {
  return (
    <div className={tone === "amber" ? "rounded-md bg-amber-50 p-3" : "rounded-md bg-navy-900 p-3 text-white"}>
      <p className={tone === "amber" ? "text-xs text-slate-500" : "text-xs text-slate-300"}>{label}</p>
      <p className="mt-1 text-2xl font-bold">{value.toFixed(1)}★</p>
    </div>
  );
}

function formatSigned(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}`;
}
