import { Brain, ChevronRight, Info, ShieldAlert } from "lucide-react";

const reasons = ["반복 표현이 많은 리뷰", "구매자 리뷰 여부", "작성 시점 집중도", "감성 점수와 별점 불일치"];

export default function CalibrationPanel() {
  return (
    <aside className="rounded-lg border border-blue-100 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-navy-800 text-white">
          <Brain size={22} />
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-700">AI 별점 보정 모델</p>
          <h2 className="text-xl font-bold text-slate-950">Rating Calibration Model</h2>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-rose-50 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-rose-700">
            <ShieldAlert size={16} />
            과대평가 리뷰
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-950">186개</p>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Info size={16} />
            낮은 신뢰도
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-950">14.9%</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="font-bold text-slate-900">보정 근거</p>
        <ul className="mt-3 space-y-2">
          {reasons.map((reason) => (
            <li key={reason} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="h-2 w-2 rounded-full bg-amberSearch" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-navy-900 px-4 py-3 font-semibold text-white transition hover:bg-navy-800">
        모델 설명 보기
        <ChevronRight size={18} />
      </button>
    </aside>
  );
}
