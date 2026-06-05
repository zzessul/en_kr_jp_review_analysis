export type ReviewLanguage = "KR" | "EN" | "JP";

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

export const languageSummaries = [
  {
    code: "KR",
    label: "한국어",
    pattern: "완곡한 단서 뒤에 아쉬움을 덧붙이는 표현",
    delta: "-0.4",
  },
  {
    code: "EN",
    label: "English",
    pattern: "장단점을 직접 나누어 쓰는 평가 표현",
    delta: "-0.1",
  },
  {
    code: "JP",
    label: "日本語",
    pattern: "정중하고 약한 부정 표현으로 불만을 완화",
    delta: "-0.6",
  },
];

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
    language: "KR",
    languageLabel: "한국어",
    userName: "윤서린",
    date: "2026.05.18",
    originalRating: 5.0,
    calibratedRating: 3.4,
    title: "좋긴 한데 오래 쓰면 조금 아쉬워요",
    body: "처음 들었을 때 소음 차단은 확실히 좋았습니다. 다만 오래 착용하면 귀 주변이 답답하고 조작 버튼이 생각보다 불편해서 매일 쓰기에는 조금 아쉽습니다.",
    translatedNote: "높은 별점 안에 '다만', '조금 아쉽다' 같은 완곡한 불만 단서가 포함됨",
    expressionType: "완곡한 불만",
    attributes: ["품질", "사용성"],
    languagePattern: "한국어 리뷰는 높은 별점을 주면서도 뒤쪽 문장에서 아쉬움을 완곡하게 덧붙이는 경향을 반영했습니다.",
    reason:
      "별점은 높지만 '좋긴 한데', '조금 아쉽다'와 같은 완곡한 부정 표현이 포함되어 실제 만족도가 낮게 조정되었습니다.",
  },
  {
    id: 2,
    language: "EN",
    languageLabel: "English",
    userName: "soundlover23",
    date: "2026.05.16",
    originalRating: 3.0,
    calibratedRating: 4.1,
    title: "Not perfect, but surprisingly good for the price",
    body: "It is not a premium headset, but for this price the noise cancelling and battery life are genuinely solid. I expected less, and it works better than I thought for commuting.",
    translatedNote: "중간 별점이지만 가격 대비 성능 만족을 직접적으로 강하게 표현함",
    expressionType: "숨은 만족",
    attributes: ["가격", "성능"],
    languagePattern: "영어 리뷰는 장점과 한계를 직접 분리해 쓰는 경우가 많아, 낮은 별점 안의 강한 긍정 표현을 별도로 반영했습니다.",
    reason:
      "중간 별점이지만 텍스트에서는 가격 대비 성능에 대한 긍정 표현이 강하게 나타나 만족도가 높게 조정되었습니다.",
  },
  {
    id: 3,
    language: "JP",
    languageLabel: "日本語",
    userName: "佐藤はるか",
    date: "2026.05.13",
    originalRating: 5.0,
    calibratedRating: 3.2,
    title: "音は良いですが、少し気になる点もあります",
    body: "音質はきれいで満足しています。ただ、長時間つけると少し重く感じますし、ボタン操作も慣れるまで使いにくいかもしれません。",
    translatedNote: "정중한 긍정 뒤에 '少し', 'かもしれません'으로 완화된 불편 표현이 이어짐",
    expressionType: "완곡한 불만",
    attributes: ["사용성", "착용감"],
    languagePattern: "일본어 리뷰는 부정 표현을 정중하고 약하게 완화하는 경우가 있어, 표현 강도보다 문맥상 불편 신호를 함께 반영했습니다.",
    reason:
      "높은 별점이지만 정중하게 완화된 착용감·조작 불편 표현이 반복되어 실제 만족도는 낮게 보정되었습니다.",
  },
  {
    id: 4,
    language: "EN",
    languageLabel: "English",
    userName: "Mina R.",
    date: "2026.05.11",
    originalRating: 4.0,
    calibratedRating: 2.8,
    title: "The headphones are fine, shipping was frustrating",
    body: "The product itself sounds okay, but the delivery was delayed twice and support replied very slowly. The buying experience was more frustrating than the rating suggests.",
    translatedNote: "제품 자체와 구매 경험을 분리해 배송·서비스 불만을 직접 언급함",
    expressionType: "속성 불만",
    attributes: ["배송", "서비스"],
    languagePattern: "영어 리뷰의 속성별 장단점 분리 표현을 활용해 제품 만족과 구매 경험 만족을 따로 계산했습니다.",
    reason:
      "전체 별점은 높지만 배송과 서비스 속성에서 부정 감성이 강하게 나타나 보정 별점이 낮아졌습니다.",
  },
  {
    id: 5,
    language: "KR",
    languageLabel: "한국어",
    userName: "김민재",
    date: "2026.05.10",
    originalRating: 4.0,
    calibratedRating: 4.4,
    title: "생각보다 차음이 좋아서 만족합니다",
    body: "엄청 고급스럽다고 보긴 어렵지만 출퇴근용으로는 충분합니다. 배터리도 오래가고 가격을 생각하면 만족도가 꽤 높습니다.",
    translatedNote: "겸손한 평가 문장 속에 가격·배터리 만족 표현이 뚜렷함",
    expressionType: "숨은 만족",
    attributes: ["가격", "배터리"],
    languagePattern: "한국어의 절제된 긍정 표현을 반영해, 표면 별점보다 텍스트 만족도가 높은 리뷰를 올려 봅니다.",
    reason:
      "절제된 표현이지만 가격과 배터리에 대한 긍정 감성이 일관되게 나타나 보정 별점이 높아졌습니다.",
  },
  {
    id: 6,
    language: "JP",
    languageLabel: "日本語",
    userName: "田中ゆう",
    date: "2026.05.08",
    originalRating: 4.0,
    calibratedRating: 4.0,
    title: "通勤用としては十分です",
    body: "ノイズキャンセリングは期待どおりで、電池持ちも問題ありません。価格を考えると、普段使いにはちょうど良いと思います。",
    translatedNote: "별점과 텍스트 만족도가 대체로 일치하는 안정적 평가",
    expressionType: "별점-텍스트 일치",
    attributes: ["성능", "가격"],
    languagePattern: "일본어의 정중한 평가 표현 안에서도 속성 감성이 별점과 일치하는 경우 보정 폭을 작게 유지했습니다.",
    reason: "원래 별점과 성능·가격에 대한 텍스트 만족도 표현이 일치해 보정 별점도 비슷하게 유지되었습니다.",
  },
];
