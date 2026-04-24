"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Star, TrendingUp, Shield, MessageSquare, ArrowUpRight, Store } from "lucide-react";

interface DashboardData {
  kpi: {
    totalReviews: number;
    avgRating: number;
    googleRedirectRate: number;
    badReviewPreventRate: number;
  };
  monthlyData: { month: string; positive: number; negative: number; total: number }[];
  stores: { id: string; name: string; category: string | null; avgRating: number; monthlyCount: number }[];
  recentReviews: {
    id: string; store: string; rating: number; comment: string | null; redirected: boolean; createdAt: string;
  }[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : i - rating < 1 && i - rating > 0
              ? "fill-yellow-200 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-10 w-10 bg-gray-200 rounded-xl" />
          <div className="h-8 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-100 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const kpi = data?.kpi;
  const now = new Date();
  const label = `${now.getFullYear()}年${now.getMonth() + 1}月 ・ 全店舗集計`;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
        <Badge className="bg-green-100 text-green-700 border-green-200 text-sm px-3 py-1">
          ● リアルタイム更新中
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                    <ArrowUpRight className="w-3 h-3" />リアル
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {(kpi?.totalReviews ?? 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-1">総評価数</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                    <ArrowUpRight className="w-3 h-3" />DB
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{kpi?.avgRating ?? 0}</div>
                <div className="text-sm text-gray-500 mt-1">平均評価</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                    <ArrowUpRight className="w-3 h-3" />実績
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {kpi?.googleRedirectRate ?? 0}%
                </div>
                <div className="text-sm text-gray-500 mt-1">Google誘導率</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                    <ArrowUpRight className="w-3 h-3" />実績
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {kpi?.badReviewPreventRate ?? 0}%
                </div>
                <div className="text-sm text-gray-500 mt-1">悪評防止率</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900">月別評価推移</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[280px] bg-gray-50 animate-pulse rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data?.monthlyData ?? []} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ border: "none", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="positive" name="高評価（4-5★）" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="negative" name="要改善（1-3★）" fill="#f0abfc" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Store summary */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900">店舗別サマリー</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-9 h-9 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : data?.stores.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">店舗がまだありません</p>
            ) : (
              data?.stores.map((store) => (
                <div key={store.id} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Store className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{store.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating rating={store.avgRating} />
                      <span className="text-xs text-gray-500 font-medium">{store.avgRating}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">月間 {store.monthlyCount}件</div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent reviews */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900">最近の評価</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-xl bg-gray-50 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.recentReviews.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">まだ評価がありません</p>
          ) : (
            <div className="space-y-3">
              {data?.recentReviews.map((review) => (
                <div key={review.id} className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    review.rating >= 4 ? "bg-green-100 text-green-700"
                    : review.rating === 3 ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                  }`}>
                    {review.rating}★
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-700">{review.store}</span>
                      {review.redirected ? (
                        <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">Google誘導済</Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">店内対処</Badge>
                      )}
                      <span className="text-xs text-gray-400">{review.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">{review.comment ?? "（コメントなし）"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
