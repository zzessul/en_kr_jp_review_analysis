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

const reviewerNames: Record<ReviewLanguage, string[]> = {
  KR: [
    "김민서",
    "이준호",
    "박서연",
    "최지훈",
    "정하린",
    "강유진",
    "윤도현",
    "한지우",
    "오세은",
    "임태윤",
    "서민재",
    "신아영",
    "문채원",
    "장현우",
    "조은별",
    "백승민",
    "유나경",
    "권도윤",
    "송하늘",
    "남지안",
    "홍예린",
    "차민규",
    "배수아",
    "노현서",
    "심재원",
    "안소희",
    "전유림",
    "류지호",
    "고다은",
    "양서준",
    "문성민",
    "하연우",
    "김지아",
    "이도윤",
    "박채린",
    "최민재",
    "정서윤",
    "강현준",
    "윤아린",
    "한민수",
    "오지민",
    "임서현",
    "서준영",
    "신하은",
    "장예준",
    "조수빈",
    "권유나",
    "송민석",
    "남가은",
    "홍지수",
  ],
  EN: [
    "Emily Carter",
    "Daniel Brooks",
    "Sarah Mitchell",
    "James Parker",
    "Olivia Bennett",
    "Michael Turner",
    "Grace Wilson",
    "Ethan Reed",
    "Natalie Cooper",
    "Ryan Hayes",
    "Megan Scott",
    "Andrew Collins",
    "Sophia Morgan",
    "Lucas Ward",
    "Chloe Adams",
    "Benjamin Foster",
    "Hannah Clark",
    "Nathan Gray",
    "Lily Hughes",
    "Jacob Miller",
    "Ava Phillips",
    "Logan Sanders",
    "Zoe Richardson",
    "Caleb Price",
    "Emma Russell",
    "Noah Jenkins",
    "Mia Peterson",
    "Dylan Morris",
    "Ella Bryant",
    "Owen Kelly",
    "Claire Evans",
    "Henry Bell",
    "Julia Simmons",
    "Aaron Murphy",
    "Nora Bailey",
    "Luke Howard",
    "Isabella Cox",
    "Leo Hamilton",
    "Sophie Grant",
    "Miles Fisher",
    "Amelia Rogers",
    "Connor Perry",
    "Victoria Long",
    "Ian Coleman",
    "Ruby Barnes",
    "Adam Powell",
    "Madison Rivera",
    "Cole Jenkins",
    "Paige Butler",
    "Evan Ross",
  ],
  JP: [
    "佐藤美咲",
    "田中悠斗",
    "鈴木彩花",
    "高橋蓮",
    "伊藤紗季",
    "渡辺翔太",
    "山本結衣",
    "中村大輔",
    "小林奈々",
    "加藤健太",
    "吉田真央",
    "山田拓也",
    "佐々木陽菜",
    "山口亮",
    "松本千尋",
    "井上直樹",
    "木村愛",
    "林優介",
    "清水葵",
    "斎藤和也",
    "池田麻衣",
    "橋本陸",
    "森田香織",
    "石井颯太",
    "前田莉子",
    "藤田健",
    "岡田美月",
    "長谷川誠",
    "村上琴音",
    "近藤拓真",
    "石川由奈",
    "後藤隼人",
    "阿部真由",
    "遠藤航",
    "青木里奈",
    "坂本悠真",
    "福田彩乃",
    "太田和馬",
    "西村優花",
    "藤井大地",
    "三浦詩織",
    "岡本晴人",
    "中島芽衣",
    "原田翔",
    "藤原菜月",
    "小川直人",
    "松田凛",
    "中川悠",
    "竹内美穂",
    "森本海斗",
  ],
};

const languageOrder: Array<keyof SitePayload> = ["ko", "en", "ja"];

export const reviews: Review[] = languageOrder.flatMap((langKey) =>
  payload[langKey].reviews.map((review, index) => {
    const language = normalizeLanguage(review.language);
    return {
      ...review,
      language,
      id: reviewsOffset(langKey) + index + 1,
      userName: reviewerNames[language][index % reviewerNames[language].length],
      date: dateFromIndex(reviewsOffset(langKey) + index),
      title: review.title?.trim() ?? "",
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
