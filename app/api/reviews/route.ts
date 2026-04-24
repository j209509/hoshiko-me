import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { storeId, rating, comment } = await req.json();

    if (!storeId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, googleReviewUrl: true, notifyThreshold: true },
    });
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const redirected = rating >= 4 && !!store.googleReviewUrl;

    const review = await prisma.review.create({
      data: {
        storeId,
        rating,
        comment: comment || null,
        redirected,
      },
    });

    return NextResponse.json({
      review,
      redirectToGoogle: redirected,
      googleReviewUrl: store.googleReviewUrl,
    });
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
