import { ArrowDown, BarChart3, Gauge } from "lucide-react";
import { attributeSatisfaction, calibratedRatingDistribution, originalRatingDistribution } from "../data";

function MetricCard({ label, value, tone }: { label: string; value: string; tone?: "blue" | "amber" }) {
  return (
    <div className={`rounded-lg border p-4 ${tone === "blue" ? "border-blue-100 bg-blue-50" : "border-amber-100 bg-amber-50"}`}>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

export default function ReviewSummary() {
  return (
    <section className="rounded-lg bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-navy-700">표현 기반 만족도 분석</p>
          <h2 className="text-2xl font-bold text-slate-950">고객 리뷰</h2>
        </div>
        <div className="rounded-lg bg-navy-950 px-5 py-3 text-white">
          <p className="text-xs text-slate-300">Before → After</p>
          <p className="text-2xl font-bold">4.3 → 3.8</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <MetricCard label="기존 평균 별점" value="4.3 / 5.0" tone="amber" />
        <MetricCard label="보정 평균 별점" value="3.8 / 5.0" tone="blue" />
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-navy-700">
            <ArrowDown size={18} />
            보정 후 -0.5점
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            리뷰 텍스트의 실제 만족도 표현을 반영해 별점을 재계산했습니다.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-navy-100 bg-navy-900 p-4 text-white">
        <p className="text-sm leading-6 text-slate-100">
          별점은 같아도 만족도는 다를 수 있습니다. ReviewCal은 리뷰 텍스트의 표현과 속성 감성을 분석해,
          소비자가 실제로 느낀 만족도에 가까운 순서로 리뷰를 다시 보여줍니다.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="grid gap-5 md:grid-cols-2">
          <Distribution title="기존 별점 분포" rows={originalRatingDistribution} color="bg-amberSearch" />
          <Distribution title="보정 별점 분포" rows={calibratedRatingDistribution} color="bg-navy-700" />
          <div className="rounded-lg border border-slate-200 p-4 md:col-span-2">
            <div className="mb-3 flex items-center gap-2 font-bold text-slate-900">
              <BarChart3 size={20} className="text-navy-700" />
              속성별 만족도
            </div>
            <div className="space-y-3">
              {attributeSatisfaction.map((row) => (
                <div key={row.label} className="grid grid-cols-[64px_1fr_48px] items-center gap-3 text-sm">
                  <span className="font-semibold text-slate-700">{row.label}</span>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-navy-700" style={{ width: `${row.score}%` }} />
                  </div>
                  <span className="text-right text-slate-500">{row.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-900">평균 비교</p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">기존 별점</span>
              <span className="text-xl font-bold text-amber-600">4.3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">보정 별점</span>
              <span className="text-xl font-bold text-navy-800">3.8</span>
            </div>
          </div>
          <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
            5점 리뷰 중 실제 만족도 낮은 리뷰 94개, 3점 리뷰 중 실제 만족도 높은 리뷰 57개가 평균 보정에 반영되었습니다.
          </div>
        </div>
      </div>
    </section>
  );
}

function Distribution({
  title,
  rows,
  color,
}: {
  title: string;
  rows: { stars: number; count: number; share: number }[];
  color: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-3 flex items-center gap-2 font-bold text-slate-900">
        <Gauge size={20} className="text-navy-700" />
        {title}
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.stars} className="grid grid-cols-[48px_1fr_72px] items-center gap-3 text-sm">
            <span className="font-semibold text-slate-700">{row.stars}점</span>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${row.share}%` }} />
            </div>
            <span className="text-right text-slate-500">{row.count}개</span>
          </div>
        ))}
      </div>
    </div>
  );
}
