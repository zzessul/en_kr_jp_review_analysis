import { Brain, ChevronRight, LineChart, MessageSquareText } from "lucide-react";

const reasons = [
  "별점과 텍스트 감성의 불일치",
  "가격, 품질, 배송, 사용성, 디자인, 서비스, 호환성 등 속성별 감성",
  "직설형 / 완곡형 / 강조형 / 주관형 표현 패턴",
  "긍정 표현 뒤에 이어지는 아쉬움 표현",
  "같은 별점 안에서 나타나는 만족도 차이",
];

export default function CalibrationPanel() {
  return (
    <aside className="rounded-lg border border-blue-100 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-navy-800 text-white">
          <Brain size={22} />
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-700">표현 기반 만족도 분석</p>
          <h2 className="text-xl font-bold text-slate-950">별점 보정 모델</h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">
        리뷰의 표면적 별점이 아니라, 텍스트에 나타난 실제 만족도 신호를 분석해 보정 별점을 산출합니다.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-blue-50 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-navy-700">
            <MessageSquareText size={16} />
            불일치 리뷰 수
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-950">186개</p>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <LineChart size={16} />
            만족도 재계산
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-950">-0.5점</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="font-bold text-slate-900">분석 기준</p>
        <ul className="mt-3 space-y-2">
          {reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amberSearch" />
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
