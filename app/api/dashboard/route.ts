import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const stores = await prisma.store.findMany({
    where: { userId, isActive: true },
    include: { reviews: { select: { rating: true, redirected: true, createdAt: true } } },
    orderBy: { createdAt: "asc" },
  });

  // 全レビュー
  const allReviews = stores.flatMap((s) => s.reviews);
  const total = allReviews.length;
  const avgRating =
    total > 0
      ? Math.round((allReviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
      : 0;
  const googleRedirectRate =
    total > 0
      ? Math.round((allReviews.filter((r) => r.redirected).length / total) * 100)
      : 0;
  const lowRatingReviews = allReviews.filter((r) => r.rating < 4);
  const badReviewPreventRate =
    lowRatingReviews.length > 0
      ? Math.round(
          (lowRatingReviews.filter((r) => !r.redirected).length / lowRatingReviews.length) * 100
        )
      : 0;

  // 直近7ヶ月の月別集計
  const monthlyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (6 - i));
    const year = d.getFullYear();
    const month = d.getMonth();
    const label = `${month + 1}月`;
    const monthReviews = allReviews.filter((r) => {
      const rd = new Date(r.createdAt);
      return rd.getFullYear() === year && rd.getMonth() === month;
    });
    const positive = monthReviews.filter((r) => r.rating >= 4).length;
    const negative = monthReviews.filter((r) => r.rating < 4).length;
    return { month: label, positive, negative, total: positive + negative };
  });

  // 店舗サマリー
  const storeSummary = stores.map((s) => {
    const now = new Date();
    const thisMonth = s.reviews.filter((r) => {
      const d = new Date(r.createdAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    const avg =
      s.reviews.length > 0
        ? Math.round(
            (s.reviews.reduce((sum, r) => sum + r.rating, 0) / s.reviews.length) * 10
          ) / 10
        : 0;
    return {
      id: s.id,
      name: s.name,
      category: s.category,
      avgRating: avg,
      monthlyCount: thisMonth.length,
    };
  });

  // 直近レビュー10件（全店舗）
  const recentReviews = await prisma.review.findMany({
    where: { store: { userId } },
    include: { store: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({
    kpi: { totalReviews: total, avgRating, googleRedirectRate, badReviewPreventRate },
    monthlyData,
    stores: storeSummary,
    recentReviews: recentReviews.map((r) => ({
      id: r.id,
      store: r.store.name,
      rating: r.rating,
      comment: r.comment,
      redirected: r.redirected,
      createdAt: new Date(r.createdAt).toLocaleString("ja-JP", {
        month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
      }),
    })),
  });
}
