import CalibrationPanel from "./components/CalibrationPanel";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ReviewCard from "./components/ReviewCard";
import ReviewFilters from "./components/ReviewFilters";
import ReviewSummary from "./components/ReviewSummary";
import { reviews } from "./data";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-6">
        <div className="mb-4 text-sm text-slate-500">홈 &gt; 전자기기 &gt; 헤드폰 &gt; SoundMax WH-1000X</div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <ProductCard />
            <ReviewSummary />
          </div>
          <div className="xl:sticky xl:top-28 xl:self-start">
            <CalibrationPanel />
          </div>
        </div>

        <section id="reviews" className="mt-6 space-y-4">
          <ReviewFilters />
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
