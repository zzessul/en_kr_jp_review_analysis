import { Tags } from "lucide-react";
import type { Review, ReviewExpressionType } from "../data";

const expressionStyle: Record<ReviewExpressionType, string> = {
  "별점-텍스트 일치": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "완곡한 불만": "bg-blue-50 text-blue-700 border-blue-200",
  "숨은 만족": "bg-amber-50 text-amber-700 border-amber-200",
  "속성 불만": "bg-orange-50 text-orange-700 border-orange-200",
  "강조형 긍정": "bg-violet-50 text-violet-700 border-violet-200",
  "혼합 감정": "bg-slate-50 text-slate-700 border-slate-200",
};

function RatingLine({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={muted ? "font-bold text-slate-700" : "font-bold text-navy-800"}>{value.toFixed(1)}점</span>
    </div>
  );
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-950">{review.userName}</h3>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${expressionStyle[review.expressionType]}`}>
              {review.expressionType}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{review.date}</p>
        </div>
        <div className="flex flex-wrap gap-4 rounded-md bg-slate-50 px-3 py-2">
          <RatingLine label="원래 별점" value={review.originalRating} muted />
          <RatingLine label="보정 별점" value={review.calibratedRating} />
        </div>
      </div>

      <h4 className="mt-4 text-lg font-bold text-slate-950">{review.title}</h4>
      <p className="mt-2 leading-7 text-slate-700">{review.body}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="flex items-center gap-1 font-bold text-slate-900">
          <Tags size={16} className="text-navy-700" />
          주요 속성
        </span>
        {review.attributes.map((attribute) => (
          <span key={attribute} className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
            {attribute}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
        <span className="font-bold text-slate-900">보정 사유: </span>
        {review.reason}
      </div>
    </article>
  );
}
