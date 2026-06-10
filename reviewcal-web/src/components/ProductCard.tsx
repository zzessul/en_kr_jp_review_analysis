import { useState } from "react";
import { Heart, MessageSquareText, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import headphonesImage from "../assets/soundmax-headphones.png";

function Stars({ value }: { value: number }) {
  return (
    <span aria-label={`${value}점`} className="text-lg font-bold text-amber-500">
      {"★".repeat(Math.floor(value))}
      <span className="text-slate-300">{"★".repeat(5 - Math.floor(value))}</span>
    </span>
  );
}

const productViews = [
  { label: "정면", className: "scale-100 object-center" },
  { label: "측면", className: "scale-110 object-[62%_50%]" },
  { label: "상세", className: "scale-125 object-[42%_44%]" },
  { label: "패키지", className: "scale-95 object-[50%_54%]" },
];

const colors = [
  { name: "미드나잇 네이비", value: "bg-navy-900" },
  { name: "클래식 블랙", value: "bg-slate-950" },
  { name: "라이트 실버", value: "bg-slate-200" },
  { name: "샌드 베이지", value: "bg-stone-300" },
];

export default function ProductCard() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedView, setSelectedView] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0].name);

  return (
    <section className="grid gap-6 rounded-lg bg-white p-5 shadow-soft lg:grid-cols-[420px_1fr] xl:grid-cols-[440px_1fr_250px]">
      <div className="grid gap-3 sm:grid-cols-[74px_1fr]">
        <div className="order-2 grid grid-cols-4 gap-2 sm:order-1 sm:grid-cols-1">
          {productViews.map((view, index) => (
            <button
              key={view.label}
              type="button"
              onClick={() => setSelectedView(index)}
              aria-label={`${view.label} 제품 사진 보기`}
              className={`h-16 overflow-hidden rounded-md border bg-white p-1 transition sm:h-20 ${
                selectedView === index ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <img src={headphonesImage} alt="" className={`h-full w-full object-cover ${view.className}`} />
            </button>
          ))}
        </div>

        <div className="order-1 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:order-2">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white shadow-inner">
            <img
              src={headphonesImage}
              alt={`SoundMax WH-1000X 무선 노이즈 캔슬링 헤드폰 ${productViews[selectedView].label} 사진`}
              className={`h-full w-full object-cover transition duration-300 ${productViews[selectedView].className}`}
            />
          </div>
          <p className="mt-3 text-center text-sm font-semibold text-slate-600">{productViews[selectedView].label} 보기</p>
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
          <span className="text-slate-500">분석 리뷰 150개</span>
        </div>

        <div className="mt-5 border-y border-slate-200 py-4">
          <div>
            <p className="text-sm font-bold text-slate-900">색상</p>
            <p className="mt-1 text-sm text-slate-500">{selectedColor}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={`${color.name} 선택`}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm font-semibold transition ${
                    selectedColor === color.name ? "border-amber-500 ring-2 ring-amber-100" : "border-slate-300"
                  }`}
                >
                  <span className={`h-6 w-6 rounded-full ${color.value}`} />
                  <span className="text-slate-700">{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-slate-700 md:grid-cols-3">
          <div className="rounded-md bg-slate-50 p-3">
            <p className="font-bold text-slate-900">노이즈 캔슬링</p>
            <p className="mt-1 text-slate-500">적응형 ANC</p>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <p className="font-bold text-slate-900">배터리</p>
            <p className="mt-1 text-slate-500">최대 36시간</p>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <p className="font-bold text-slate-900">연결</p>
            <p className="mt-1 text-slate-500">멀티포인트 지원</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-slate-700">
          <div className="flex items-center gap-2 rounded-md bg-blue-50 p-3 text-navy-800">
            <MessageSquareText className="text-navy-700" size={20} />
            리뷰 텍스트를 반영한 보정 별점과 속성별 만족도 제공
          </div>
          <div className="flex items-center gap-2 rounded-md bg-slate-50 p-3">
            <ShieldCheck className="text-emerald-600" size={20} />
            공식 스토어 정품 · 1년 무상 보증
          </div>
        </div>
      </div>

      <aside className="rounded-lg border border-slate-200 p-4 xl:sticky xl:top-32 xl:self-start">
        <p className="text-sm text-slate-500">판매가</p>
        <p className="mt-1 text-3xl font-bold text-slate-950">₩289,000</p>
        <p className="mt-2 text-sm text-slate-500">카드사 즉시할인 최대 7%</p>
        <div className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2 font-bold">
            <Truck size={18} />
            무료배송
          </div>
          <p className="mt-1">내일 도착 예정 · 재고 있음</p>
        </div>
        <div className="mt-4 space-y-2">
          <button className="flex w-full items-center justify-center gap-2 rounded-md bg-amberSearch px-4 py-3 font-bold text-navy-950 transition hover:bg-amber-400">
            <ShoppingCart size={19} />
            장바구니 담기
          </button>
          <button className="w-full rounded-md bg-navy-900 px-4 py-3 font-bold text-white transition hover:bg-navy-800">바로 구매</button>
          <button
            type="button"
            onClick={() => setIsFavorite((current) => !current)}
            aria-pressed={isFavorite}
            className={`flex w-full items-center justify-center gap-2 rounded-md border px-4 py-3 font-semibold transition ${
              isFavorite
                ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "관심상품 등록됨" : "관심상품"}
          </button>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          구매 후 작성된 리뷰를 바탕으로 별점과 텍스트 만족도의 차이를 함께 보여줍니다.
        </p>
      </aside>
    </section>
  );
}
