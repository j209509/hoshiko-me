// ============================================================
// hoshiko.me — 共通型定義
// ============================================================

// --------------------------------------------------------
// Store（店舗）
// --------------------------------------------------------
export type StoreCategory =
  | "ラーメン"
  | "カフェ"
  | "居酒屋"
  | "レストラン"
  | "ファストフード"
  | "その他";

export interface Store {
  id: string;
  name: string;
  address: string;
  category: StoreCategory;
  avgRating: number;
  monthlyCount: number;
  googleUrl: string;
  phone: string;
  googleConnected: boolean;
  notifyEmail: string;
  notifyThreshold: number; // この星以下で通知 (1-5)
}

// --------------------------------------------------------
// Review（レビュー）
// --------------------------------------------------------
export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export type ReviewCategory =
  | "料理"
  | "接客"
  | "待ち時間"
  | "環境"
  | "価格"
  | "その他";

export interface Review {
  id: string;
  storeId: string;
  store: string; // 表示用
  rating: ReviewRating;
  comment: string;
  category: ReviewCategory;
  redirected: boolean; // true = Googleへ誘導済み
  createdAt: string; // ISO 8601 or "YYYY-MM-DD HH:mm"
}

// --------------------------------------------------------
// KPI
// --------------------------------------------------------
export interface KpiData {
  totalReviews: number;
  avgRating: number;
  googleRedirectRate: number; // %
  badReviewPreventRate: number; // %
}

// --------------------------------------------------------
// Chart data
// --------------------------------------------------------
export interface MonthlyData {
  month: string;
  total: number;
  positive: number;
  negative: number;
}

export interface TrendData {
  date: string;
  avg: number;
}

export interface RatingDistribution {
  star: string; // "★5" 等
  count: number;
  percentage: number;
}

// --------------------------------------------------------
// QR Poster
// --------------------------------------------------------
export interface ColorTheme {
  name: string;
  bg: string;
  text: string;
  accent: string;
}

// --------------------------------------------------------
// Notification settings（将来 DB 保存用）
// --------------------------------------------------------
export interface NotificationSettings {
  storeId: string;
  notifyLowRating: boolean;
  lowRatingThreshold: ReviewRating;
  dailyReport: boolean;
  weeklyReport: boolean;
  notifyEmail: string;
}

// --------------------------------------------------------
// Review form（顧客向けフォーム）
// --------------------------------------------------------
export type ReviewStep = "rating" | "feedback" | "google" | "done";

// --------------------------------------------------------
// API response wrappers（将来の API Routes 用）
// --------------------------------------------------------
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// --------------------------------------------------------
// NextAuth session 拡張（将来 NextAuth.js v5 導入時）
// --------------------------------------------------------
export interface HoshikoUser {
  id: string;
  email: string;
  name: string;
  plan: "starter" | "standard" | "enterprise";
  storeIds: string[];
}
