"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";
import { Star, TrendingUp, MessageSquare, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PIE_COLORS = ["#4f46e5", "#818cf8", "#a5b4fc", "#c4b5fd", "#e0e7ff"];

interface AnalyticsData {
  ratingDistribution: { star: string; count: number; percentage: number }[];
  trendData: { date: string; avg: number | null }[];
  monthlyData: { month: string; positive: number; negative: number }[];
  comments: {
    id: string; store: string; storeId: string; rating: number;
    comment: string | null; redirected: boolean; createdAt: string;
  }[];
  total: number;
}

function SkeletonCard({ height = 200 }: { height?: number }) {
  return <div className="animate-pulse bg-gray-100 rounded-xl" style={{ height }} />;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("全て");

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const filteredComments = (data?.comments ?? []).filter((c) => {
    if (filterRating === "高評価" && c.rating < 4) return false;
    if (filterRating === "要改善" && c.rating >= 4) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">評価分析</h1>
        <p className="text-sm text-gray-500 mt-1">
          評価データの詳細分析と傾向把握
          {data && <span className="ml-2 text-indigo-600 font-medium">（全{data.total}件）</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />評価分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <SkeletonCard /> : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={data?.ratingDistribution} cx="50%" cy="50%"
                      innerRadius={55} outerRadius={80} paddingAngle={3}
                      dataKey="count" nameKey="star">
                      {data?.ratingDistribution.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}件`, "件数"]}
                      contentStyle={{ border: "none", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {data?.ratingDistribution.map((item, i) => (
                    <div key={item.star} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <span className="text-sm text-gray-600 w-8">{item.star}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: PIE_COLORS[i] }} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-10 text-right">{item.percentage}%</span>
                      <span className="text-xs text-gray-400 w-14 text-right">{item.count}件</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 7-day trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />直近7日間トレンド
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <SkeletonCard /> : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data?.trendData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[1, 5]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ border: "none", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }}
                    formatter={(v) => [v !== null ? Number(v).toFixed(1) : "データなし", "平均評価"]} />
                  <Line type="monotone" dataKey="avg" stroke="#6366f1" strokeWidth={2.5}
                    dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Monthly bar */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-500" />月別件数推移
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <SkeletonCard /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data?.monthlyData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ border: "none", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="positive" name="高評価" stackId="a" fill="#6366f1" />
                  <Bar dataKey="negative" name="要改善" stackId="a" fill="#f0abfc" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comments */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              評価コメント一覧
              <Badge className="bg-gray-100 text-gray-600 border-0 ml-1">{filteredComments.length}件</Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={filterRating} onValueChange={(v) => setFilterRating(v ?? "全て")}>
                <SelectTrigger className="w-32 h-8 text-xs border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["全て", "高評価", "要改善"].map((r) => (
                    <SelectItem key={r} value={r} label={r} className="text-xs">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filteredComments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">まだ評価がありません</p>
          ) : (
            <div className="space-y-3">
              {filteredComments.map((c) => (
                <div key={c.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    c.rating >= 4 ? "bg-indigo-100 text-indigo-700" : c.rating === 3 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                  }`}>
                    {c.rating}★
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium text-gray-700">{c.store}</span>
                      {c.redirected ? (
                        <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">Google誘導済</Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">店内対処</Badge>
                      )}
                      <span className="text-xs text-gray-400">{c.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-600">{c.comment ?? "（コメントなし）"}</p>
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
