"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { Printer, Star, Gift, QrCode, AlertCircle } from "lucide-react";
import { useStores } from "@/components/providers/store-provider";

const incentiveOptions = ["ドリンク1杯無料", "次回10%割引クーポン", "デザートサービス", "ポイント2倍", "特典なし"];

// ─────────────────────────────────────────────
// 10 Poster Templates
// ─────────────────────────────────────────────
interface PosterProps {
  storeName: string;
  incentive: string;
  reviewUrl: string;
}

// 1. Modern Gradient
function PosterModern({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)" }}>
      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20" style={{ background: "rgba(255,255,255,0.3)" }} />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: "rgba(255,255,255,0.4)" }} />
      <div className="absolute top-1/3 -right-8 w-32 h-32 rounded-full opacity-15" style={{ background: "rgba(255,255,255,0.2)" }} />
      <div className="relative z-10 flex flex-col h-full p-8 items-center">
        <div className="mt-4 mb-2 text-xs font-medium tracking-widest uppercase opacity-70" style={{ color: "#c4b5fd" }}>Welcome</div>
        <div className="text-xs text-white opacity-60 mb-6">ご来店ありがとうございます</div>
        <h2 className="text-3xl font-black text-white text-center leading-tight mb-2">{storeName}</h2>
        <div className="w-12 h-1 rounded-full mb-6" style={{ background: "#c4b5fd" }} />
        <p className="text-white text-sm font-medium opacity-90 mb-2 text-center">本日のご感想をお聞かせください</p>
        <div className="flex gap-1 mb-8">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#fcd34d" }} />)}
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-2xl mb-6">
          {reviewUrl && <QRCode value={reviewUrl} size={150} level="M" fgColor="#1e1b4b" />}
        </div>
        <div className="text-white text-xs opacity-70 mb-4">📱 QRコードをスキャン</div>
        {incentive && (
          <div className="w-full rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
            <div className="text-xs opacity-80 text-white mb-1">レビューご記入で</div>
            <div className="text-lg font-bold text-white">🎁 {incentive}</div>
            <div className="text-xs opacity-60 text-white mt-1">※スタッフにお声がけください</div>
          </div>
        )}
        <div className="mt-auto pt-4 flex gap-6">
          {["スキャン", "評価入力", "完了"].map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#c4b5fd", color: "#4f46e5" }}>{i+1}</div>
              <span className="text-xs text-white opacity-80">{s}</span>
              {i < 2 && <span className="text-white opacity-40 text-xs">›</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. Japanese Modern (和モダン)
function PosterJapanese({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden bg-white">
      {/* Red accent bar */}
      <div className="absolute top-0 left-0 right-0 h-3" style={{ background: "#c0392b" }} />
      <div className="absolute bottom-0 left-0 right-0 h-3" style={{ background: "#c0392b" }} />
      {/* Side bars */}
      <div className="absolute top-0 left-0 bottom-0 w-3" style={{ background: "#c0392b" }} />
      <div className="absolute top-0 right-0 bottom-0 w-3" style={{ background: "#c0392b" }} />
      {/* Circle motif */}
      <div className="absolute top-8 right-8 w-40 h-40 rounded-full border-4 opacity-10" style={{ borderColor: "#c0392b" }} />
      <div className="absolute top-12 right-12 w-28 h-28 rounded-full border-2 opacity-10" style={{ borderColor: "#c0392b" }} />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full border-4 opacity-8" style={{ borderColor: "#c0392b" }} />
      {/* Wave pattern */}
      <svg className="absolute bottom-12 right-0 opacity-5 w-48 h-48" viewBox="0 0 100 100">
        <path d="M0,50 Q25,30 50,50 Q75,70 100,50" stroke="#c0392b" strokeWidth="3" fill="none" />
        <path d="M0,60 Q25,40 50,60 Q75,80 100,60" stroke="#c0392b" strokeWidth="3" fill="none" />
        <path d="M0,70 Q25,50 50,70 Q75,90 100,70" stroke="#c0392b" strokeWidth="3" fill="none" />
      </svg>
      <div className="relative z-10 flex flex-col h-full px-10 py-8 items-center">
        <div className="mt-4 text-xs tracking-widest text-gray-400 mb-1">おもてなし評価</div>
        <div className="w-8 h-0.5 mb-4" style={{ background: "#c0392b" }} />
        <h2 className="text-2xl font-black text-gray-900 text-center mb-1">{storeName}</h2>
        <div className="text-xs text-gray-500 mb-6">ご来店ありがとうございます</div>
        <div className="flex gap-1 mb-6">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-7 h-7 fill-current" style={{ color: "#c0392b" }} />)}
        </div>
        <p className="text-sm text-gray-700 font-medium mb-6 text-center">本日のご感想をお聞かせください</p>
        <div className="p-3 rounded-sm shadow-lg border-4 mb-4" style={{ borderColor: "#c0392b" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={150} level="M" fgColor="#1a1a1a" />}
        </div>
        <div className="text-xs text-gray-500 mb-4">📱 QRコードをスキャン</div>
        {incentive && (
          <div className="w-full border-2 rounded p-3 text-center" style={{ borderColor: "#c0392b" }}>
            <div className="text-xs text-gray-500 mb-1">レビューご記入で</div>
            <div className="text-base font-bold" style={{ color: "#c0392b" }}>🎁 {incentive}</div>
            <div className="text-xs text-gray-400 mt-1">※スタッフにお声がけください</div>
          </div>
        )}
        <div className="mt-auto pt-2 text-xs text-gray-400 tracking-wider">口コミにご協力ください</div>
      </div>
    </div>
  );
}

// 3. Neon Night
function PosterNeon({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "#0a0a0f" }}>
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#00ffcc" strokeWidth="0.5"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Glow orbs */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #00ffcc 0%, transparent 70%)", filter: "blur(20px)" }} />
      <div className="absolute bottom-24 right-8 w-40 h-40 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #ff00aa 0%, transparent 70%)", filter: "blur(16px)" }} />
      <div className="relative z-10 flex flex-col h-full p-8 items-center">
        <div className="mt-4 text-xs tracking-widest mb-2" style={{ color: "#00ffcc", textShadow: "0 0 8px #00ffcc" }}>★ REVIEW ★</div>
        <h2 className="text-2xl font-black text-center mb-1" style={{ color: "#ffffff", textShadow: "0 0 20px rgba(0,255,204,0.6)" }}>{storeName}</h2>
        <div className="text-xs mb-6" style={{ color: "#00ffcc", opacity: 0.7 }}>ご来店ありがとうございます</div>
        <div className="flex gap-1 mb-2">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#ffd700", filter: "drop-shadow(0 0 6px #ffd700)" }} />)}
        </div>
        <p className="text-xs mb-6" style={{ color: "#aaa" }}>本日のご感想をお聞かせください</p>
        <div className="p-3 mb-4" style={{ background: "#fff", border: "2px solid #00ffcc", boxShadow: "0 0 20px rgba(0,255,204,0.4), inset 0 0 10px rgba(0,255,204,0.05)", borderRadius: "8px" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={148} level="M" fgColor="#0a0a0f" />}
        </div>
        <div className="text-xs mb-4" style={{ color: "#00ffcc", opacity: 0.8 }}>📱 QRコードをスキャン</div>
        {incentive && (
          <div className="w-full rounded-lg p-3 text-center" style={{ border: "1px solid rgba(0,255,204,0.3)", background: "rgba(0,255,204,0.05)" }}>
            <div className="text-xs mb-1" style={{ color: "#aaa" }}>レビューご記入で</div>
            <div className="text-base font-bold" style={{ color: "#00ffcc", textShadow: "0 0 10px #00ffcc" }}>🎁 {incentive}</div>
            <div className="text-xs mt-1" style={{ color: "#666" }}>※スタッフにお声がけください</div>
          </div>
        )}
        <div className="mt-auto flex gap-4">
          {["SCAN", "RATE", "DONE"].map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className="w-5 h-5 rounded text-xs font-bold flex items-center justify-center" style={{ background: "#00ffcc", color: "#0a0a0f" }}>{i+1}</div>
              <span className="text-xs" style={{ color: "#00ffcc", opacity: 0.8 }}>{s}</span>
              {i < 2 && <span style={{ color: "#333" }}>›</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. Minimal Clean
function PosterMinimal({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden bg-white">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-900" />
      <div className="relative z-10 flex flex-col h-full px-12 py-10 items-center">
        <div className="mt-6 text-xs tracking-widest text-gray-400 mb-8">CUSTOMER REVIEW</div>
        <h2 className="text-3xl font-black text-gray-900 text-center tracking-tight mb-2">{storeName}</h2>
        <div className="w-6 h-0.5 bg-gray-300 mb-8" />
        <p className="text-sm text-gray-500 mb-4 text-center">本日のご体験はいかがでしたか？</p>
        <div className="flex gap-2 mb-8">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-7 h-7 fill-current text-gray-200" />)}
        </div>
        <div className="border border-gray-200 p-5 mb-6" style={{ borderRadius: "4px" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={145} level="M" fgColor="#111" />}
        </div>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400 px-3">QRコードをスキャン</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        {incentive && (
          <div className="w-full bg-gray-50 p-4 text-center" style={{ borderRadius: "4px" }}>
            <div className="text-xs text-gray-400 mb-1">レビューご記入で</div>
            <div className="text-lg font-bold text-gray-900">🎁 {incentive}</div>
            <div className="text-xs text-gray-400 mt-1">スタッフにお声がけください</div>
          </div>
        )}
        <div className="mt-auto pb-4 text-xs text-gray-300 tracking-widest">POWERED BY HOSHIKO.ME</div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900" />
    </div>
  );
}

// 5. Luxury Gold
function PosterLuxury({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "#0f0e0a" }}>
      {/* Gold border */}
      <div className="absolute inset-3 border opacity-40 pointer-events-none" style={{ borderColor: "#c9a84c" }} />
      <div className="absolute inset-5 border opacity-20 pointer-events-none" style={{ borderColor: "#c9a84c" }} />
      {/* Corner ornaments */}
      {[["top-3","left-3"],["top-3","right-3"],["bottom-3","left-3"],["bottom-3","right-3"]].map(([t, l], i) => (
        <div key={i} className={`absolute ${t} ${l} w-8 h-8`} style={{ border: "2px solid #c9a84c", opacity: 0.6, borderRadius: "1px" }} />
      ))}
      <div className="relative z-10 flex flex-col h-full px-10 py-10 items-center">
        <div className="mt-4 text-xs tracking-widest mb-2" style={{ color: "#c9a84c" }}>✦  PREMIUM  ✦</div>
        <div className="w-16 h-px mb-4" style={{ background: "linear-gradient(to right, transparent, #c9a84c, transparent)" }} />
        <h2 className="text-2xl font-black text-center mb-1" style={{ color: "#f5e6c8" }}>{storeName}</h2>
        <div className="text-xs mb-6" style={{ color: "#c9a84c", opacity: 0.7 }}>ご来店賜り誠にありがとうございます</div>
        <div className="flex gap-1 mb-6">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#c9a84c" }} />)}
        </div>
        <p className="text-xs mb-5 text-center" style={{ color: "#a0896a" }}>本日のご感想をお聞かせいただけますでしょうか</p>
        <div className="p-3 mb-4" style={{ background: "#1a1812", border: "1px solid #c9a84c", borderRadius: "4px" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={148} level="M" fgColor="#f5e6c8" bgColor="#1a1812" />}
        </div>
        <div className="text-xs mb-4" style={{ color: "#c9a84c", opacity: 0.7 }}>QRコードをスキャンしてください</div>
        {incentive && (
          <div className="w-full p-3 text-center" style={{ border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.05)" }}>
            <div className="text-xs mb-1" style={{ color: "#a0896a" }}>レビューご記入で</div>
            <div className="text-base font-semibold" style={{ color: "#c9a84c" }}>✦ {incentive} ✦</div>
            <div className="text-xs mt-1" style={{ color: "#6b5a42" }}>スタッフへお申し付けください</div>
          </div>
        )}
        <div className="mt-auto w-16 h-px" style={{ background: "linear-gradient(to right, transparent, #c9a84c, transparent)" }} />
      </div>
    </div>
  );
}

// 6. Pop & Fun
function PosterPop({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "#FFDE59" }}>
      {/* Polka dots */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="3" fill="#ff6b6b" />
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
      <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full" style={{ background: "#ff6b6b", opacity: 0.3 }} />
      <div className="absolute top-1/2 -right-12 w-40 h-40 rounded-full" style={{ background: "#6b5ce7", opacity: 0.2 }} />
      <div className="relative z-10 flex flex-col h-full px-8 py-8 items-center">
        <div className="mt-4 px-4 py-1 rounded-full text-xs font-bold mb-4" style={{ background: "#ff6b6b", color: "white" }}>
          ⭐ REVIEW ⭐
        </div>
        <h2 className="text-3xl font-black text-center mb-2" style={{ color: "#1a1a2e", textShadow: "3px 3px 0px rgba(0,0,0,0.1)" }}>{storeName}</h2>
        <div className="flex gap-1 mb-4">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#ff6b6b" }} />)}
        </div>
        <p className="text-sm font-bold text-gray-800 mb-5 text-center">ご感想を聞かせてね！</p>
        <div className="p-4 rounded-3xl shadow-xl mb-4" style={{ background: "white", border: "4px solid #1a1a2e" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={140} level="M" fgColor="#1a1a2e" />}
        </div>
        <div className="px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{ background: "#1a1a2e", color: "#FFDE59" }}>
          📱 QRコードをスキャン！
        </div>
        {incentive && (
          <div className="w-full rounded-2xl p-3 text-center" style={{ background: "#ff6b6b", border: "3px solid #1a1a2e" }}>
            <div className="text-xs font-bold text-white mb-1">レビューで GET!</div>
            <div className="text-lg font-black text-white">🎁 {incentive}</div>
            <div className="text-xs text-white opacity-80 mt-1">スタッフに声をかけてね</div>
          </div>
        )}
        <div className="mt-auto flex gap-3">
          {["①スキャン", "②評価", "③完了！"].map((s) => (
            <div key={s} className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: "#1a1a2e", color: "#FFDE59" }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 7. Natural / Cafe
function PosterNatural({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "#faf6f0" }}>
      {/* Leaf SVGs */}
      <svg className="absolute top-4 right-4 w-24 h-24 opacity-20" viewBox="0 0 100 100" fill="#5c7a4e">
        <path d="M50,10 Q90,10 90,50 Q90,90 50,90 Q10,50 50,10Z" />
        <path d="M50,10 L50,90" stroke="#5c7a4e" strokeWidth="2" fill="none" />
      </svg>
      <svg className="absolute bottom-8 left-4 w-28 h-28 opacity-15" viewBox="0 0 100 100" fill="#5c7a4e">
        <path d="M50,5 Q95,20 90,60 Q80,95 50,95 Q20,95 10,60 Q5,20 50,5Z" />
      </svg>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "#8b6f47" }} />
      <div className="relative z-10 flex flex-col h-full px-10 py-8 items-center">
        <div className="mt-4 text-xs tracking-widest mb-2" style={{ color: "#8b6f47" }}>🌿 おこしやす 🌿</div>
        <h2 className="text-2xl font-black text-center mb-2" style={{ color: "#3d2b1f" }}>{storeName}</h2>
        <div className="text-xs mb-4" style={{ color: "#8b6f47" }}>本日もご来店ありがとうございます</div>
        <div className="w-full h-px mb-4" style={{ background: "linear-gradient(to right, transparent, #c4a882, transparent)" }} />
        <div className="flex gap-1 mb-4">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#c4a882" }} />)}
        </div>
        <p className="text-sm mb-5 text-center" style={{ color: "#5a4030" }}>本日のご感想をお聞かせください</p>
        <div className="p-4 rounded-xl shadow-sm mb-4" style={{ background: "white", border: "2px solid #d4b896" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={144} level="M" fgColor="#3d2b1f" />}
        </div>
        <div className="text-xs mb-4" style={{ color: "#8b6f47" }}>📱 QRコードをスキャン</div>
        {incentive && (
          <div className="w-full rounded-xl p-3 text-center" style={{ background: "#f0e8d8", border: "1px dashed #c4a882" }}>
            <div className="text-xs mb-1" style={{ color: "#8b6f47" }}>レビューご記入で</div>
            <div className="text-base font-bold" style={{ color: "#3d2b1f" }}>🎁 {incentive}</div>
            <div className="text-xs mt-1" style={{ color: "#a0856a" }}>スタッフにお声がけください</div>
          </div>
        )}
        <div className="mt-auto text-xs" style={{ color: "#c4a882" }}>またのお越しをお待ちしております</div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "#8b6f47" }} />
    </div>
  );
}

// 8. Tech / Futuristic
function PosterTech({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "#020817" }}>
      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="techgrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#techgrid)" />
      </svg>
      {/* Scan lines */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(0deg, #38bdf8 0px, transparent 1px, transparent 4px)" }} />
      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: "#38bdf8" }} />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: "#38bdf8" }} />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: "#38bdf8" }} />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: "#38bdf8" }} />
      <div className="relative z-10 flex flex-col h-full px-10 py-10 items-center">
        <div className="text-xs tracking-widest mb-2 font-mono" style={{ color: "#38bdf8" }}>[ SYS.REVIEW.INIT ]</div>
        <div className="w-full h-px mb-4" style={{ background: "linear-gradient(to right, transparent, #38bdf8, transparent)" }} />
        <h2 className="text-2xl font-black text-center mb-1 font-mono" style={{ color: "#e0f2fe" }}>{storeName}</h2>
        <div className="text-xs font-mono mb-6" style={{ color: "#38bdf8", opacity: 0.6 }}>{">> "} THANK_YOU_FOR_VISITING</div>
        <div className="flex gap-1 mb-4">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#38bdf8" }} />)}
        </div>
        <p className="text-xs font-mono mb-5 text-center" style={{ color: "#7dd3fc" }}>INPUT: 本日のご感想</p>
        <div className="p-3 mb-4" style={{ background: "#0c1526", border: "2px solid #38bdf8", boxShadow: "0 0 15px rgba(56,189,248,0.3)", borderRadius: "4px" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={148} level="M" fgColor="#e0f2fe" bgColor="#0c1526" />}
        </div>
        <div className="text-xs font-mono mb-4" style={{ color: "#38bdf8", opacity: 0.7 }}>SCAN_QR {">>>"} REVIEW</div>
        {incentive && (
          <div className="w-full p-3 text-center font-mono" style={{ border: "1px solid rgba(56,189,248,0.3)", background: "rgba(56,189,248,0.05)", borderRadius: "4px" }}>
            <div className="text-xs mb-1" style={{ color: "#7dd3fc" }}>REWARD_ON_COMPLETION:</div>
            <div className="text-base font-bold" style={{ color: "#38bdf8" }}>🎁 {incentive}</div>
            <div className="text-xs mt-1" style={{ color: "#475569" }}>ASK_STAFF {">>>"} CLAIM</div>
          </div>
        )}
        <div className="mt-auto flex gap-4 font-mono">
          {["[01]SCAN", "[02]RATE", "[03]OK"].map((s, i) => (
            <div key={i} className="text-xs" style={{ color: "#38bdf8", opacity: 0.7 }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 9. Elegant Floral
function PosterElegant({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "linear-gradient(160deg, #fdf2f8 0%, #fce7f3 40%, #fdf4ff 100%)" }}>
      {/* Floral corners */}
      <svg className="absolute top-0 left-0 w-32 h-32 opacity-30" viewBox="0 0 100 100">
        <circle cx="10" cy="10" r="8" fill="#f9a8d4" /><circle cx="25" cy="8" r="5" fill="#e879f9" />
        <circle cx="8" cy="25" r="5" fill="#e879f9" /><circle cx="20" cy="20" r="6" fill="#f0abfc" />
        <path d="M0,0 Q30,0 30,30" fill="none" stroke="#f9a8d4" strokeWidth="1.5" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-32 h-32 opacity-30" viewBox="0 0 100 100">
        <circle cx="90" cy="90" r="8" fill="#f9a8d4" /><circle cx="75" cy="92" r="5" fill="#e879f9" />
        <circle cx="92" cy="75" r="5" fill="#e879f9" /><circle cx="80" cy="80" r="6" fill="#f0abfc" />
        <path d="M100,100 Q70,100 70,70" fill="none" stroke="#f9a8d4" strokeWidth="1.5" />
      </svg>
      <div className="relative z-10 flex flex-col h-full px-10 py-8 items-center">
        <div className="mt-6 text-xs tracking-widest mb-2" style={{ color: "#c026d3" }}>✿  REVIEW  ✿</div>
        <h2 className="text-2xl font-black text-center mb-2" style={{ color: "#701a75" }}>{storeName}</h2>
        <div className="text-xs mb-4" style={{ color: "#a21caf" }}>ご来店ありがとうございます</div>
        <div className="flex gap-1 mb-4">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#f0abfc" }} />)}
        </div>
        <p className="text-sm mb-5 text-center" style={{ color: "#7e22ce" }}>本日のご感想をお聞かせください</p>
        <div className="p-4 rounded-full shadow-lg mb-4" style={{ background: "white", border: "3px solid #f9a8d4" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={140} level="M" fgColor="#701a75" />}
        </div>
        <div className="text-xs mb-4" style={{ color: "#a21caf", opacity: 0.8 }}>📱 QRコードをスキャン</div>
        {incentive && (
          <div className="w-full rounded-3xl p-3 text-center" style={{ background: "rgba(249,168,212,0.2)", border: "1.5px solid #f9a8d4" }}>
            <div className="text-xs mb-1" style={{ color: "#a21caf" }}>レビューご記入で</div>
            <div className="text-base font-bold" style={{ color: "#701a75" }}>🎁 {incentive}</div>
            <div className="text-xs mt-1" style={{ color: "#c026d3", opacity: 0.7 }}>スタッフにお声がけください ✿</div>
          </div>
        )}
        <div className="mt-auto text-xs" style={{ color: "#c026d3", opacity: 0.6 }}>またのお越しをお待ちしております</div>
      </div>
    </div>
  );
}

// 10. Bold Statement
function PosterBold({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden bg-white">
      {/* Bold diagonal accent */}
      <div className="absolute -top-12 -right-12 w-56 h-56 rotate-45" style={{ background: "#111" }} />
      <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: "#111" }} />
      <div className="relative z-10 flex flex-col h-full">
        {/* Top section */}
        <div className="px-8 pt-10 pb-4">
          <div className="text-xs tracking-widest text-gray-400 mb-2">YOUR VOICE MATTERS</div>
          <h2 className="text-4xl font-black leading-none mb-1" style={{ color: "#111" }}>{storeName}</h2>
          <div className="w-16 h-1.5 mt-2" style={{ background: "#111" }} />
        </div>
        {/* Middle QR section */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-4">
          <p className="text-sm font-bold text-gray-700 mb-3 text-center">本日のご感想をお聞かせください</p>
          <div className="flex gap-1 mb-4">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current text-gray-200" />)}
          </div>
          <div className="p-4 border-4 border-black mb-3">
            {reviewUrl && <QRCode value={reviewUrl} size={145} level="M" fgColor="#111" />}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <div className="h-px w-8 bg-gray-300" />
            QRコードをスキャン
            <div className="h-px w-8 bg-gray-300" />
          </div>
        </div>
        {/* Incentive in black bar */}
        <div className="px-8 py-5" style={{ background: "#111" }}>
          {incentive ? (
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">レビューご記入で</div>
              <div className="text-lg font-black text-white">🎁 {incentive}</div>
              <div className="text-xs text-gray-500 mt-1">スタッフにお声がけください</div>
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              {["SCAN", "RATE", "DONE"].map((s, i) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-black text-black">{i+1}</div>
                  <span className="text-xs text-white font-bold">{s}</span>
                  {i < 2 && <span className="text-gray-600">›</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 11. Clinic (医療・歯科)
function PosterClinic({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden bg-white">
      {/* Top blue bar */}
      <div className="absolute top-0 left-0 right-0 h-16" style={{ background: "linear-gradient(90deg, #0369a1 0%, #0ea5e9 100%)" }} />
      {/* Subtle grid */}
      <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="cg" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0ea5e9" strokeWidth="0.8"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#cg)" />
      </svg>
      {/* Cross mark */}
      <div className="absolute top-3 right-6 flex items-center gap-1">
        <div className="w-2 h-6 rounded-sm bg-white opacity-80" />
        <div className="w-6 h-2 rounded-sm bg-white opacity-80 -ml-4" />
      </div>
      <div className="relative z-10 flex flex-col h-full px-8">
        {/* Header */}
        <div className="h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-base">🏥</span>
          </div>
          <div>
            <div className="text-white text-xs opacity-80 leading-none">アンケートにご協力ください</div>
            <div className="text-white text-sm font-bold leading-tight">{storeName}</div>
          </div>
        </div>
        {/* Body */}
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          <div className="w-full bg-sky-50 rounded-2xl p-5 flex flex-col items-center border border-sky-100 mb-4">
            <p className="text-sm font-medium text-sky-900 mb-1 text-center">本日のご対応はいかがでしたか？</p>
            <p className="text-xs text-sky-500 mb-4 text-center">皆様のご意見がサービス向上に繋がります</p>
            <div className="flex gap-1.5 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#0ea5e9" }} />)}
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-sky-100 mb-3">
              {reviewUrl && <QRCode value={reviewUrl} size={145} level="M" fgColor="#0369a1" />}
            </div>
            <div className="text-xs text-sky-400">📱 QRコードをスキャン</div>
          </div>
          {incentive && (
            <div className="w-full rounded-xl p-3 text-center border border-sky-200 bg-sky-50">
              <div className="text-xs text-sky-500 mb-1">アンケートご回答で</div>
              <div className="text-sm font-bold text-sky-800">🎁 {incentive}</div>
              <div className="text-xs text-sky-400 mt-1">受付にてお申し付けください</div>
            </div>
          )}
        </div>
        <div className="pb-5 text-xs text-center text-gray-300 tracking-wider">より良い医療のために</div>
      </div>
    </div>
  );
}

// 12. Wellness (整体・鍼灸・マッサージ)
function PosterWellness({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "linear-gradient(160deg, #f0fdf4 0%, #dcfce7 40%, #d1fae5 100%)" }}>
      {/* Wave SVG */}
      <svg className="absolute bottom-0 left-0 right-0 opacity-20" viewBox="0 0 400 120" preserveAspectRatio="none" style={{ height: "120px", width: "100%" }}>
        <path d="M0,60 Q100,20 200,60 Q300,100 400,60 L400,120 L0,120Z" fill="#34d399" />
        <path d="M0,80 Q100,40 200,80 Q300,120 400,80 L400,120 L0,120Z" fill="#6ee7b7" opacity="0.6" />
      </svg>
      {/* Circle accent */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />
      <div className="relative z-10 flex flex-col h-full px-9 py-8 items-center">
        <div className="mt-3 text-xs tracking-widest mb-1" style={{ color: "#059669" }}>🌿 WELLNESS REVIEW 🌿</div>
        <div className="w-12 h-0.5 mb-5" style={{ background: "#a7f3d0" }} />
        <h2 className="text-2xl font-black text-center mb-1" style={{ color: "#064e3b" }}>{storeName}</h2>
        <div className="text-xs mb-5" style={{ color: "#10b981" }}>ご来院ありがとうございます</div>
        <p className="text-sm mb-4 text-center" style={{ color: "#065f46" }}>本日の施術・ご対応はいかがでしたか？</p>
        <div className="flex gap-1.5 mb-5">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#34d399" }} />)}
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-md border border-green-100 mb-4">
          {reviewUrl && <QRCode value={reviewUrl} size={144} level="M" fgColor="#064e3b" />}
        </div>
        <div className="text-xs mb-4" style={{ color: "#10b981" }}>📱 QRコードをスキャン</div>
        {incentive && (
          <div className="w-full rounded-2xl p-3 text-center" style={{ background: "rgba(52,211,153,0.15)", border: "1.5px solid #a7f3d0" }}>
            <div className="text-xs mb-1" style={{ color: "#059669" }}>ご記入いただいた方に</div>
            <div className="text-base font-bold" style={{ color: "#064e3b" }}>🎁 {incentive}</div>
            <div className="text-xs mt-1" style={{ color: "#6ee7b7" }}>スタッフへお声がけください</div>
          </div>
        )}
        <div className="mt-auto text-xs" style={{ color: "#a7f3d0" }}>心身ともに健やかに</div>
      </div>
    </div>
  );
}

// 13. Salon (美容室・ネイル)
function PosterSalon({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden bg-white">
      {/* Vertical accent stripe */}
      <div className="absolute top-0 left-0 bottom-0 w-2 bg-gray-900" />
      <div className="absolute top-0 left-6 bottom-0 w-px bg-gray-100" />
      {/* Large background letter */}
      <div className="absolute right-4 top-1/4 text-[140px] font-black leading-none select-none pointer-events-none" style={{ color: "#f3f4f6", letterSpacing: "-0.05em" }}>S</div>
      <div className="relative z-10 flex flex-col h-full pl-10 pr-8 py-10">
        <div className="text-xs tracking-[0.3em] text-gray-400 mb-2">HAIR & BEAUTY</div>
        <h2 className="text-3xl font-black tracking-tight leading-none mb-1 text-gray-900">{storeName}</h2>
        <div className="w-8 h-1 bg-gray-900 mb-8" />
        <p className="text-sm text-gray-500 mb-2">本日のスタイルはいかがでしたか？</p>
        <div className="flex gap-1 mb-6">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current text-gray-200" />)}
        </div>
        <div className="border-2 border-gray-900 p-4 self-start mb-4">
          {reviewUrl && <QRCode value={reviewUrl} size={142} level="M" fgColor="#111" />}
        </div>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-4 h-px bg-gray-300" />
          <span className="text-xs text-gray-400 tracking-widest">SCAN TO REVIEW</span>
        </div>
        {incentive && (
          <div className="bg-gray-900 text-white p-4 self-stretch">
            <div className="text-xs text-gray-400 mb-1">レビューご記入で</div>
            <div className="text-base font-bold">🎁 {incentive}</div>
            <div className="text-xs text-gray-500 mt-1">スタッフにお声がけください</div>
          </div>
        )}
        <div className="mt-auto text-xs text-gray-300 tracking-widest">THANK YOU FOR VISITING</div>
      </div>
    </div>
  );
}

// 14. Spa (エステ・スパ・リラクゼーション)
function PosterSpa({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "linear-gradient(160deg, #fffbf5 0%, #fef3e2 60%, #fde8c8 100%)" }}>
      {/* Soft orbs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }} />
      <div className="absolute bottom-16 -left-8 w-36 h-36 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
      {/* Ornamental top line */}
      <div className="absolute top-6 left-8 right-8 flex items-center gap-2">
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #d4a453)" }} />
        <span style={{ color: "#d4a453", fontSize: "10px" }}>✦</span>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #d4a453)" }} />
      </div>
      <div className="relative z-10 flex flex-col h-full px-9 py-10 items-center">
        <div className="mt-4 text-xs tracking-widest mb-2" style={{ color: "#b45309" }}>S P A ・ E S T H E T I C</div>
        <h2 className="text-2xl font-black text-center mb-1" style={{ color: "#78350f" }}>{storeName}</h2>
        <div className="text-xs mb-5" style={{ color: "#d4a453" }}>癒しのひとときをご提供できましたか</div>
        <div className="flex gap-1 mb-5">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#d4a453" }} />)}
        </div>
        <p className="text-sm mb-5 text-center" style={{ color: "#92400e" }}>本日のご感想をお聞かせください</p>
        <div className="p-4 rounded-2xl shadow-sm mb-4" style={{ background: "white", border: "1.5px solid #fcd28a" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={142} level="M" fgColor="#78350f" />}
        </div>
        <div className="text-xs mb-4" style={{ color: "#b45309", opacity: 0.8 }}>📱 QRコードをスキャン</div>
        {incentive && (
          <div className="w-full rounded-2xl p-3 text-center" style={{ background: "rgba(212,164,83,0.12)", border: "1px solid #fcd28a" }}>
            <div className="text-xs mb-1" style={{ color: "#b45309" }}>レビューご記入で</div>
            <div className="text-base font-bold" style={{ color: "#78350f" }}>🎁 {incentive}</div>
            <div className="text-xs mt-1" style={{ color: "#d4a453" }}>スタッフへお申し付けください</div>
          </div>
        )}
        <div className="mt-auto flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #d4a453)" }} />
          <span style={{ color: "#d4a453", fontSize: "10px" }}>✦</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #d4a453)" }} />
        </div>
      </div>
    </div>
  );
}

// 15. Sports (ジム・スポーツクラブ)
function PosterSports({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "#0f0f0f" }}>
      {/* Diagonal stripe accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 opacity-30" style={{ background: "linear-gradient(45deg, #ef4444 0%, #f97316 100%)", clipPath: "polygon(0 0, 60% 0, 40% 100%, 0 100%)" }} />
      </div>
      {/* Halftone dots */}
      <svg className="absolute right-0 top-0 bottom-0 opacity-10 w-48" viewBox="0 0 100 200">
        {Array.from({length:8}, (_,row) => Array.from({length:5}, (_,col) => (
          <circle key={`${row}-${col}`} cx={col*20+10} cy={row*25+12} r="4" fill="#f97316" />
        )))}
      </svg>
      <div className="relative z-10 flex flex-col h-full px-8 py-8">
        <div className="text-xs tracking-widest mb-1" style={{ color: "#f97316" }}>💪 MEMBER REVIEW</div>
        <h2 className="text-3xl font-black leading-tight mb-1 text-white">{storeName}</h2>
        <div className="w-10 h-1.5 mb-6" style={{ background: "linear-gradient(to right, #ef4444, #f97316)" }} />
        <p className="text-sm mb-3 font-medium" style={{ color: "#d1d5db" }}>本日のトレーニングはいかがでしたか？</p>
        <div className="flex gap-1 mb-6">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#f97316" }} />)}
        </div>
        <div className="self-center p-4 mb-4" style={{ background: "#1a1a1a", border: "2px solid #f97316", borderRadius: "8px", boxShadow: "0 0 20px rgba(249,115,22,0.2)" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={142} level="M" fgColor="#f9fafb" bgColor="#1a1a1a" />}
        </div>
        <div className="self-center text-xs mb-4" style={{ color: "#f97316" }}>📱 QRコードをスキャン</div>
        {incentive && (
          <div className="rounded-lg p-3 text-center" style={{ background: "linear-gradient(90deg, #ef4444, #f97316)", borderRadius: "8px" }}>
            <div className="text-xs text-white opacity-80 mb-1">レビューご記入で</div>
            <div className="text-base font-black text-white">🎁 {incentive}</div>
            <div className="text-xs text-white opacity-60 mt-1">スタッフにお声がけください</div>
          </div>
        )}
        <div className="mt-auto flex gap-4">
          {["SCAN", "RATE", "DONE"].map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-black" style={{ background: "#f97316", color: "#0f0f0f" }}>{i+1}</div>
              <span className="text-xs font-bold text-white opacity-70">{s}</span>
              {i < 2 && <span style={{ color: "#444" }}>›</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 16. Retro (レトロ・老舗)
function PosterRetro({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "#f5edd6" }}>
      {/* Paper texture */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.15" />
      </svg>
      {/* Ornamental border */}
      <div className="absolute inset-4 border-2 pointer-events-none" style={{ borderColor: "#8b5e3c", borderStyle: "double", borderWidth: "4px" }} />
      <div className="absolute inset-6 border pointer-events-none" style={{ borderColor: "#8b5e3c", opacity: 0.4 }} />
      {/* Corner ornaments */}
      <div className="absolute top-4 left-4 text-lg leading-none" style={{ color: "#8b5e3c" }}>❧</div>
      <div className="absolute top-4 right-4 text-lg leading-none" style={{ color: "#8b5e3c", transform: "scaleX(-1)" }}>❧</div>
      <div className="absolute bottom-4 left-4 text-lg leading-none" style={{ color: "#8b5e3c", transform: "scaleY(-1)" }}>❧</div>
      <div className="absolute bottom-4 right-4 text-lg leading-none" style={{ color: "#8b5e3c", transform: "scale(-1)" }}>❧</div>
      <div className="relative z-10 flex flex-col h-full px-10 py-10 items-center">
        <div className="mt-4 text-xs tracking-widest mb-2" style={{ color: "#8b5e3c", fontVariant: "small-caps" }}>〜 お客様アンケート 〜</div>
        <div className="w-full h-px mb-4" style={{ background: "linear-gradient(to right, transparent, #8b5e3c, transparent)" }} />
        <h2 className="text-2xl font-black text-center mb-1" style={{ color: "#3d1f0a" }}>{storeName}</h2>
        <div className="text-xs mb-5" style={{ color: "#8b5e3c" }}>ご愛顧ありがとうございます</div>
        <div className="flex gap-1 mb-5">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#c47a2e" }} />)}
        </div>
        <p className="text-sm mb-5 text-center" style={{ color: "#5c3317" }}>本日のご感想をお聞かせください</p>
        <div className="p-3 mb-4" style={{ background: "#fffbf0", border: "2px solid #8b5e3c" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={145} level="M" fgColor="#3d1f0a" bgColor="#fffbf0" />}
        </div>
        <div className="text-xs mb-4" style={{ color: "#8b5e3c" }}>QRコードをスキャンしてください</div>
        {incentive && (
          <div className="w-full p-3 text-center" style={{ background: "rgba(139,94,60,0.1)", border: "1px dashed #8b5e3c" }}>
            <div className="text-xs mb-1" style={{ color: "#8b5e3c" }}>ご記入いただいた方へ</div>
            <div className="text-base font-bold" style={{ color: "#3d1f0a" }}>🎁 {incentive}</div>
            <div className="text-xs mt-1" style={{ color: "#8b5e3c" }}>店員にお声がけください</div>
          </div>
        )}
        <div className="mt-auto w-full h-px" style={{ background: "linear-gradient(to right, transparent, #8b5e3c, transparent)" }} />
      </div>
    </div>
  );
}

// 17. Scandinavian (北欧カフェ・雑貨・アパレル)
function PosterScandi({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "#f8f5f0" }}>
      {/* Geometric accent */}
      <div className="absolute top-0 left-0 right-0 h-2" style={{ background: "#2d2926" }} />
      <div className="absolute top-2 left-0 right-0 h-px" style={{ background: "#e8e0d5" }} />
      {/* Minimal geometric shapes */}
      <div className="absolute top-12 right-8 w-20 h-20 rounded-full opacity-15" style={{ background: "#8b7355" }} />
      <div className="absolute bottom-16 left-6 w-14 h-14 opacity-10" style={{ background: "#8b7355", transform: "rotate(45deg)" }} />
      <svg className="absolute top-20 left-8 opacity-15" width="40" height="60" viewBox="0 0 40 60">
        <line x1="20" y1="0" x2="20" y2="60" stroke="#8b7355" strokeWidth="1.5" />
        <line x1="0" y1="30" x2="40" y2="30" stroke="#8b7355" strokeWidth="1.5" />
      </svg>
      <div className="relative z-10 flex flex-col h-full px-10 py-8 items-center">
        <div className="mt-6 text-xs tracking-[0.4em] text-gray-400 mb-6" style={{ color: "#8b7355" }}>RECENSIONE</div>
        <h2 className="text-2xl font-black text-center mb-1" style={{ color: "#2d2926" }}>{storeName}</h2>
        <div className="text-xs mb-5" style={{ color: "#8b7355" }}>ご来店ありがとうございます</div>
        <div className="w-8 h-0.5 mb-5" style={{ background: "#2d2926" }} />
        <p className="text-sm mb-4 text-center" style={{ color: "#5c5248" }}>本日のご体験はいかがでしたか？</p>
        <div className="flex gap-1.5 mb-6">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#c4a882" }} />)}
        </div>
        <div className="p-4 mb-4" style={{ background: "white", border: "1.5px solid #e0d5c5", borderRadius: "2px" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={144} level="M" fgColor="#2d2926" />}
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-6 bg-gray-300" />
          <span className="text-xs tracking-widest" style={{ color: "#8b7355" }}>SCAN QR CODE</span>
          <div className="h-px w-6 bg-gray-300" />
        </div>
        {incentive && (
          <div className="w-full p-3 text-center" style={{ background: "#2d2926", borderRadius: "2px" }}>
            <div className="text-xs text-gray-400 mb-1">レビューご記入で</div>
            <div className="text-sm font-bold text-white">🎁 {incentive}</div>
            <div className="text-xs text-gray-500 mt-1">スタッフにお声がけください</div>
          </div>
        )}
        <div className="mt-auto text-xs tracking-widest" style={{ color: "#c4b5a0" }}>TACK · ありがとう</div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background: "#2d2926" }} />
    </div>
  );
}

// 18. Pastel (スイーツ・子供向け・ペット)
function PosterPastel({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "linear-gradient(160deg, #fef9ff 0%, #f0f9ff 50%, #fff7f0 100%)" }}>
      {/* Floating shapes */}
      <div className="absolute top-8 left-6 w-12 h-12 rounded-full opacity-40" style={{ background: "#fda4af" }} />
      <div className="absolute top-16 right-10 w-8 h-8 rounded-full opacity-40" style={{ background: "#93c5fd" }} />
      <div className="absolute top-6 right-4 w-6 h-6 opacity-40" style={{ background: "#86efac", borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%" }} />
      <div className="absolute bottom-24 left-4 w-10 h-10 rounded-full opacity-30" style={{ background: "#fde68a" }} />
      <div className="absolute bottom-16 right-6 w-8 h-8 opacity-30" style={{ background: "#c4b5fd", borderRadius: "60% 40% 40% 60% / 60% 60% 40% 40%" }} />
      {/* Wavy top */}
      <svg className="absolute top-0 left-0 right-0 w-full" viewBox="0 0 400 40" preserveAspectRatio="none" style={{ height: "40px" }}>
        <path d="M0,20 Q50,0 100,20 Q150,40 200,20 Q250,0 300,20 Q350,40 400,20 L400,0 L0,0Z" fill="#fda4af" opacity="0.4" />
      </svg>
      <div className="relative z-10 flex flex-col h-full px-8 py-8 items-center">
        <div className="mt-6 text-xs font-medium tracking-wide mb-2" style={{ color: "#f472b6" }}>🌈 ご感想をお聞かせください 🌈</div>
        <h2 className="text-2xl font-black text-center mb-1" style={{ color: "#7c3aed" }}>{storeName}</h2>
        <div className="text-xs mb-5" style={{ color: "#a78bfa" }}>ご来店ありがとうございます！</div>
        <div className="flex gap-1 mb-5">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className="w-6 h-6 fill-current" style={{ color: ["#fda4af","#fbbf24","#86efac","#93c5fd","#c4b5fd"][i-1] }} />
          ))}
        </div>
        <p className="text-sm mb-5 text-center" style={{ color: "#6d28d9" }}>今日はたのしかったですか？</p>
        <div className="p-4 rounded-3xl shadow-md mb-4" style={{ background: "white", border: "3px solid #e9d5ff" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={140} level="M" fgColor="#4c1d95" />}
        </div>
        <div className="text-xs mb-4" style={{ color: "#a78bfa" }}>📱 QRコードをスキャンしてね！</div>
        {incentive && (
          <div className="w-full rounded-3xl p-3 text-center" style={{ background: "linear-gradient(135deg, rgba(253,164,175,0.3), rgba(147,197,253,0.3), rgba(196,181,253,0.3))", border: "2px solid #e9d5ff" }}>
            <div className="text-xs mb-1" style={{ color: "#7c3aed" }}>レビューで</div>
            <div className="text-base font-black" style={{ color: "#6d28d9" }}>🎁 {incentive}</div>
            <div className="text-xs mt-1" style={{ color: "#a78bfa" }}>スタッフに話しかけてね</div>
          </div>
        )}
        <div className="mt-auto text-xs" style={{ color: "#ddd6fe" }}>またきてね〜！✨</div>
      </div>
    </div>
  );
}

