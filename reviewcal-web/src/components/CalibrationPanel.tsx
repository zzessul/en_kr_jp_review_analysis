import { useState } from "react";
import { Brain, ChevronRight, LineChart, MessageSquareText, X } from "lucide-react";

const reasons = [
  "같은 별점 안에서 언어별로 달라지는 감성 표현 방식",
  "별점과 텍스트 감성의 불일치",
  "가격, 품질, 배송, 사용성, 디자인, 서비스, 호환성 등 속성별 감성",
  "한국어·영어·일본어의 직설형 / 완곡형 / 강조형 / 주관형 표현 패턴",
  "긍정 표현 뒤에 이어지는 아쉬움 표현",
  "새 제품 리뷰에서 초기에 나타나는 반응 변화",
];

export default function CalibrationPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <aside className="rounded-lg border border-blue-100 bg-white p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-navy-800 text-white">
            <Brain size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy-700">한·영·일 표현 기반 만족도 분석</p>
            <h2 className="text-xl font-bold text-slate-950">별점 보정 모델</h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-700">
          리뷰의 표면적 별점이 아니라, 한국어·영어·일본어 텍스트에 나타난 실제 만족도 신호를 분석해 보정 별점을 산출합니다.
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
              새 제품 반응
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-950">초기 탐색</p>
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

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-navy-900 px-4 py-3 font-semibold text-white transition hover:bg-navy-800"
        >
          모델 설명 보기
          <ChevronRight size={18} />
        </button>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4" role="dialog" aria-modal="true" aria-labelledby="model-description-title">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-navy-700">ReviewCal 안내</p>
                <h2 id="model-description-title" className="mt-1 text-2xl font-bold text-slate-950">
                  별점은 같아도 만족도는 다를 수 있습니다
                </h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="모델 설명 닫기" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
              <p>
                ReviewCal은 리뷰의 별점을 그대로만 보지 않고, 리뷰 문장 속에 들어 있는 만족과 아쉬움의 표현을 함께 읽어
                보정 별점을 계산합니다. 예를 들어 5점을 남긴 리뷰라도 “좋긴 한데 오래 쓰면 불편해요”처럼 아쉬움이 뚜렷하면
                실제 만족도는 조금 낮게 볼 수 있습니다.
              </p>
              <p>
                반대로 3점 리뷰라도 “가격 대비 성능은 기대 이상이에요”처럼 긍정적인 경험이 강하게 드러나면, 텍스트가 말하는
                만족도를 반영해 보정 별점이 높아질 수 있습니다.
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <InfoStep title="1. 표현 읽기" body="직설적인 칭찬, 완곡한 불만, 강조 표현처럼 리뷰가 말하는 방식을 살펴봅니다." />
              <InfoStep title="2. 속성 나누기" body="가격, 품질, 배송, 사용성처럼 어떤 부분에 만족하거나 아쉬워하는지 구분합니다." />
              <InfoStep title="3. 별점 보정" body="별점과 텍스트가 얼마나 잘 맞는지 비교해 실제 만족도에 가까운 점수로 다시 계산합니다." />
            </div>

            <div className="mt-5 rounded-md bg-blue-50 p-4 text-sm leading-6 text-navy-800">
              이 점수는 리뷰를 좋다/나쁘다로 단정하기 위한 것이 아니라, 소비자가 리뷰를 볼 때 “텍스트상 만족도가 높은 리뷰”와
              “별점은 높지만 아쉬움이 많은 리뷰”를 더 쉽게 비교하도록 돕는 기준입니다.
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-5 w-full rounded-md bg-navy-900 px-4 py-3 font-bold text-white transition hover:bg-navy-800"
            >
              이해했어요
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function InfoStep({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="font-bold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
