"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { stores } from "@/lib/mock-data";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { Download, Printer, Star, Gift, QrCode } from "lucide-react";

const incentiveOptions = [
  "ドリンク1杯無料",
  "次回10%割引クーポン",
  "デザートサービス",
  "ポイント2倍",
  "特典なし",
];

const colorThemes = [
  { name: "インディゴ", bg: "#4f46e5", text: "#ffffff", accent: "#818cf8" },
  { name: "エメラルド", bg: "#059669", text: "#ffffff", accent: "#6ee7b7" },
  { name: "ローズ", bg: "#e11d48", text: "#ffffff", accent: "#fda4af" },
  { name: "アンバー", bg: "#d97706", text: "#ffffff", accent: "#fcd34d" },
  { name: "スレート", bg: "#334155", text: "#ffffff", accent: "#94a3b8" },
];

export default function QrGeneratorPage() {
  const [selectedStore, setSelectedStore] = useState(stores[0].id);
  const [incentive, setIncentive] = useState(incentiveOptions[0]);
  const [customIncentive, setCustomIncentive] = useState("");
  const [themeIndex, setThemeIndex] = useState(0);
  const posterRef = useRef<HTMLDivElement>(null);

  const store = stores.find((s) => s.id === selectedStore)!;
  const theme = colorThemes[themeIndex];
  const displayIncentive = incentive === "特典なし" ? "" : (customIncentive || incentive);
  const reviewUrl = `https://hoshiko.me/review/${selectedStore}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">QRポスター生成</h1>
        <p className="text-sm text-gray-500 mt-1">
          店頭に貼るQRコード付きポスターを自動生成します
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-5">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                ポスター設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">店舗選択</Label>
                <Select value={selectedStore} onValueChange={(v) => setSelectedStore(v ?? stores[0].id)}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  インセンティブ
                </Label>
                <Select value={incentive} onValueChange={(v) => setIncentive(v ?? incentiveOptions[0])}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {incentiveOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {incentive !== "特典なし" && (
                  <Input
                    placeholder="カスタムテキスト（任意）"
                    value={customIncentive}
                    onChange={(e) => setCustomIncentive(e.target.value)}
                    className="border-gray-200"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">カラーテーマ</Label>
                <div className="flex gap-2">
                  {colorThemes.map((t, i) => (
                    <button
                      key={t.name}
                      onClick={() => setThemeIndex(i)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        themeIndex === i
                          ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: t.bg }}
                      title={t.name}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={handlePrint}
              className="flex-1 gap-2"
              style={{ backgroundColor: theme.bg }}
            >
              <Printer className="w-4 h-4" />
              印刷する
            </Button>
            <Button variant="outline" className="flex-1 gap-2 border-gray-200">
              <Download className="w-4 h-4" />
              PNG保存
            </Button>
          </div>

          <Card className="border-0 shadow-sm bg-blue-50">
            <CardContent className="p-4">
              <p className="text-sm text-blue-700 font-medium mb-1">使い方ガイド</p>
              <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
                <li>店舗とインセンティブを設定してポスターを生成</li>
                <li>A4サイズで印刷してレジ付近に掲示</li>
                <li>お客様がQRコードをスキャンして評価</li>
                <li>4-5星は自動でGoogleレビューへ誘導</li>
                <li>1-3星は店内フォームで意見収集</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Poster Preview */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-3">ポスタープレビュー（A4）</p>
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-md">
            <div
              ref={posterRef}
              className="aspect-[210/297] relative flex flex-col"
              style={{ backgroundColor: theme.bg }}
            >
              {/* Header decoration */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                style={{ backgroundColor: theme.text, transform: "translate(30%, -30%)" }}
              />
              <div
                className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10"
                style={{ backgroundColor: theme.text, transform: "translate(-30%, 30%)" }}
              />

              <div className="relative z-10 flex flex-col h-full p-8">
                {/* Store name */}
                <div className="text-center mb-6">
                  <div
                    className="text-xs font-medium mb-2 opacity-80"
                    style={{ color: theme.accent }}
                  >
                    ご来店ありがとうございます
                  </div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: theme.text }}
                  >
                    {store.name}
                  </h2>
                </div>

                {/* Main message */}
                <div className="text-center mb-6">
                  <p className="text-sm font-medium opacity-90" style={{ color: theme.text }}>
                    本日のご感想をお聞かせください
                  </p>
                  <div className="flex justify-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-6 h-6 fill-current" style={{ color: theme.accent }} />
                    ))}
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <QRCode
                      value={reviewUrl}
                      size={160}
                      level="M"
                      fgColor="#1e1e2e"
                    />
                  </div>
                </div>

                {/* Incentive */}
                {displayIncentive && (
                  <div
                    className="text-center py-4 px-6 rounded-2xl mb-4"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <div className="text-xs opacity-80 mb-1" style={{ color: theme.text }}>
                      レビューご記入で
                    </div>
                    <div className="text-xl font-bold" style={{ color: theme.text }}>
                      🎁 {displayIncentive}
                    </div>
                    <div className="text-xs mt-1 opacity-70" style={{ color: theme.text }}>
                      ※スタッフにお声がけください
                    </div>
                  </div>
                )}

                {/* Steps */}
                <div className="mt-auto">
                  <div className="text-xs opacity-70 text-center mb-3" style={{ color: theme.text }}>
                    QRコードをスキャンするだけ！
                  </div>
                  <div className="flex justify-center gap-4">
                    {["スキャン", "評価入力", "完了！"].map((step, i) => (
                      <div key={step} className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: theme.accent, color: theme.bg }}
                        >
                          {i + 1}
                        </div>
                        <span className="text-xs" style={{ color: theme.text, opacity: 0.9 }}>
                          {step}
                        </span>
                        {i < 2 && (
                          <span className="text-xs opacity-50" style={{ color: theme.text }}>›</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