// 19. Chic (高級バー・ワインバー・フレンチ)
function PosterChic({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "#1a0a0a" }}>
      {/* Burgundy gradient wash */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top left, rgba(136,19,55,0.4) 0%, transparent 60%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at bottom right, rgba(100,12,40,0.3) 0%, transparent 60%)" }} />
      {/* Thin gold lines */}
      <div className="absolute top-8 left-8 right-8 h-px opacity-40" style={{ background: "linear-gradient(to right, transparent, #c9a84c, transparent)" }} />
      <div className="absolute bottom-8 left-8 right-8 h-px opacity-40" style={{ background: "linear-gradient(to right, transparent, #c9a84c, transparent)" }} />
      <div className="absolute top-8 left-8 bottom-8 w-px opacity-20" style={{ background: "linear-gradient(to bottom, transparent, #c9a84c, transparent)" }} />
      <div className="absolute top-8 right-8 bottom-8 w-px opacity-20" style={{ background: "linear-gradient(to bottom, transparent, #c9a84c, transparent)" }} />
      <div className="relative z-10 flex flex-col h-full px-10 py-10 items-center">
        <div className="mt-4 text-xs tracking-[0.4em] mb-2" style={{ color: "#c9a84c" }}>✦  CRITIQUE  ✦</div>
        <div className="w-12 h-px mb-5" style={{ background: "#881337", opacity: 0.8 }} />
        <h2 className="text-2xl font-black text-center mb-1" style={{ color: "#fce7f3" }}>{storeName}</h2>
        <div className="text-xs mb-6" style={{ color: "#9f1239", letterSpacing: "0.1em" }}>ご来店ありがとうございます</div>
        <div className="flex gap-1 mb-6">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#881337" }} />)}
        </div>
        <p className="text-xs mb-5 text-center" style={{ color: "#fda4af", opacity: 0.8 }}>本日のご体験はいかがでしたでしょうか</p>
        <div className="p-3 mb-4" style={{ background: "#120606", border: "1px solid #881337", borderRadius: "2px" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={148} level="M" fgColor="#fce7f3" bgColor="#120606" />}
        </div>
        <div className="text-xs mb-4" style={{ color: "#c9a84c", opacity: 0.7 }}>QRコードをスキャンしてください</div>
        {incentive && (
          <div className="w-full p-3 text-center" style={{ border: "1px solid rgba(136,19,55,0.5)", background: "rgba(136,19,55,0.15)" }}>
            <div className="text-xs mb-1" style={{ color: "#9f1239" }}>レビューご記入で</div>
            <div className="text-sm font-semibold" style={{ color: "#c9a84c" }}>✦ {incentive} ✦</div>
            <div className="text-xs mt-1" style={{ color: "#6b1327" }}>スタッフへお申し付けください</div>
          </div>
        )}
        <div className="mt-auto w-12 h-px" style={{ background: "#881337", opacity: 0.5 }} />
      </div>
    </div>
  );
}

