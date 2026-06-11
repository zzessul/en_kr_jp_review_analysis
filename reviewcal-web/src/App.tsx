import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import CalibrationPanel from "./components/CalibrationPanel";
import Header from "./components/Header";
import LiveReviewAnalysis from "./components/LiveReviewAnalysis";
import ProductCard from "./components/ProductCard";
import ReviewCard from "./components/ReviewCard";
import ReviewFilters, { type ReviewFilterState } from "./components/ReviewFilters";
import ReviewSummary from "./components/ReviewSummary";
import { reviews, totalReviewCount, type Review } from "./data";

const initialFilters: ReviewFilterState = {
  sort: "latest",
  rating: "all",
  language: "all",
  expression: "all",
  query: "",
};

const featuredAudioReviewIds = [29, 62, 107, 101, 10];
const featuredAudioRank = new Map(featuredAudioReviewIds.map((id, index) => [id, index]));
const reviewsPerPage = 10;

export default function App() {
  const [filters, setFilters] = useState<ReviewFilterState>(initialFilters);
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReviews = useMemo(() => applyFilters(reviews, filters), [filters]);
  const featuredReviews = filteredReviews.filter(isFeaturedAudioReview);
  const pageCount = showAll ? Math.max(1, Math.ceil(filteredReviews.length / reviewsPerPage)) : 1;
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const pageStartIndex = (safeCurrentPage - 1) * reviewsPerPage;
  const visibleReviews = showAll ? filteredReviews.slice(pageStartIndex, pageStartIndex + reviewsPerPage) : featuredReviews;

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-6">
        <div className="mb-4 text-sm text-slate-500">홈 &gt; 전자기기 &gt; 무선 오디오 &gt; SoundMax AirBeat Pro</div>

        <ProductCard />

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
          <div>
            <ReviewSummary />
          </div>
          <div className="xl:sticky xl:top-28 xl:self-start">
            <CalibrationPanel />
          </div>
        </div>

        <section id="reviews" className="mt-6 space-y-4">
          <LiveReviewAnalysis />
          <ReviewFilters value={filters} onChange={handleFilterChange} totalCount={totalReviewCount} visibleCount={filteredReviews.length} />
          {showAll && filteredReviews.length > 0 && (
            <ReviewPagination
              currentPage={safeCurrentPage}
              pageCount={pageCount}
              pageStartIndex={pageStartIndex}
              pageSize={visibleReviews.length}
              totalCount={filteredReviews.length}
              onPageChange={setCurrentPage}
            />
          )}
          <div className="space-y-4">
            {visibleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            {visibleReviews.length === 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
                조건에 맞는 리뷰가 없습니다. 필터나 검색어를 조정해 주세요.
              </div>
            )}
          </div>
          {(showAll || filteredReviews.length > visibleReviews.length) && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setShowAll((current) => !current);
                  setCurrentPage(1);
                }}
                className="rounded-md bg-navy-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-800"
              >
                {showAll ? "대표 리뷰만 보기" : `전체 보기 (${filteredReviews.length.toLocaleString()}개)`}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );

  function handleFilterChange(nextFilters: ReviewFilterState) {
    setFilters(nextFilters);
    setCurrentPage(1);
  }
}

function ReviewPagination({
  currentPage,
  pageCount,
  pageStartIndex,
  pageSize,
  totalCount,
  onPageChange,
}: {
  currentPage: number;
  pageCount: number;
  pageStartIndex: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}) {
  const pageNumbers = getPageNumbers(currentPage, pageCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-sm font-semibold text-slate-600">
        {pageStartIndex + 1}-{pageStartIndex + pageSize}개 표시 / {totalCount.toLocaleString()}개
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 리뷰 페이지"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            aria-label={`${page}페이지`}
            onClick={() => onPageChange(page)}
            className={`h-9 min-w-9 rounded-md px-3 text-sm font-bold transition ${
              page === currentPage ? "bg-navy-900 text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          aria-label="다음 리뷰 페이지"
          disabled={currentPage === pageCount}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function getPageNumbers(currentPage: number, pageCount: number) {
  const start = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
  const end = Math.min(pageCount, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function applyFilters(source: Review[], filters: ReviewFilterState) {
  const query = filters.query.trim().toLowerCase();
  return source
    .filter((review) => {
      if (filters.rating === "5" && Math.round(review.originalRating) !== 5) return false;
      if (filters.rating === "4" && Math.round(review.originalRating) !== 4) return false;
      if (filters.rating === "3under" && review.originalRating > 3) return false;
      if (filters.language !== "all" && review.language !== filters.language) return false;
      if (filters.expression !== "all" && review.expressionType !== filters.expression) return false;
      if (query) {
        const haystack = [
          review.userName,
          review.languageLabel,
          review.title,
          review.body,
          review.translatedNote,
          review.reason,
          review.attributes.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    })
    .sort((a, b) => compareReviews(a, b, filters.sort));
}

function compareReviews(a: Review, b: Review, sort: ReviewFilterState["sort"]) {
  if (sort === "originalDesc") return b.originalRating - a.originalRating || b.calibratedRating - a.calibratedRating;
  if (sort === "calibratedDesc") return b.calibratedRating - a.calibratedRating || b.originalRating - a.originalRating;
  if (sort === "calibratedAsc") return a.calibratedRating - b.calibratedRating || b.originalRating - a.originalRating;
  if (sort === "mismatchDesc") {
    return Math.abs(b.originalRating - b.calibratedRating) - Math.abs(a.originalRating - a.calibratedRating);
  }
  if (sort === "attributeLow") return a.calibratedRating - b.calibratedRating;
  const featuredDifference = featuredScore(a) - featuredScore(b);
  if (featuredDifference !== 0) return featuredDifference;
  return dateValue(b.date) - dateValue(a.date);
}

function featuredScore(review: Review) {
  return featuredAudioRank.get(review.id) ?? Number.POSITIVE_INFINITY;
}

function isFeaturedAudioReview(review: Review) {
  return featuredAudioRank.has(review.id);
}

function dateValue(date: string) {
  const [year, month, day] = date.split(".").map(Number);
  return Date.UTC(year, month - 1, day);
}
