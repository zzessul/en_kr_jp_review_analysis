import { Search, ShoppingCart, UserRound } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-navy-950 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3">
        <div className="flex min-w-fit items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded bg-amberSearch text-lg font-black text-navy-950">R</div>
          <span className="text-2xl font-bold tracking-normal">ReviewCal</span>
        </div>

        <div className="hidden min-w-[150px] items-center rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 md:flex">
          전체 카테고리
          <span className="ml-auto text-xs">▼</span>
        </div>

        <div className="flex h-11 min-w-0 flex-1 overflow-hidden rounded-md bg-white">
          <select aria-label="카테고리 선택" className="hidden border-0 bg-slate-100 px-3 text-sm text-slate-700 outline-none sm:block">
            <option>전체</option>
            <option>전자기기</option>
            <option>음향기기</option>
          </select>
          <input
            aria-label="상품 검색"
            className="min-w-0 flex-1 px-4 text-slate-900 outline-none"
            placeholder="상품명, 브랜드, 리뷰 키워드 검색"
          />
          <button aria-label="검색" className="grid w-14 place-items-center bg-amberSearch text-navy-950">
            <Search size={21} strokeWidth={2.8} />
          </button>
        </div>

        <nav className="hidden items-center gap-5 text-sm lg:flex">
          <a className="flex items-center gap-2 text-slate-100" href="#reviews">
            <UserRound size={18} />
            로그인
          </a>
          <a className="flex items-center gap-2 font-semibold" href="#cart">
            <ShoppingCart size={20} />
            장바구니
          </a>
        </nav>
      </div>
      <div className="bg-navy-800">
        <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-5 py-2 text-sm text-slate-100">
          <span>오늘의 특가</span>
          <span>보정 평점 높은 상품</span>
          <span>만족도 보정 랭킹</span>
          <span>전자기기</span>
          <span>생활용품</span>
          <span>고객센터</span>
        </div>
      </div>
    </header>
  );
}