// 20. Fresh (薬局・健康食品・オーガニック)
function PosterFresh({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ background: "linear-gradient(160deg, #ecfdf5 0%, #d1fae5 35%, #a7f3d0 100%)" }}>
      {/* Leaf / drop shapes */}
      <svg className="absolute top-0 right-0 w-32 h-32 opacity-25" viewBox="0 0 100 100">
        <path d="M80,10 Q100,10 100,30 Q100,70 60,90 Q20,100 10,80 Q0,60 20,40 Q40,10 80,10Z" fill="#059669" />
        <path d="M60,20 Q80,50 50,80" stroke="white" strokeWidth="2" fill="none" />
      </svg>
      <svg className="absolute bottom-8 left-0 w-28 h-28 opacity-20" viewBox="0 0 100 100">
        <path d="M20,90 Q0,90 0,70 Q0,30 40,10 Q80,0 90,20 Q100,40 80,60 Q60,90 20,90Z" fill="#10b981" />
      </svg>
      {/* Drop accent */}
      <div className="absolute top-10 left-12 w-3 h-4 opacity-40" style={{ background: "#34d399", borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%" }} />
      <div className="absolute top-16 left-20 w-2 h-3 opacity-30" style={{ background: "#6ee7b7", borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%" }} />
      <div className="relative z-10 flex flex-col h-full px-9 py-8 items-center">
        <div className="mt-4 text-xs tracking-widest mb-2" style={{ color: "#047857" }}>🌱 HEALTH & REVIEW 🌱</div>
        <div className="w-10 h-0.5 mb-4" style={{ background: "#34d399" }} />
        <h2 className="text-2xl font-black text-center mb-1" style={{ color: "#064e3b" }}>{storeName}</h2>
        <div className="text-xs mb-5" style={{ color: "#10b981" }}>ご利用ありがとうございます</div>
        <div className="flex gap-1 mb-5">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" style={{ color: "#34d399" }} />)}
        </div>
        <p className="text-sm mb-5 text-center" style={{ color: "#065f46" }}>本日のご満足度をお聞かせください</p>
        <div className="p-4 rounded-2xl shadow-sm mb-4" style={{ background: "white", border: "2px solid #a7f3d0" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={142} level="M" fgColor="#064e3b" />}
        </div>
        <div className="text-xs mb-4" style={{ color: "#059669" }}>📱 QRコードをスキャン</div>
        {incentive && (
          <div className="w-full rounded-2xl p-3 text-center" style={{ background: "rgba(52,211,153,0.2)", border: "1.5px solid #6ee7b7" }}>
            <div className="text-xs mb-1" style={{ color: "#059669" }}>レビューご記入で</div>
            <div className="text-base font-bold" style={{ color: "#064e3b" }}>🎁 {incentive}</div>
            <div className="text-xs mt-1" style={{ color: "#34d399" }}>スタッフへお申し付けください</div>
          </div>
        )}
        <div className="mt-auto flex items-center gap-4 text-xs" style={{ color: "#6ee7b7" }}>
          {["スキャン", "評価入力", "完了"].map((s, i) => (
            <span key={s} className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#059669", color: "white" }}>{i+1}</span>
              {s}
              {i < 2 && <span style={{ color: "#a7f3d0" }}>›</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Template registry
// ─────────────────────────────────────────────
const TEMPLATES = [
  { id: "modern",   name: "モダン",     thumb: "linear-gradient(135deg,#4f46e5,#a855f7)", Component: PosterModern },
  { id: "japanese", name: "和モダン",   thumb: "linear-gradient(135deg,#fff 50%,#c0392b 50%)", Component: PosterJapanese },
  { id: "neon",     name: "ネオン",     thumb: "linear-gradient(135deg,#0a0a0f,#00ffcc)", Component: PosterNeon },
  { id: "minimal",  name: "ミニマル",   thumb: "linear-gradient(135deg,#fff,#e5e7eb)", Component: PosterMinimal },
  { id: "luxury",   name: "ラグジュアリー", thumb: "linear-gradient(135deg,#0f0e0a,#c9a84c)", Component: PosterLuxury },
  { id: "pop",      name: "ポップ",     thumb: "linear-gradient(135deg,#FFDE59,#ff6b6b)", Component: PosterPop },
  { id: "natural",  name: "ナチュラル", thumb: "linear-gradient(135deg,#faf6f0,#8b6f47)", Component: PosterNatural },
  { id: "tech",     name: "テック",     thumb: "linear-gradient(135deg,#020817,#38bdf8)", Component: PosterTech },
  { id: "elegant",  name: "エレガント", thumb: "linear-gradient(135deg,#fdf2f8,#e879f9)", Component: PosterElegant },
  { id: "bold",     name: "ボールド",   thumb: "linear-gradient(135deg,#fff 60%,#111 60%)", Component: PosterBold },
  { id: "clinic",   name: "クリニック", thumb: "linear-gradient(135deg,#fff,#0ea5e9)", Component: PosterClinic },
  { id: "wellness", name: "ウェルネス", thumb: "linear-gradient(135deg,#f0fdf4,#34d399)", Component: PosterWellness },
  { id: "salon",    name: "サロン",     thumb: "linear-gradient(135deg,#fff 55%,#111 55%)", Component: PosterSalon },
  { id: "spa",      name: "スパ",       thumb: "linear-gradient(135deg,#fffbf5,#d4a453)", Component: PosterSpa },
  { id: "sports",   name: "スポーツ",   thumb: "linear-gradient(135deg,#0f0f0f,#f97316)", Component: PosterSports },
  { id: "retro",    name: "レトロ",     thumb: "linear-gradient(135deg,#f5edd6,#8b5e3c)", Component: PosterRetro },
  { id: "scandi",   name: "北欧",       thumb: "linear-gradient(135deg,#f8f5f0,#8b7355)", Component: PosterScandi },
  { id: "pastel",   name: "パステル",   thumb: "linear-gradient(135deg,#fda4af,#93c5fd,#c4b5fd)", Component: PosterPastel },
  { id: "chic",     name: "シック",     thumb: "linear-gradient(135deg,#1a0a0a,#881337)", Component: PosterChic },
  { id: "fresh",    name: "フレッシュ", thumb: "linear-gradient(135deg,#ecfdf5,#059669)", Component: PosterFresh },
] as const;

type TemplateId = typeof TEMPLATES[number]["id"];

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
export default function QrGeneratorPage() {
  const { stores, selectedStore, setSelectedStoreId, loading } = useStores();
  const [incentive, setIncentive] = useState(incentiveOptions[0]);
  const [customIncentive, setCustomIncentive] = useState("");
  const [templateId, setTemplateId] = useState<TemplateId>("modern");
  const posterRef = useRef<HTMLDivElement>(null);

  const displayIncentive = incentive === "特典なし" ? "" : (customIncentive || incentive);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://review-guard-demo.vercel.app";
  const reviewUrl = selectedStore ? `${appUrl}/review/${selectedStore.id}` : "";

  const template = TEMPLATES.find(t => t.id === templateId) ?? TEMPLATES[0];
  const PosterComponent = template.Component;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="h-96 bg-gray-100 rounded-xl" />
            <div className="h-96 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-gray-300" />
        <p className="text-gray-500">店舗が登録されていません</p>
        <Button onClick={() => window.location.href = "/settings"}>店舗を追加する</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">QRポスター生成</h1>
        <p className="text-sm text-gray-500 mt-1">店頭に貼るQRコード付きポスターを自動生成します</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-5">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <QrCode className="w-4 h-4" />ポスター設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Store select */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">店舗選択</Label>
                <Select value={selectedStore?.id ?? ""} onValueChange={(v) => v && setSelectedStoreId(v)}>
                  <SelectTrigger className="border-gray-200 w-full">
                    <SelectValue>{selectedStore?.name ?? "店舗を選択"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((s) => (
                      <SelectItem key={s.id} value={s.id} label={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Incentive */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />インセンティブ
                </Label>
                <Select value={incentive} onValueChange={(v) => setIncentive(v ?? incentiveOptions[0])}>
                  <SelectTrigger className="border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {incentiveOptions.map((opt) => (
                      <SelectItem key={opt} value={opt} label={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {incentive !== "特典なし" && (
                  <Input placeholder="カスタムテキスト（任意）" value={customIncentive}
                    onChange={(e) => setCustomIncentive(e.target.value)} className="border-gray-200" />
                )}
              </div>

              {/* Template selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">デザインテンプレート</Label>
                <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplateId(t.id)}
                      title={t.name}
                      className={`group relative flex flex-col items-center gap-1 transition-all ${templateId === t.id ? "opacity-100" : "opacity-60 hover:opacity-90"}`}
                    >
                      <div
                        className={`w-full aspect-[3/4] rounded-lg transition-all ${templateId === t.id ? "ring-2 ring-indigo-500 ring-offset-2 scale-105" : "hover:scale-102"}`}
                        style={{ background: t.thumb }}
                      />
                      <span className={`text-xs truncate w-full text-center ${templateId === t.id ? "text-indigo-600 font-semibold" : "text-gray-500"}`}>
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedStore && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium mb-1">QRコードURL</p>
                  <p className="text-xs text-gray-600 break-all">{reviewUrl}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={() => window.print()} className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Printer className="w-4 h-4" />印刷する
            </Button>
          </div>

          <Card className="border-0 shadow-sm bg-blue-50">
            <CardContent className="p-4">
              <p className="text-sm text-blue-700 font-medium mb-1">使い方ガイド</p>
              <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
                <li>店舗・インセンティブ・デザインを選択</li>
                <li>A4サイズで印刷してレジ付近に掲示</li>
                <li>お客様がQRコードをスキャンして評価</li>
                <li>設定したしきい値以上はGoogleレビューへ誘導</li>
                <li>それ以下は店内フォームで意見収集</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Poster Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">ポスタープレビュー（A4）</p>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{template.name}</span>
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-md">
            <div ref={posterRef} className="aspect-[210/297] relative">
              {selectedStore && reviewUrl ? (
                <PosterComponent
                  storeName={selectedStore.name}
                  incentive={displayIncentive}
                  reviewUrl={reviewUrl}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                  店舗を選択してください
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
