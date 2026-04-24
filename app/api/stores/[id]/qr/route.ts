import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/review/${params.id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(reviewUrl, {
      width: 400,
      margin: 2,
      color: { dark: "#1e1e2e", light: "#ffffff" },
    });
    return NextResponse.json({ qrCodeDataUrl, reviewUrl });
  } catch {
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}
