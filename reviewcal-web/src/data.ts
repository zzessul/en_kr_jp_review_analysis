export type ReviewExpressionType =
  | "별점-텍스트 일치"
  | "완곡한 불만"
  | "숨은 만족"
  | "속성 불만"
  | "강조형 긍정"
  | "혼합 감정";

export type Review = {
  id: number;
  userName: string;
  date: string;
  originalRating: number;
  calibratedRating: number;
  title: string;
  body: string;
  expressionType: ReviewExpressionType;
  attributes: string[];
  reason: string;
};

export const originalRatingDistribution = [
  { stars: 5, count: 742, share: 59 },
  { stars: 4, count: 221, share: 18 },
  { stars: 3, count: 126, share: 10 },
  { stars: 2, count: 78, share: 6 },
  { stars: 1, count: 81, share: 7 },
];

export const calibratedRatingDistribution = [
  { stars: 5, count: 382, share: 31 },
  { stars: 4, count: 416, share: 33 },
  { stars: 3, count: 271, share: 22 },
  { stars: 2, count: 119, share: 9 },
  { stars: 1, count: 60, share: 5 },
];

export const attributeSatisfaction = [
  { label: "가격", score: 86 },
  { label: "성능", score: 82 },
  { label: "디자인", score: 78 },
  { label: "품질", score: 68 },
  { label: "사용성", score: 62 },
  { label: "배송", score: 56 },
  { label: "서비스", score: 51 },
];

export const reviews: Review[] = [
  {
    id: 1,
    userName: "윤서린",
    date: "2026.05.18",
    originalRating: 5.0,
    calibratedRating: 3.4,
    title: "좋긴 한데 오래 쓰면 조금 아쉬워요",
    body: "처음 들었을 때 소음 차단은 확실히 좋았습니다. 다만 오래 착용하면 귀 주변이 답답하고 조작 버튼이 생각보다 불편해서 매일 쓰기에는 조금 아쉽습니다.",
    expressionType: "완곡한 불만",
    attributes: ["품질", "사용성"],
    reason:
      "별점은 높지만 '좋긴 한데', '조금 아쉽다'와 같은 완곡한 부정 표현이 포함되어 실제 만족도가 낮게 조정되었습니다.",
  },
  {
    id: 2,
    userName: "soundlover23",
    date: "2026.05.16",
    originalRating: 3.0,
    calibratedRating: 4.1,
    title: "가격 생각하면 성능은 꽤 좋습니다",
    body: "최고급 제품은 아니지만 이 가격대에서 노이즈 캔슬링과 배터리는 충분히 만족스럽습니다. 음질도 일상적으로 쓰기에는 부족함이 거의 없었습니다.",
    expressionType: "숨은 만족",
    attributes: ["가격", "성능"],
    reason:
      "중간 별점이지만 텍스트에서는 가격 대비 성능에 대한 긍정 표현이 강하게 나타나 만족도가 높게 조정되었습니다.",
  },
  {
    id: 3,
    userName: "김민재",
    date: "2026.05.11",
    originalRating: 4.0,
    calibratedRating: 2.8,
    title: "제품은 괜찮지만 배송과 응대가 아쉬웠어요",
    body: "헤드폰 자체는 나쁘지 않습니다. 그런데 배송이 예정보다 늦었고 문의 답변도 늦어서 구매 경험은 기대보다 좋지 않았습니다.",
    expressionType: "속성 불만",
    attributes: ["배송", "서비스"],
    reason:
      "전체 별점은 높지만 배송과 서비스 속성에서 부정 감성이 강하게 나타나 보정 별점이 낮아졌습니다.",
  },
  {
    id: 4,
    userName: "리뷰퀵",
    date: "2026.05.09",
    originalRating: 5.0,
    calibratedRating: 4.7,
    title: "소리도 착용감도 만족합니다",
    body: "저음이 안정적이고 착용감도 편합니다. 출퇴근길에 쓰기 좋고 배터리도 오래가서 전반적으로 만족합니다.",
    expressionType: "별점-텍스트 일치",
    attributes: ["성능", "사용성"],
    reason: "높은 별점과 텍스트의 긍정 만족도 표현이 일치해 보정 별점도 높게 유지되었습니다.",
  },
];
