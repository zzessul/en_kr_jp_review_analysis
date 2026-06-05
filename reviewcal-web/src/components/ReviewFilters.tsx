import { Search, SlidersHorizontal } from "lucide-react";

export default function ReviewFilters() {
  return (
    <section className="rounded-lg bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <SlidersHorizontal size={19} className="text-navy-700" />
          리뷰 필터
        </div>
        <select className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
          <option>최신순</option>
          <option>보정 점수 낮은 순</option>
          <option>의심 리뷰 우선</option>
        </select>
        <select className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
          <option>전체 별점</option>
          <option>5점</option>
          <option>4점</option>
          <option>3점 이하</option>
        </select>
        <select className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
          <option>전체 리뷰 유형</option>
          <option>구매자 리뷰</option>
          <option>과대평가 의심</option>
          <option>신뢰도 낮음</option>
        </select>
        <label className="ml-auto flex min-w-[240px] flex-1 items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-500 md:max-w-sm">
          <Search size={17} />
          <input className="min-w-0 flex-1 outline-none" placeholder="리뷰 내용 검색" />
        </label>
      </div>
    </section>
  );
}
