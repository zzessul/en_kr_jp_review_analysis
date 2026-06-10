import sitePayload from "./site_payload.json";

export type ReviewLanguage = "KR" | "EN" | "JP";
type PayloadLanguageCode = ReviewLanguage | "KO" | "JA";

export type ReviewExpressionType =
  | "별점-텍스트 일치"
  | "완곡한 불만"
  | "숨은 만족"
  | "속성 불만"
  | "강조형 긍정"
  | "혼합 감정";

export type Review = {
  id: number;
  language: ReviewLanguage;
  languageLabel: string;
  userName: string;
  date: string;
  originalRating: number;
  calibratedRating: number;
  title: string;
  body: string;
  translatedNote: string;
  expressionType: ReviewExpressionType;
  attributes: string[];
  languagePattern: string;
  reason: string;
};

type PayloadReview = Omit<Review, "id" | "userName" | "date" | "language"> & {
  language: PayloadLanguageCode;
};

type PayloadLanguage = {
  summary: {
    language: PayloadLanguageCode;
    languageLabel: string;
    n_reviews: number;
    star_summary: { observed_mean: number; calibrated_mean: number; delta: number };
    originalRatingDistribution: { stars: number; count: number; share: number }[];
    calibratedRatingDistribution: { stars: number; count: number; share: number }[];
    attributeSatisfaction: { label: string; score: number; mention_rate?: number }[];
    languagePattern: string;
  };
  reviews: PayloadReview[];
};

type SitePayload = {
  en: PayloadLanguage;
  ko: PayloadLanguage;
  ja: PayloadLanguage;
};

const payload = sitePayload as SitePayload;

const reviewerPrefix: Record<ReviewLanguage, string> = {
  KR: "kr-reviewer",
  EN: "en-reviewer",
  JP: "jp-reviewer",
};

const languageOrder: Array<keyof SitePayload> = ["ko", "en", "ja"];

export const reviews: Review[] = languageOrder.flatMap((langKey) =>
  payload[langKey].reviews.map((review, index) => {
    const language = normalizeLanguage(review.language);
    return {
      ...review,
      language,
      id: reviewsOffset(langKey) + index + 1,
      userName: `${reviewerPrefix[language]}-${String(index + 1).padStart(2, "0")}`,
      date: dateFromIndex(reviewsOffset(langKey) + index),
      title: review.title || fallbackTitle(review),
      attributes: review.attributes.length ? review.attributes : ["표현"],
    };
  }),
);

export const totalReviewCount = reviews.length;

export const languageSummaries = languageOrder.map((langKey) => {
  const summary = payload[langKey].summary;
  return {
    code: normalizeLanguage(summary.language),
    label: summary.languageLabel,
    pattern: summary.languagePattern,
    delta: `${summary.star_summary.delta > 0 ? "+" : ""}${summary.star_summary.delta.toFixed(2)}`,
    count: summary.n_reviews,
  };
});

export const originalRatingDistribution = aggregateDistribution("originalRating");
export const calibratedRatingDistribution = aggregateDistribution("calibratedRating");
export const attributeSatisfaction = aggregateAttributeSatisfaction();

function reviewsOffset(langKey: keyof SitePayload) {
  if (langKey === "ko") return 0;
  if (langKey === "en") return payload.ko.reviews.length;
  return payload.ko.reviews.length + payload.en.reviews.length;
}

function normalizeLanguage(language: PayloadLanguageCode): ReviewLanguage {
  if (language === "KO") return "KR";
  if (language === "JA") return "JP";
  return language;
}

function dateFromIndex(index: number) {
  const base = new Date(Date.UTC(2026, 4, 28));
  base.setUTCDate(base.getUTCDate() - index);
  return `${base.getUTCFullYear()}.${String(base.getUTCMonth() + 1).padStart(2, "0")}.${String(base.getUTCDate()).padStart(2, "0")}`;
}

function fallbackTitle(review: PayloadReview) {
  const trimmed = review.body.trim();
  if (!trimmed) return `${review.languageLabel} 리뷰`;
  return trimmed.length > 44 ? `${trimmed.slice(0, 44)}...` : trimmed;
}

function aggregateDistribution(field: "originalRating" | "calibratedRating") {
  const counts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((review) => Math.round(review[field]) === stars).length;
    return { stars, count, share: Math.round((count / Math.max(reviews.length, 1)) * 100) };
  });
  return counts;
}

function aggregateAttributeSatisfaction() {
  const byLabel = new Map<string, { total: number; count: number }>();
  for (const langKey of languageOrder) {
    for (const item of payload[langKey].summary.attributeSatisfaction) {
      const prev = byLabel.get(item.label) ?? { total: 0, count: 0 };
      byLabel.set(item.label, { total: prev.total + item.score, count: prev.count + 1 });
    }
  }
  return Array.from(byLabel.entries())
    .map(([label, value]) => ({ label, score: Math.round(value.total / value.count) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}
