import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const reviews = await prisma.review.findMany({
    where: { store: { userId } },
    include: { store: { select: { name: true, id: true } } },
    orderBy: { createdAt: "desc" },
  });

  const total = reviews.length;

  // 評価分布
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return {
      star: `${star}★`,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  // 直近7日間トレンド（日別平均評価）
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const dayReviews = reviews.filter((r) => {
      const rd = new Date(r.createdAt);
      return rd.toDateString() === d.toDateString();
    });
    const avg =
      dayReviews.length > 0
        ? Math.round((dayReviews.reduce((s, r) => s + r.rating, 0) / dayReviews.length) * 10) / 10
        : null;
    return { date: label, avg };
  });

  // 月別件数（7ヶ月）
  const monthlyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (6 - i));
    const year = d.getFullYear();
    const month = d.getMonth();
    const label = `${month + 1}月`;
    const monthReviews = reviews.filter((r) => {
      const rd = new Date(r.createdAt);
      return rd.getFullYear() === year && rd.getMonth() === month;
    });
    return {
      month: label,
      positive: monthReviews.filter((r) => r.rating >= 4).length,
      negative: monthReviews.filter((r) => r.rating < 4).length,
    };
  });

  // コメント一覧（最新100件）
  const comments = reviews.slice(0, 100).map((r) => ({
    id: r.id,
    store: r.store.name,
    storeId: r.store.id,
    rating: r.rating,
    comment: r.comment,
    redirected: r.redirected,
    createdAt: new Date(r.createdAt).toLocaleString("ja-JP", {
      month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
    }),
  }));

  return NextResponse.json({ ratingDistribution, trendData, monthlyData, comments, total });
}
