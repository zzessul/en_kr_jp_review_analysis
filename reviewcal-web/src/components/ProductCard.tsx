import { Heart, MessageSquareText, ShoppingCart, Truck } from "lucide-react";
import headphonesImage from "../assets/soundmax-headphones.png";

function Stars({ value }: { value: number }) {
  return (
    <span aria-label={`${value}점`} className="text-lg font-bold text-amber-500">
      {"★".repeat(Math.floor(value))}
      <span className="text-slate-300">{"★".repeat(5 - Math.floor(value))}</span>
    </span>
  );
}

export default function ProductCard() {
  return (
    <section className="grid gap-5 rounded-lg bg-white p-5 shadow-soft lg:grid-cols-[300px_1fr] xl:grid-cols-[300px_1fr_220px]">
      <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-100 to-blue-100 p-4">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white shadow-inner">
          <img
            src={headphonesImage}
            alt="SoundMax WH-1000X 무선 노이즈 캔슬링 헤드폰 제품 사진"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-navy-700">SoundMax 공식 스토어</p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-950 md:text-3xl">
          SoundMax WH-1000X 무선 노이즈 캔슬링 헤드폰
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Stars value={4.3} />
          <span className="font-semibold text-slate-800">원래 평균 별점 4.3</span>
          <span className="text-slate-500">리뷰 1,248개</span>
        </div>
        <div className="mt-5 grid gap-3 text-sm text-slate-700">
          <div className="flex items-center gap-2 rounded-md bg-slate-50 p-3">
            <MessageSquareText className="text-emerald-600" size={20} />
            한·영·일 리뷰 표현 기반 만족도 분석
          </div>
          <div className="flex items-center gap-2 rounded-md bg-slate-50 p-3">
            <Truck className="text-navy-700" size={20} />
            무료배송 · 내일 도착 예정
          </div>
        </div>
        <ul className="mt-5 space-y-2 text-sm text-slate-700">
          <li>• 적응형 노이즈 캔슬링 및 주변음 모드</li>
          <li>• 최대 36시간 배터리, 10분 급속 충전 지원</li>
          <li>• 언어별 감성 표현과 속성 감성을 반영한 보정 별점 제공</li>
        </ul>
      </div>

      <aside className="rounded-lg border border-slate-200 p-4">
        <p className="text-sm text-slate-500">판매가</p>
        <p className="mt-1 text-3xl font-bold text-slate-950">₩289,000</p>
        <p className="mt-3 text-sm text-emerald-700">재고 있음</p>
        <div className="mt-4 space-y-2">
          <button className="flex w-full items-center justify-center gap-2 rounded-md bg-amberSearch px-4 py-3 font-bold text-navy-950 transition hover:bg-amber-400">
            <ShoppingCart size={19} />
            장바구니 담기
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">
            <Heart size={18} />
            관심상품
          </button>
        </div>
      </aside>
    </section>
  );
}
