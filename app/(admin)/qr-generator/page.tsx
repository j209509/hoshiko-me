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
                <div className="grid grid-cols-5 gap-2">
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
