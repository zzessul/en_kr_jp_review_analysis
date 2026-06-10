import { Search, SlidersHorizontal } from "lucide-react";
import type { ReviewExpressionType, ReviewLanguage } from "../data";

export type SortOption = "latest" | "originalDesc" | "calibratedDesc" | "calibratedAsc" | "mismatchDesc" | "attributeLow";
export type RatingFilter = "all" | "5" | "4" | "3under";
export type LanguageFilter = "all" | ReviewLanguage;
export type ExpressionFilter = "all" | ReviewExpressionType;

export type ReviewFilterState = {
  sort: SortOption;
  rating: RatingFilter;
  language: LanguageFilter;
  expression: ExpressionFilter;
  query: string;
};

type Props = {
  value: ReviewFilterState;
  onChange: (next: ReviewFilterState) => void;
  totalCount: number;
  visibleCount: number;
};

export default function ReviewFilters({ value, onChange, totalCount, visibleCount }: Props) {
  return (
    <section className="rounded-lg bg-white p-4 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <SlidersHorizontal size={19} className="text-navy-700" />
          리뷰 필터
        </div>
        <span className="text-sm text-slate-500">
          {visibleCount.toLocaleString()}개 표시 / 전체 {totalCount.toLocaleString()}개
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="리뷰 정렬"
          value={value.sort}
          onChange={(event) => update("sort", event.target.value as SortOption)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="latest">최신순</option>
          <option value="originalDesc">기존 별점 높은 순</option>
          <option value="calibratedDesc">보정 별점 높은 순</option>
          <option value="calibratedAsc">보정 별점 낮은 순</option>
          <option value="mismatchDesc">별점-텍스트 불일치 큰 순</option>
          <option value="attributeLow">속성 만족도 낮은 순</option>
        </select>
        <select
          aria-label="별점 필터"
          value={value.rating}
          onChange={(event) => update("rating", event.target.value as RatingFilter)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="all">전체 별점</option>
          <option value="5">5점</option>
          <option value="4">4점</option>
          <option value="3under">3점 이하</option>
        </select>
        <select
          aria-label="언어 필터"
          value={value.language}
          onChange={(event) => update("language", event.target.value as LanguageFilter)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="all">전체 언어</option>
          <option value="KR">한국어</option>
          <option value="EN">English</option>
          <option value="JP">日本語</option>
        </select>
        <select
          aria-label="표현 유형 필터"
          value={value.expression}
          onChange={(event) => update("expression", event.target.value as ExpressionFilter)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="all">전체 표현 유형</option>
          <option value="별점-텍스트 일치">별점-텍스트 일치</option>
          <option value="완곡한 불만">완곡한 불만</option>
          <option value="숨은 만족">숨은 만족</option>
          <option value="속성 불만">속성 불만</option>
          <option value="강조형 긍정">강조형 긍정</option>
          <option value="혼합 감정">혼합 감정</option>
        </select>
        <label className="ml-auto flex min-w-[240px] flex-1 items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-500 md:max-w-sm">
          <Search size={17} />
          <input
            aria-label="리뷰 검색"
            value={value.query}
            onChange={(event) => update("query", event.target.value)}
            className="min-w-0 flex-1 outline-none"
            placeholder="리뷰 내용 검색"
          />
        </label>
      </div>
    </section>
  );

  function update<K extends keyof ReviewFilterState>(key: K, nextValue: ReviewFilterState[K]) {
    onChange({ ...value, [key]: nextValue });
  }
}
