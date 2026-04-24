import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 公開エンドポイント（レビューフォームから呼ばれる）
  try {
    const store = await prisma.store.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        googleReviewUrl: true,
        googleMapsUrl: true,
        isActive: true,
      },
    });
    if (!store || !store.isActive) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }
    return NextResponse.json(store);
  } catch {
    return NextResponse.json({ error: "Failed to fetch store" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const result = await prisma.store.updateMany({
      where: { id: params.id, userId: session.user.id },
      data,
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }
    const updated = await prisma.store.findUnique({ where: { id: params.id } });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update store" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await prisma.store.deleteMany({
      where: { id: params.id, userId: session.user.id },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete store" }, { status: 500 });
  }
}
