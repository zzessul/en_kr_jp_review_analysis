import { useState } from "react";
import { Search, ShoppingCart, UserRound, X } from "lucide-react";

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
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
            <button type="button" onClick={() => setIsLoginOpen(true)} className="flex items-center gap-2 text-slate-100">
              <UserRound size={18} />
              로그인
            </button>
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
            <span>한·영·일 리뷰 분석</span>
            <span>새 제품 반응 탐색</span>
            <span>전자기기</span>
            <span>생활용품</span>
            <span>고객센터</span>
          </div>
        </div>
      </header>

      {isLoginOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4" role="dialog" aria-modal="true" aria-labelledby="login-title">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-navy-700">ReviewCal 계정</p>
                <h2 id="login-title" className="mt-1 text-2xl font-bold text-slate-950">
                  로그인
                </h2>
              </div>
              <button type="button" onClick={() => setIsLoginOpen(false)} aria-label="로그인 창 닫기" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-slate-700">이메일</span>
                <input
                  type="email"
                  className="w-full rounded-md border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  placeholder="reviewcal@example.com"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-slate-700">비밀번호</span>
                <input
                  type="password"
                  className="w-full rounded-md border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  placeholder="비밀번호 입력"
                />
              </label>
              <button
                type="button"
                onClick={() => setIsLoginOpen(false)}
                className="w-full rounded-md bg-amberSearch px-4 py-3 font-bold text-navy-950 transition hover:bg-amber-400"
              >
                로그인
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <button type="button" className="font-semibold text-navy-700 hover:underline">
                회원가입
              </button>
              <button type="button" className="text-slate-500 hover:text-slate-800">
                비밀번호 찾기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
