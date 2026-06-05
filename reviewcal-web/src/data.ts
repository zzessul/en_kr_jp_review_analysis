export type ReviewStatus = "정상" | "과대평가 의심" | "신뢰도 낮음";

export type Review = {
  id: number;
  userName: string;
  date: string;
  originalRating: number;
  calibratedRating: number;
  title: string;
  body: string;
  verified: boolean;
  status: ReviewStatus;
  reason: string;
};

export const ratingDistribution = [
  { stars: 5, count: 742, share: 59 },
  { stars: 4, count: 221, share: 18 },
  { stars: 3, count: 126, share: 10 },
  { stars: 2, count: 78, share: 6 },
  { stars: 1, count: 81, share: 7 },
];

export const reviews: Review[] = [
  {
    id: 1,
    userName: "윤서린",
    date: "2026.05.18",
    originalRating: 5,
    calibratedRating: 4.2,
    title: "출퇴근 소음 차단이 확실히 좋아요",
    body: "지하철에서 음악을 작게 틀어도 주변 소음이 많이 줄어듭니다. 착용감도 안정적이고 통화 품질도 기대보다 괜찮았습니다.",
    verified: true,
    status: "정상",
    reason: "구매자 리뷰이며 텍스트-별점 일관성이 높음",
  },
  {
    id: 2,
    userName: "soundlover23",
    date: "2026.05.16",
    originalRating: 5,
    calibratedRating: 2.9,
    title: "무조건 최고입니다 강력 추천",
    body: "완전 최고 최고 최고입니다. 배송도 최고고 음질도 최고입니다. 주변 사람에게 모두 추천하고 싶은 제품입니다.",
    verified: false,
    status: "과대평가 의심",
    reason: "유사 표현 반복 및 작성 시점 집중도가 높음",
  },
  {
    id: 3,
    userName: "김민재",
    date: "2026.05.11",
    originalRating: 4,
    calibratedRating: 3.8,
    title: "가격 대비 만족하지만 고음은 살짝 아쉬움",
    body: "저음 표현과 노이즈 캔슬링은 만족스럽습니다. 다만 오래 착용하면 귀 주변이 조금 답답하고 고음이 날카롭게 들릴 때가 있습니다.",
    verified: true,
    status: "정상",
    reason: "감성 점수와 별점이 대체로 일치함",
  },
  {
    id: 4,
    userName: "리뷰퀵",
    date: "2026.05.09",
    originalRating: 5,
    calibratedRating: 3.1,
    title: "좋아요",
    body: "좋아요. 아주 좋아요. 추천합니다.",
    verified: false,
    status: "신뢰도 낮음",
    reason: "짧은 리뷰 길이와 과도한 긍정 표현이 감지됨",
  },
];
