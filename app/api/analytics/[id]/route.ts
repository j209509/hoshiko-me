import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const store = await prisma.store.findFirst({
      where: { id: params.id, userId: session.user.id },
    });
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const reviews = await prisma.review.findMany({
      where: { storeId: params.id },
      orderBy: { createdAt: "desc" },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const ratingDistribution = [1, 2, 3, 4, 5].map((star) => ({
      star: `★${star}`,
      count: reviews.filter((r) => r.rating === star).length,
      percentage:
        reviews.length > 0
          ? Math.round(
              (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
            )
          : 0,
    }));

    // 直近30日のデイリー集計
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      date.setHours(0, 0, 0, 0);
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      const dayReviews = reviews.filter(
        (r) => r.createdAt >= date && r.createdAt < next
      );
      return {
        date: date.toISOString().split("T")[0],
        avg:
          dayReviews.length > 0
            ? Math.round(
                (dayReviews.reduce((s, r) => s + r.rating, 0) / dayReviews.length) * 10
              ) / 10
            : null,
        count: dayReviews.length,
      };
    });

    return NextResponse.json({
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      last30Days,
      googleRedirectRate:
        reviews.length > 0
          ? Math.round(
              (reviews.filter((r) => r.redirected).length / reviews.length) * 100
            )
          : 0,
      badReviewPreventRate:
        reviews.length > 0
          ? Math.round(
              (reviews.filter((r) => r.rating < 4 && !r.redirected).length /
                Math.max(reviews.filter((r) => r.rating < 4).length, 1)) *
                100
            )
          : 0,
      recentReviews: reviews.slice(0, 10),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
