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

const initialVisibleCount = 12;

export default function App() {
  const [filters, setFilters] = useState<ReviewFilterState>(initialFilters);
  const [showAll, setShowAll] = useState(false);

  const filteredReviews = useMemo(() => applyFilters(reviews, filters), [filters]);
  const visibleReviews = showAll ? filteredReviews : filteredReviews.slice(0, initialVisibleCount);

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-6">
        <div className="mb-4 text-sm text-slate-500">홈 &gt; 전자기기 &gt; 헤드폰 &gt; SoundMax WH-1000X</div>

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
          <ReviewFilters value={filters} onChange={setFilters} totalCount={totalReviewCount} visibleCount={filteredReviews.length} />
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
          {filteredReviews.length > initialVisibleCount && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((current) => !current)}
                className="rounded-md bg-navy-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-800"
              >
                {showAll ? "일부만 보기" : `전체 보기 (${filteredReviews.length.toLocaleString()}개)`}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
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
  return dateValue(b.date) - dateValue(a.date);
}

function dateValue(date: string) {
  const [year, month, day] = date.split(".").map(Number);
  return Date.UTC(year, month - 1, day);
}
