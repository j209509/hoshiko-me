"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { Printer, Gift, QrCode, AlertCircle } from "lucide-react";
import { useStores } from "@/components/providers/store-provider";

const incentiveOptions = ["ドリンク1杯無料", "次回10%割引クーポン", "デザートサービス", "ポイント2倍", "特典なし"];

// pw/ph = portrait width/height (mm). landscape swaps them.
// pxW = preview container width (px)。これを基準にscaleを計算する。
const SIZES = [
  { id: "meishi",   label: "名刺",   pw: 55,  ph: 91,  pmaxW: "max-w-[180px]", lmaxW: "max-w-[300px]", pxW: 180, lxW: 300 },
  { id: "hagaki",   label: "はがき", pw: 100, ph: 148, pmaxW: "max-w-xs",       lmaxW: "max-w-sm",       pxW: 288, lxW: 384 },
  { id: "l",        label: "L判",    pw: 89,  ph: 127, pmaxW: "max-w-[240px]",  lmaxW: "max-w-sm",       pxW: 240, lxW: 384 },
  { id: "a5",       label: "A5",     pw: 148, ph: 210, pmaxW: "max-w-sm",       lmaxW: "max-w-md",       pxW: 384, lxW: 448 },
  { id: "a4",       label: "A4",     pw: 210, ph: 297, pmaxW: "max-w-sm",       lmaxW: "max-w-lg",       pxW: 384, lxW: 512 },
] as const;
type SizeId = typeof SIZES[number]["id"];
// テンプレートはこの幅を基準にデザインされている
const BASE_PX = 288;


interface PosterProps { storeName: string; incentive: string; reviewUrl: string; }

/* ─── 横向きテーマ定義 ─── */
interface LT {
  bg: string; text: string; sub: string; accent: string; lbl: string;
  pBg: string; pText: string; div: string;
  qFg: string; qBg: string;
  iBg: string; iBd: string; iText: string;
}

/* 横向き共通ポスター */
function LandscapePoster({ storeName, incentive, reviewUrl, theme: t }: PosterProps & { theme: LT }) {
  return (
    <div style={{ width:"100%", height:"100%", background:t.bg, display:"flex", overflow:"hidden" }}>
      {/* LEFT: ブランディング */}
      <div style={{ flex:"0 0 57%", display:"flex", flexDirection:"column", justifyContent:"center", padding:"12px 14px 12px 18px" }}>
        <div style={{ fontSize:6, letterSpacing:"5px", color:t.lbl, marginBottom:6 }}>REVIEW ／ 口コミ</div>
        <div style={{ fontSize:17, fontWeight:900, color:t.text, lineHeight:1.15, marginBottom:5 }}>{storeName}</div>
        <Stars5 c={t.accent}/>
        <div style={{ fontSize:7, color:t.sub, marginTop:6, lineHeight:1.6 }}>ご来店ありがとうございます<br/>本日のご感想をお聞かせください</div>
        {incentive && (
          <div style={{ marginTop:9, background:t.iBg, border:`1px solid ${t.iBd}`, borderRadius:7, padding:"5px 9px", display:"inline-block" }}>
            <div style={{ fontSize:6, color:t.lbl, marginBottom:1 }}>レビューご記入で</div>
            <div style={{ fontSize:10, fontWeight:700, color:t.iText }}>🎁 {incentive}</div>
          </div>
        )}
      </div>
      {/* DIVIDER */}
      <div style={{ width:1, background:t.div, margin:"10px 0" }}/>
      {/* RIGHT: QRコード */}
      <div style={{ flex:"0 0 43%", background:t.pBg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, padding:"10px 12px" }}>
        <div style={{ fontSize:6, letterSpacing:"3px", color:t.pText, opacity:.7 }}>📱 スキャンして下さい</div>
        <div style={{ background:t.qBg, padding:7, borderRadius:10, boxShadow:"0 2px 12px rgba(0,0,0,.15)" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={82} level="M" fgColor={t.qFg} bgColor={t.qBg}/>}
        </div>
        <div style={{ fontSize:6, color:t.pText, opacity:.5, textAlign:"center" as const, lineHeight:1.5 }}>QRを読み取って<br/>Googleレビューへ</div>
      </div>
    </div>
  );
}

const S: React.CSSProperties = { display: "flex", justifyContent: "center", gap: 4 };
function Stars5({ c }: { c: string }) {
  return <div style={S}>{[0,1,2,3,4].map(i=><svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={c}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}</div>;
}


/* ═══════════════════════════════════════════════════
   1. AURORA  — deep cosmos, glowing store name
═══════════════════════════════════════════════════ */
function PosterAurora({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"linear-gradient(145deg,#0a0118 0%,#1e0845 50%,#3b0764 100%)", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center" }}>
      {/* blob 1 */}
      <div style={{ position:"absolute", top:"-10%", left:"-15%", width:"70%", height:"60%", borderRadius:"50%", background:"radial-gradient(ellipse,rgba(139,92,246,.55) 0%,transparent 65%)", filter:"blur(40px)", pointerEvents:"none" }}/>
      {/* blob 2 */}
      <div style={{ position:"absolute", bottom:"-15%", right:"-10%", width:"65%", height:"58%", borderRadius:"50%", background:"radial-gradient(ellipse,rgba(236,72,153,.45) 0%,transparent 65%)", filter:"blur(40px)", pointerEvents:"none" }}/>
      {/* blob 3 */}
      <div style={{ position:"absolute", top:"40%", left:"25%", width:"50%", height:"40%", borderRadius:"50%", background:"radial-gradient(ellipse,rgba(79,70,229,.4) 0%,transparent 65%)", filter:"blur(40px)", pointerEvents:"none" }}/>
      {/* label */}
      <div style={{ position:"relative", zIndex:1, marginTop:28, fontSize:7, letterSpacing:"6px", color:"rgba(196,181,253,.5)" }}>✦ REVIEW ✦</div>
      {/* store name */}
      <div style={{ position:"relative", zIndex:1, fontSize:36, fontWeight:900, color:"#fff", textShadow:"0 0 30px rgba(167,139,250,.7)", textAlign:"center" as const, marginTop:14, marginBottom:12, paddingLeft:20, paddingRight:20, lineHeight:1.1 }}>{storeName}</div>
      <div style={{ position:"relative", zIndex:1 }}><Stars5 c="#fbbf24"/></div>
      <div style={{ position:"relative", zIndex:1, fontSize:9, color:"rgba(221,214,254,.55)", marginTop:10, textAlign:"center" as const }}>本日のご感想をお聞かせください</div>
      {/* glass QR card */}
      <div style={{ position:"relative", zIndex:1, marginTop:"auto", marginBottom:20, marginLeft:20, marginRight:20, width:"calc(100% - 40px)", background:"rgba(255,255,255,.1)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,.2)", borderRadius:20, padding:16, display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
        {reviewUrl && <QRCode value={reviewUrl} size={116} level="M" fgColor="#1e0845" bgColor="#fff"/>}
        <div style={{ fontSize:8, color:"rgba(196,181,253,.6)", letterSpacing:"3px" }}>QRをスキャン</div>
        {incentive && (
          <div style={{ width:"100%", background:"rgba(139,92,246,.2)", border:"1px solid rgba(139,92,246,.35)", borderRadius:10, padding:"7px 12px", textAlign:"center" as const }}>
            <div style={{ fontSize:8, color:"rgba(196,181,253,.6)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#e9d5ff" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   2. HINOMARU  — 和モダン、asymmetric
═══════════════════════════════════════════════════ */
function PosterHinomaru({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#f7f4ee", overflow:"hidden" }}>
      {/* big faint circle */}
      <div style={{ position:"absolute", top:"5%", left:"7.5%", width:"85%", paddingTop:"85%", borderRadius:"50%", background:"#c0392b", opacity:0.07, pointerEvents:"none" }}/>
      {/* content */}
      <div style={{ position:"relative", zIndex:1, paddingTop:24, paddingLeft:20, paddingRight:20 }}>
        <div style={{ height:2, width:32, background:"#c0392b", marginBottom:10 }}/>
        <div style={{ fontSize:8, letterSpacing:"8px", color:"#c0392b", marginBottom:10 }}>口コミ</div>
        <div style={{ fontSize:34, fontWeight:900, color:"#1a0a00", lineHeight:1.1, marginBottom:10 }}>{storeName}</div>
        <div style={{ fontSize:8, color:"#888", marginBottom:8 }}>ご来店ありがとうございます</div>
        <Stars5 c="#c0392b"/>
        <div style={{ fontSize:8, color:"#555", marginTop:8 }}>本日のご感想をお聞かせください</div>
      </div>
      {/* QR bottom-right */}
      <div style={{ position:"absolute", bottom:20, right:20, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        {incentive && (
          <div style={{ border:"1px solid #c0392b", padding:"6px 10px", textAlign:"center" as const, background:"rgba(192,57,43,.04)" }}>
            <div style={{ fontSize:7, color:"rgba(192,57,43,.55)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#c0392b" }}>{incentive}</div>
          </div>
        )}
        <div style={{ background:"#fff", padding:8, border:"2px solid #c0392b" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#1a0a00"/>}
        </div>
        <div style={{ fontSize:7, letterSpacing:"3px", color:"rgba(192,57,43,.6)" }}>QRをスキャン</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   3. VICE  — ネオン
═══════════════════════════════════════════════════ */
function PosterVice({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#050010", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center" }}>
      {/* glow lines */}
      <div style={{ position:"absolute", top:"30%", left:0, right:0, height:2, background:"#ff00cc", boxShadow:"0 0 20px 8px rgba(255,0,204,.5)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"70%", left:0, right:0, height:1, background:"#00e5ff", boxShadow:"0 0 15px 5px rgba(0,229,255,.4)", pointerEvents:"none" }}/>
      {/* label */}
      <div style={{ position:"relative", zIndex:1, marginTop:28, fontSize:7, letterSpacing:"8px", color:"rgba(0,229,255,.5)" }}>NEON REVIEW</div>
      {/* store name */}
      <div style={{ position:"relative", zIndex:1, fontSize:32, fontWeight:900, color:"#fff", textShadow:"0 0 20px #ff00cc, 0 0 40px rgba(255,0,204,.4)", textAlign:"center" as const, marginTop:16, marginBottom:10, paddingLeft:16, paddingRight:16, lineHeight:1.1 }}>{storeName}</div>
      <div style={{ position:"relative", zIndex:1 }}><Stars5 c="#ff00cc"/></div>
      <div style={{ position:"relative", zIndex:1, fontSize:8, color:"rgba(0,229,255,.6)", marginTop:10, letterSpacing:"2px" }}>本日のご感想をお聞かせください</div>
      {/* cyan QR card */}
      <div style={{ position:"relative", zIndex:1, marginTop:20, border:"2px solid #00e5ff", boxShadow:"0 0 20px rgba(0,229,255,.3)", background:"#050010", padding:10, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#00e5ff" bgColor="#050010"/>}
        <div style={{ fontSize:7, color:"rgba(0,229,255,.6)", letterSpacing:"3px" }}>SCAN TO REVIEW</div>
      </div>
      {incentive && (
        <div style={{ position:"relative", zIndex:1, marginTop:12, marginLeft:20, marginRight:20, width:"calc(100% - 40px)", border:"1px solid rgba(255,0,204,.4)", background:"rgba(255,0,204,.06)", padding:"8px 12px", textAlign:"center" as const }}>
          <div style={{ fontSize:8, color:"rgba(255,255,255,.4)", marginBottom:2 }}>レビューご記入で</div>
          <div style={{ fontSize:12, fontWeight:700, color:"#ff00cc" }}>{incentive}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   4. BAUHAUS  — バウハウス
═══════════════════════════════════════════════════ */
function PosterBauhaus({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#f0ece4", overflow:"hidden" }}>
      {/* left red bar */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:10, background:"#e63946" }}/>
      {/* top black block */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"35%", background:"#111" }}/>
      {/* store name in black band */}
      <div style={{ position:"absolute", top:0, left:18, right:0, height:"35%", display:"flex", alignItems:"center", paddingLeft:24 }}>
        <div style={{ fontSize:30, fontWeight:900, color:"#fff", lineHeight:1 }}>{storeName}</div>
      </div>
      {/* lower content */}
      <div style={{ position:"absolute", top:"38%", left:18, right:0, bottom:0, paddingLeft:6, paddingRight:18, paddingBottom:16 }}>
        <div style={{ fontSize:7, letterSpacing:"10px", color:"#666", marginBottom:12 }}>REVIEW</div>
        <Stars5 c="#e63946"/>
        <div style={{ fontSize:9, color:"#555", marginTop:10, marginBottom:14 }}>本日のご感想をお聞かせください</div>
        <div style={{ display:"inline-block", border:"3px solid #111", padding:8 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#111"/>}
        </div>
        {incentive && (
          <div style={{ marginTop:12, background:"#e63946", color:"#fff", padding:"6px 12px", display:"inline-block" }}>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.7)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:11, fontWeight:700 }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   5. DECO  — アールデコ
═══════════════════════════════════════════════════ */
function PosterDeco({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"linear-gradient(180deg,#0a0806 0%,#1a1208 100%)", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center" }}>
      {/* thin gold frame */}
      <div style={{ position:"absolute", inset:12, border:"1px solid rgba(201,168,76,.4)", pointerEvents:"none" }}/>
      {/* fan SVG */}
      <svg style={{ position:"absolute", top:14, left:"50%", transform:"translateX(-50%)", width:100 }} viewBox="0 0 100 50">
        {Array.from({length:12},(_,i)=>{
          const a = (i/(12-1))*Math.PI;
          const x2 = 50 + 45*Math.cos(a);
          const y2 = 50 - 45*Math.sin(a);
          return <line key={i} x1={50} y1={50} x2={x2} y2={y2} stroke="#c9a84c" strokeWidth="0.8" opacity="0.4"/>;
        })}
      </svg>
      <div style={{ position:"relative", zIndex:1, marginTop:60, fontSize:6, letterSpacing:"10px", color:"rgba(201,168,76,.5)" }}>A R T  D E C O  R E V I E W</div>
      <div style={{ position:"relative", zIndex:1, width:"80%", height:1, background:"linear-gradient(to right,transparent,#c9a84c,transparent)", marginTop:8, marginBottom:8 }}/>
      <div style={{ position:"relative", zIndex:1, fontSize:28, fontWeight:300, color:"#f5e6c8", letterSpacing:"4px", textAlign:"center" as const, paddingLeft:16, paddingRight:16, lineHeight:1.2 }}>{storeName}</div>
      <div style={{ position:"relative", zIndex:1, width:"80%", height:1, background:"linear-gradient(to right,transparent,#c9a84c,transparent)", marginTop:8, marginBottom:8 }}/>
      <div style={{ position:"relative", zIndex:1, marginBottom:12 }}><Stars5 c="#c9a84c"/></div>
      <div style={{ position:"relative", zIndex:1, background:"#f5e6c8", padding:8, border:"1px solid #c9a84c" }}>
        {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#0a0806"/>}
      </div>
      {incentive && (
        <div style={{ position:"relative", zIndex:1, marginTop:12, marginLeft:20, marginRight:20, width:"calc(100% - 40px)", border:"1px solid rgba(201,168,76,.3)", background:"rgba(201,168,76,.06)", padding:"8px 12px", textAlign:"center" as const }}>
          <div style={{ fontSize:8, color:"rgba(201,168,76,.55)", marginBottom:2 }}>レビューご記入で</div>
          <div style={{ fontSize:12, fontWeight:700, color:"#c9a84c" }}>✦ {incentive} ✦</div>
        </div>
      )}
      <div style={{ position:"relative", zIndex:1, marginTop:"auto", marginBottom:18, fontSize:6, letterSpacing:"5px", color:"rgba(201,168,76,.4)" }}>※ご来店ありがとうございます※</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   6. CONSTRUCTIVIST  — ポップアート
═══════════════════════════════════════════════════ */
function PosterConstructivist({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#E63946", overflow:"hidden" }}>
      {/* dark navy triangle top-right */}
      <svg style={{ position:"absolute", top:0, right:0, width:"60%", height:"60%" }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="50,0 100,0 100,100" fill="#1d3557"/>
      </svg>
      {/* white ellipse bottom-left */}
      <div style={{ position:"absolute", width:"70%", height:"60%", bottom:-20, left:-20, borderRadius:"50%", background:"rgba(255,255,255,.08)", pointerEvents:"none" }}/>
      {/* yellow circle */}
      <div style={{ position:"absolute", top:"15%", right:"25%", width:50, height:50, borderRadius:"50%", background:"#ffd700" }}/>
      {/* text content */}
      <div style={{ position:"relative", zIndex:1, paddingTop:28, paddingLeft:20, paddingRight:20 }}>
        <div style={{ fontSize:7, letterSpacing:"8px", color:"rgba(255,255,255,.6)", marginBottom:10 }}>REVIEW</div>
        <div style={{ fontSize:30, fontWeight:900, color:"#fff", lineHeight:1, marginBottom:12 }}>{storeName}</div>
        <div style={{ fontSize:9, color:"rgba(255,255,255,.7)", marginBottom:14 }}>本日のご感想をお聞かせください</div>
        <Stars5 c="#ffd700"/>
      </div>
      {/* QR centered bottom */}
      <div style={{ position:"absolute", bottom:16, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        {incentive && (
          <div style={{ background:"#1d3557", padding:"6px 12px", textAlign:"center" as const }}>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.6)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#ffd700" }}>{incentive}</div>
          </div>
        )}
        <div style={{ background:"#fff", padding:8 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#1d3557"/>}
        </div>
        <div style={{ fontSize:7, color:"rgba(255,255,255,.7)", letterSpacing:"2px" }}>QRをスキャン</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   7. WABI  — わびさび
═══════════════════════════════════════════════════ */
function PosterWabi({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#f5f0e8", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center" }}>
      {/* ink circle SVG */}
      <svg style={{ position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)", width:"80%" }} viewBox="0 0 200 200">
        <circle cx={100} cy={100} r={80} fill="none" stroke="rgba(45,42,36,.08)" strokeWidth={20}/>
      </svg>
      <div style={{ position:"relative", zIndex:1, marginTop:24, fontSize:7, letterSpacing:"12px", color:"rgba(45,42,36,.3)" }}>余 白</div>
      <div style={{ position:"relative", zIndex:1, width:"100%", height:1, background:"rgba(45,42,36,.1)", marginTop:10, marginBottom:20 }}/>
      {/* line */}
      <div style={{ position:"relative", zIndex:1, height:1, width:40, background:"rgba(143,173,136,.6)", marginBottom:14 }}/>
      <div style={{ position:"relative", zIndex:1, fontSize:28, fontWeight:300, color:"#2d2a24", letterSpacing:"6px", textAlign:"center" as const, paddingLeft:20, paddingRight:20, lineHeight:1.3 }}>{storeName}</div>
      <div style={{ position:"relative", zIndex:1, height:1, width:40, background:"rgba(143,173,136,.6)", marginTop:14, marginBottom:12 }}/>
      <div style={{ position:"relative", zIndex:1, fontSize:7, letterSpacing:"4px", color:"#8a7a65", marginBottom:12 }}>ご来店ありがとうございます</div>
      <div style={{ position:"relative", zIndex:1, marginBottom:14 }}><Stars5 c="#8fad88"/></div>
      <div style={{ position:"relative", zIndex:1, border:"1px solid rgba(143,173,136,.4)", padding:10, background:"#fff" }}>
        {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#2d2a24"/>}
      </div>
      <div style={{ position:"relative", zIndex:1, fontSize:7, letterSpacing:"3px", color:"rgba(143,173,136,.7)", marginTop:8 }}>QRをスキャン</div>
      {incentive && (
        <div style={{ position:"relative", zIndex:1, marginTop:12, marginLeft:20, marginRight:20, width:"calc(100% - 40px)", border:"1px dashed rgba(143,173,136,.5)", padding:"8px 12px", textAlign:"center" as const }}>
          <div style={{ fontSize:8, color:"#8a7a65", marginBottom:2 }}>レビューご記入で</div>
          <div style={{ fontSize:12, fontWeight:700, color:"#2d2a24" }}>{incentive}</div>
        </div>
      )}
      <div style={{ position:"relative", zIndex:1, marginTop:"auto", marginBottom:14, fontSize:7, color:"rgba(45,42,36,.4)", letterSpacing:"2px" }}>本日のご感想をお聞かせください</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   8. HUD  — テック
═══════════════════════════════════════════════════ */
function PosterHUD({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#030d1a", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* scanlines */}
      <div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,229,255,.03) 2px,rgba(0,229,255,.03) 4px)", pointerEvents:"none" }}/>
      {/* corner brackets */}
      <div style={{ position:"absolute", top:14, left:14, width:22, height:22, borderTop:"2px solid #00e5ff", borderLeft:"2px solid #00e5ff" }}/>
      <div style={{ position:"absolute", top:14, right:14, width:22, height:22, borderTop:"2px solid #00e5ff", borderRight:"2px solid #00e5ff" }}/>
      <div style={{ position:"absolute", bottom:14, left:14, width:22, height:22, borderBottom:"2px solid #00e5ff", borderLeft:"2px solid #00e5ff" }}/>
      <div style={{ position:"absolute", bottom:14, right:14, width:22, height:22, borderBottom:"2px solid #00e5ff", borderRight:"2px solid #00e5ff" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"30px 24px 22px" }}>
        <div style={{ fontSize:7, letterSpacing:"5px", color:"rgba(0,229,255,.5)", fontFamily:"monospace", marginBottom:6 }}>[ SCAN TO REVIEW ]</div>
        <div style={{ fontSize:6, color:"rgba(0,229,255,.3)", fontFamily:"monospace", marginBottom:14 }}>SYS: FEEDBACK_MODE_ACTIVE</div>
        <div style={{ fontSize:28, fontWeight:700, color:"#00e5ff", letterSpacing:"2px", textShadow:"0 0 20px rgba(0,229,255,.5)", fontFamily:"monospace", lineHeight:1.1, marginBottom:10 }}>{storeName}</div>
        <div style={{ width:"100%", borderBottom:"1px dashed rgba(0,229,255,.2)", marginBottom:12 }}/>
        <Stars5 c="#00e5ff"/>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", paddingTop:14 }}>
          <div style={{ position:"relative", border:"2px solid rgba(0,229,255,.3)", borderRadius:4, padding:8, background:"rgba(0,229,255,.03)", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#00e5ff" bgColor="#030d1a"/>}
            <div style={{ fontSize:7, letterSpacing:"3px", color:"rgba(0,229,255,.6)", fontFamily:"monospace" }}>SCAN TO EXECUTE</div>
          </div>
        </div>
        {incentive && (
          <div style={{ border:"1px solid rgba(0,229,255,.25)", background:"rgba(0,229,255,.04)", padding:"8px 12px", fontFamily:"monospace", marginTop:10 }}>
            <div style={{ fontSize:7, color:"rgba(0,229,255,.5)", marginBottom:2 }}>REWARD_ON_COMPLETE:</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#00e5ff" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   9. COUTURE  — クチュール、縦分割
═══════════════════════════════════════════════════ */
function PosterCouture({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"linear-gradient(90deg, #1a0a1a 48%, #fdf8f5 48%)", overflow:"hidden" }}>
      {/* gold center line */}
      <div style={{ position:"absolute", left:"48%", top:"10%", bottom:"10%", width:1, background:"linear-gradient(to bottom,transparent,#c9a84c,transparent)" }}/>
      {/* left dark side */}
      <div style={{ position:"absolute", left:0, top:0, width:"48%", height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:16 }}>
        <div style={{ fontSize:6, letterSpacing:"8px", color:"rgba(201,168,76,.5)", marginBottom:10 }}>COUTURE</div>
        <div style={{ fontSize:20, fontWeight:900, color:"#fdf8f5", lineHeight:1.2, textAlign:"center" as const, marginBottom:10 }}>{storeName}</div>
        <div style={{ height:1, width:"80%", background:"#c9a84c", marginBottom:10 }}/>
        <Stars5 c="#c9a84c"/>
      </div>
      {/* right cream side */}
      <div style={{ position:"absolute", right:0, top:0, width:"52%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:12 }}>
        <div style={{ fontSize:7, color:"rgba(26,10,26,.4)", marginBottom:8 }}>📱 スキャン</div>
        <div style={{ border:"1px solid rgba(201,168,76,.4)", padding:8, background:"#fff" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#1a0a1a"/>}
        </div>
        <div style={{ fontSize:7, color:"rgba(26,10,26,.35)", letterSpacing:"2px", marginTop:8 }}>QRをスキャン</div>
        {incentive && (
          <div style={{ marginTop:12, width:"100%", background:"#1a0a1a", padding:"7px 10px", textAlign:"center" as const }}>
            <div style={{ fontSize:7, color:"rgba(201,168,76,.55)", marginBottom:2 }}>ご記入で</div>
            <div style={{ fontSize:10, fontWeight:700, color:"#fdf8f5" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   10. RIOT  — ボールド、B&W split
═══════════════════════════════════════════════════ */
function PosterRiot({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#fff", overflow:"hidden" }}>
      {/* top 40% black */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"40%", background:"#111" }}/>
      {/* store name in black area */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"40%", display:"flex", alignItems:"center", padding:"0 20px" }}>
        <div style={{ fontSize:34, fontWeight:900, color:"#fff", lineHeight:0.95, letterSpacing:"-2px" }}>{storeName}</div>
      </div>
      {/* red center line */}
      <div style={{ position:"absolute", top:"40%", left:0, right:0, height:5, background:"#e63946" }}/>
      {/* white lower area */}
      <div style={{ position:"absolute", top:"45%", left:0, right:0, bottom:0, padding:"12px 20px 16px", display:"flex", flexDirection:"column" }}>
        <Stars5 c="#111"/>
        <div style={{ fontSize:8, color:"#555", marginTop:10, marginBottom:14 }}>ご感想をお聞かせください</div>
        <div style={{ display:"inline-block", border:"3px solid #111", padding:8 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#111"/>}
        </div>
        {incentive && (
          <div style={{ marginTop:12, background:"#111", color:"#fff", padding:"6px 12px", display:"inline-block" }}>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.45)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:12, fontWeight:900 }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   11. CLINIC  — クリニック
═══════════════════════════════════════════════════ */
function PosterClinic({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#fff", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* top blue banner */}
      <div style={{ background:"linear-gradient(135deg,#0369a1,#0ea5e9)", height:"28%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, gap:10 }}>
        <div style={{ fontSize:28, color:"rgba(255,255,255,.3)" }}>✚</div>
        <div style={{ fontSize:9, letterSpacing:"6px", color:"#fff" }}>口コミ</div>
      </div>
      {/* lower content */}
      <div style={{ flex:1, padding:16, display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ fontSize:28, fontWeight:800, color:"#0369a1", textAlign:"center" as const, marginBottom:8 }}>{storeName}</div>
        <div style={{ width:"100%", borderTop:"1px dashed rgba(3,105,161,.2)", margin:"8px 0" }}/>
        <Stars5 c="#0369a1"/>
        <div style={{ fontSize:8, color:"#0ea5e9", marginTop:8, marginBottom:14 }}>本日のご感想をお聞かせください</div>
        <div style={{ background:"#eff6ff", border:"2px solid #0369a1", padding:10, borderRadius:12 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#0369a1"/>}
        </div>
        <div style={{ fontSize:7, color:"#0ea5e9", letterSpacing:"2px", marginTop:8 }}>QRをスキャン</div>
        {incentive && (
          <div style={{ marginTop:12, width:"100%", border:"1px solid #bae6fd", background:"#f0f9ff", borderRadius:10, padding:"8px 12px", textAlign:"center" as const }}>
            <div style={{ fontSize:8, color:"#0ea5e9", marginBottom:2 }}>アンケートご回答で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#0369a1" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   12. ZEN  — ウェルネス
═══════════════════════════════════════════════════ */
function PosterZen({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"linear-gradient(180deg,#f0fdf4,#dcfce7,#bbf7d0)", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center" }}>
      {/* concentric circles */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice">
        {[60,90,120,150,180].map((r,i)=><circle key={i} cx={100} cy={200} r={r} fill="none" stroke="rgba(52,211,153,.12)" strokeWidth={1}/>)}
      </svg>
      <div style={{ position:"relative", zIndex:1, paddingTop:28 }}>
        {/* leaf icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display:"block", margin:"0 auto 6px" }}>
          <path d="M17 8C8 10 5.9 16.17 3.82 19.44a1 1 0 001.66 1.06C7.07 18.5 12 16 12 16s-1 4 2 6c3-4 4.31-8.34 5-12" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div style={{ fontSize:7, letterSpacing:"6px", color:"rgba(6,78,59,.4)", textAlign:"center" as const }}>wellness review</div>
      </div>
      <div style={{ position:"relative", zIndex:1, fontSize:32, fontWeight:700, color:"#064e3b", textAlign:"center" as const, marginTop:12, marginBottom:8, paddingLeft:20, paddingRight:20, lineHeight:1.1 }}>{storeName}</div>
      <div style={{ position:"relative", zIndex:1 }}><Stars5 c="#34d399"/></div>
      <div style={{ position:"relative", zIndex:1, fontSize:8, color:"#065f46", marginTop:10, marginBottom:16, textAlign:"center" as const }}>ご感想をお聞かせください</div>
      <div style={{ position:"relative", zIndex:1, borderRadius:20, background:"rgba(255,255,255,.7)", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)", padding:12, border:"1px solid rgba(52,211,153,.25)", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#064e3b"/>}
        <div style={{ fontSize:7, color:"#34d399", letterSpacing:"2px" }}>QRをスキャン</div>
      </div>
      {incentive && (
        <div style={{ position:"relative", zIndex:1, marginTop:12, marginLeft:20, marginRight:20, width:"calc(100% - 40px)", background:"rgba(52,211,153,.15)", border:"1.5px solid #a7f3d0", borderRadius:12, padding:"8px 12px", textAlign:"center" as const }}>
          <div style={{ fontSize:8, color:"#059669", marginBottom:2 }}>ご記入で</div>
          <div style={{ fontSize:12, fontWeight:700, color:"#064e3b" }}>{incentive}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   13. STUDIO  — サロン
═══════════════════════════════════════════════════ */
function PosterStudio({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#111", overflow:"hidden" }}>
      {/* bottom cream half */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"45%", background:"#fdf6ee" }}/>
      {/* gold boundary */}
      <div style={{ position:"absolute", top:"55%", left:0, right:0, height:1, background:"#c9a84c" }}/>
      {/* upper black content */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"55%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", paddingTop:20, paddingLeft:16, paddingRight:16 }}>
        <div style={{ fontSize:7, letterSpacing:"10px", color:"rgba(255,255,255,.3)", marginBottom:10 }}>SALON</div>
        <div style={{ fontSize:30, fontWeight:900, color:"#fff", textAlign:"center" as const, lineHeight:1.05, marginBottom:10 }}>{storeName}</div>
        <Stars5 c="#c9a84c"/>
        <div style={{ marginTop:12, background:"#fdf6ee", padding:10 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#111"/>}
        </div>
      </div>
      {/* lower cream content */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"45%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:12, textAlign:"center" as const }}>
        <div style={{ fontSize:8, color:"#555", marginBottom:8 }}>ご来店ありがとうございます</div>
        {incentive && (
          <div style={{ border:"1px solid #c9a84c", padding:"6px 12px", background:"rgba(201,168,76,.06)" }}>
            <div style={{ fontSize:7, color:"rgba(0,0,0,.45)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#111" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   14. MARBLE  — スパ、大理石
═══════════════════════════════════════════════════ */
function PosterMarble({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#faf6f0", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center" }}>
      {/* marble veins */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 100 148" preserveAspectRatio="none">
        <path d="M20,0 Q35,30 15,60 Q5,90 25,148" stroke="rgba(201,168,76,.2)" strokeWidth="3" fill="none"/>
        <path d="M60,0 Q75,40 55,80 Q45,110 70,148" stroke="rgba(201,168,76,.15)" strokeWidth="2" fill="none"/>
        <path d="M88,12 Q95,55 78,95 Q68,125 88,148" stroke="rgba(201,168,76,.12)" strokeWidth="1.2" fill="none"/>
        <path d="M0,38 Q30,45 50,33 Q70,22 100,28" stroke="rgba(201,168,76,.1)" strokeWidth="0.9" fill="none"/>
      </svg>
      {/* outer gold frame */}
      <div style={{ position:"absolute", inset:8, border:"1px solid rgba(201,168,76,.4)", pointerEvents:"none" }}/>
      {/* inner gold frame */}
      <div style={{ position:"absolute", inset:14, border:"1px solid rgba(201,168,76,.2)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1, marginTop:28, fontSize:6, letterSpacing:"8px", color:"rgba(201,168,76,.6)" }}>SPA &amp; BEAUTY</div>
      <div style={{ position:"relative", zIndex:1, fontSize:28, fontWeight:300, color:"#2c2218", letterSpacing:"3px", textAlign:"center" as const, marginTop:10, marginBottom:8, paddingLeft:22, paddingRight:22, lineHeight:1.2 }}>{storeName}</div>
      <div style={{ position:"relative", zIndex:1, width:60, height:1, background:"linear-gradient(to right,transparent,#c9a84c,transparent)", marginBottom:10 }}/>
      <div style={{ position:"relative", zIndex:1, marginBottom:12 }}><Stars5 c="#c9a84c"/></div>
      <div style={{ position:"relative", zIndex:1, background:"#fff", padding:10, border:"1px solid rgba(201,168,76,.4)", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#2c2218"/>}
        <div style={{ fontSize:7, color:"#b8966a", letterSpacing:"2px" }}>QRコードをスキャン</div>
      </div>
      {incentive && (
        <div style={{ position:"relative", zIndex:1, marginTop:12, marginLeft:22, marginRight:22, width:"calc(100% - 44px)", border:"1px solid rgba(201,168,76,.4)", background:"rgba(201,168,76,.06)", padding:"8px 12px", textAlign:"center" as const }}>
          <div style={{ fontSize:8, color:"#b8966a", marginBottom:2 }}>レビューご記入で</div>
          <div style={{ fontSize:12, fontWeight:700, color:"#2c2218" }}>{incentive}</div>
        </div>
      )}
      <div style={{ position:"relative", zIndex:1, marginTop:"auto", marginBottom:18, width:60, height:1, background:"linear-gradient(to right,transparent,#c9a84c,transparent)" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   15. RUSH  — スポーツ
═══════════════════════════════════════════════════ */
function PosterRush({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#0a0a0a", overflow:"hidden" }}>
      {/* speed stripes SVG */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 100 148" preserveAspectRatio="none">
        <polygon points="0,50 100,20 100,60 0,90" fill="#ef4444" opacity="0.8"/>
        <polygon points="0,55 100,25 100,50 0,80" fill="#f97316" opacity="0.6"/>
      </svg>
      {/* content */}
      <div style={{ position:"relative", zIndex:1, paddingTop:22, paddingLeft:18, paddingRight:18 }}>
        <div style={{ fontSize:7, letterSpacing:"8px", color:"rgba(255,255,255,.3)", marginBottom:10 }}>SPORTS REVIEW</div>
        <div style={{ fontSize:32, fontWeight:900, color:"#fff", lineHeight:1, marginBottom:8 }}>{storeName}</div>
      </div>
      <div style={{ position:"relative", zIndex:1, paddingLeft:18, paddingRight:18, marginTop:8 }}>
        <Stars5 c="#f97316"/>
      </div>
      {/* QR bottom-right */}
      <div style={{ position:"absolute", bottom:16, right:16, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        {incentive && (
          <div style={{ background:"linear-gradient(135deg,#ef4444,#f97316)", color:"#fff", padding:"6px 12px", textAlign:"center" as const }}>
            <div style={{ fontSize:7, color:"rgba(255,255,255,.7)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:11, fontWeight:900 }}>{incentive}</div>
          </div>
        )}
        <div style={{ border:"3px solid #f97316", background:"#111", padding:8 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#fff" bgColor="#111"/>}
        </div>
        <div style={{ fontSize:7, color:"rgba(249,115,22,.7)", letterSpacing:"2px" }}>QRをスキャン</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   16. INK  — レトロ、クラフト紙
═══════════════════════════════════════════════════ */
function PosterInk({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#f2ead8", overflow:"hidden" }}>
      {/* outer double border */}
      <div style={{ position:"absolute", inset:10, border:"3px double rgba(44,62,80,.4)" }}>
        <div style={{ position:"absolute", inset:4, border:"1px solid rgba(44,62,80,.2)" }}/>
      </div>
      {/* content */}
      <div style={{ position:"relative", zIndex:1, paddingTop:24, paddingLeft:22, paddingRight:22 }}>
        <div style={{ fontSize:7, letterSpacing:"8px", color:"rgba(44,62,80,.4)", textDecoration:"underline", marginBottom:10 }}>SINCE ・ REVIEW</div>
        <div style={{ fontSize:30, fontWeight:900, color:"#1a1209", letterSpacing:"-1px", lineHeight:1, marginBottom:8 }}>{storeName}</div>
        <div style={{ fontSize:12, color:"rgba(44,62,80,.4)", letterSpacing:2, marginBottom:8 }}>━━━━━━━</div>
        <Stars5 c="#2c3e50"/>
        <div style={{ fontSize:8, color:"#5a4a35", marginTop:8 }}>本日のご感想をお聞かせください</div>
      </div>
      {/* QR bottom-right */}
      <div style={{ position:"absolute", bottom:18, right:18, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        {incentive && (
          <div style={{ background:"#2c3e50", color:"#f2ead8", padding:"6px 12px", textAlign:"center" as const }}>
            <div style={{ fontSize:7, color:"rgba(242,234,216,.6)", marginBottom:2 }}>ご記入で</div>
            <div style={{ fontSize:11, fontWeight:700 }}>{incentive}</div>
          </div>
        )}
        <div style={{ border:"2px solid #2c3e50", background:"#fffdf5", padding:8 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#1a1209" bgColor="#fffdf5"/>}
        </div>
        <div style={{ fontSize:7, letterSpacing:"2px", color:"rgba(44,62,80,.6)" }}>QRをスキャン</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   17. HYGGE  — 北欧
═══════════════════════════════════════════════════ */
function PosterHygge({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#f5f0ea", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center" }}>
      {/* geometric SVG top */}
      <svg style={{ marginTop:24, width:80 }} viewBox="0 0 80 40">
        <circle cx={40} cy={20} r={18} fill="none" stroke="rgba(139,115,85,.25)" strokeWidth="1.5"/>
        <polygon points="40,4 54,36 26,36" fill="none" stroke="rgba(139,115,85,.2)" strokeWidth="1"/>
      </svg>
      <div style={{ fontSize:7, letterSpacing:"5px", color:"rgba(139,115,85,.5)", marginTop:8, marginBottom:8 }}>HYGGE ・ REVIEW</div>
      <div style={{ fontSize:30, fontWeight:700, color:"#2c2018", textAlign:"center" as const, paddingLeft:20, paddingRight:20, lineHeight:1.1, marginBottom:8 }}>{storeName}</div>
      <div style={{ height:1, width:"70%", background:"rgba(139,115,85,.3)", marginBottom:8 }}/>
      <div style={{ fontSize:8, color:"#7a6a58", marginBottom:10 }}>ご来店ありがとうございます</div>
      <Stars5 c="#8b7355"/>
      <div style={{ marginTop:14, background:"#fff", border:"1px solid rgba(139,115,85,.25)", padding:10, borderRadius:8, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#2c2018"/>}
        <div style={{ fontSize:7, letterSpacing:"2px", color:"rgba(139,115,85,.6)" }}>QRをスキャン</div>
      </div>
      {incentive && (
        <div style={{ marginTop:12, marginLeft:20, marginRight:20, width:"calc(100% - 40px)", background:"rgba(139,115,85,.06)", border:"1px solid rgba(139,115,85,.2)", borderRadius:8, padding:"8px 12px", textAlign:"center" as const }}>
          <div style={{ fontSize:8, color:"rgba(139,115,85,.55)", marginBottom:2 }}>レビューご記入で</div>
          <div style={{ fontSize:12, fontWeight:700, color:"#2c2018" }}>{incentive}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   18. CANDY  — キャンディ
═══════════════════════════════════════════════════ */
function PosterCandy({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"linear-gradient(160deg,#fff0f5 0%,#f5f0ff 50%,#f0fff5 100%)", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center" }}>
      {/* rainbow wave SVG top */}
      <svg style={{ position:"absolute", top:0, left:0, width:"100%", height:32 }} viewBox="0 0 100 20" preserveAspectRatio="none">
        <defs><linearGradient id="rbC" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ff9de2"/><stop offset="33%" stopColor="#a78bfa"/><stop offset="66%" stopColor="#67e8f9"/><stop offset="100%" stopColor="#86efac"/></linearGradient></defs>
        <rect width="100" height="20" fill="url(#rbC)"/>
      </svg>
      {/* pastel bubbles */}
      <div style={{ position:"absolute", top:"12%", left:"6%", width:24, height:24, borderRadius:"50%", background:"#fda4af", opacity:.35 }}/>
      <div style={{ position:"absolute", top:"16%", right:"8%", width:18, height:18, borderRadius:"50%", background:"#93c5fd", opacity:.35 }}/>
      <div style={{ position:"absolute", bottom:"22%", left:"5%", width:20, height:20, borderRadius:"50%", background:"#86efac", opacity:.35 }}/>
      <div style={{ position:"absolute", bottom:"18%", right:"6%", width:22, height:22, borderRadius:"50%", background:"#c4b5fd", opacity:.35 }}/>
      <div style={{ position:"relative", zIndex:1, marginTop:38, fontSize:8, color:"#a78bfa", fontWeight:700 }}>🌈 ご感想をおしえてね</div>
      <div style={{ position:"relative", zIndex:1, fontSize:30, fontWeight:900, color:"#6d28d9", textAlign:"center" as const, marginTop:8, paddingLeft:16, paddingRight:16, lineHeight:1.1 }}>{storeName}</div>
      {/* colorful stars */}
      <div style={{ position:"relative", zIndex:1, display:"flex", gap:4, marginTop:10, marginBottom:10 }}>
        {(["#fda4af","#fbbf24","#86efac","#93c5fd","#c4b5fd"] as const).map((c,i)=>(
          <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        ))}
      </div>
      <div style={{ position:"relative", zIndex:1, border:"3px solid #e9d5ff", background:"#fff", borderRadius:20, padding:12, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#4c1d95"/>}
        <div style={{ fontSize:8, color:"#a78bfa", letterSpacing:"1px" }}>スキャンしてね！</div>
      </div>
      {incentive && (
        <div style={{ position:"relative", zIndex:1, marginTop:12, marginLeft:16, marginRight:16, width:"calc(100% - 32px)", background:"linear-gradient(135deg,rgba(253,164,175,.2),rgba(196,181,253,.2))", border:"2px solid #e9d5ff", borderRadius:16, padding:"8px 12px", textAlign:"center" as const }}>
          <div style={{ fontSize:8, color:"#7c3aed", marginBottom:2 }}>レビューで</div>
          <div style={{ fontSize:12, fontWeight:900, color:"#6d28d9" }}>{incentive}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   19. NOIR  — ノワール
═══════════════════════════════════════════════════ */
function PosterNoir({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#080305", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* glow blobs */}
      <div style={{ position:"absolute", top:"-10%", left:"-10%", width:"65%", height:"55%", background:"radial-gradient(ellipse,rgba(153,27,27,.4) 0%,transparent 70%)", filter:"blur(30px)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-10%", right:"-10%", width:"55%", height:"48%", background:"radial-gradient(ellipse,rgba(120,10,35,.35) 0%,transparent 70%)", filter:"blur(25px)", pointerEvents:"none" }}/>
      {/* horizontal lines */}
      {[12,30,68,88].map((pct,i)=>(
        <div key={i} style={{ position:"absolute", top:`${pct}%`, left:14, right:14, height:1, background:"rgba(220,38,38,.08)" }}/>
      ))}
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"28px 20px 18px" }}>
        <div style={{ fontSize:7, letterSpacing:"8px", color:"rgba(220,38,38,.5)", marginBottom:10 }}>✦ CRITIQUE ✦</div>
        <div style={{ height:1, width:40, background:"rgba(220,38,38,.3)", marginBottom:14 }}/>
        <div style={{ fontSize:28, fontWeight:900, color:"#fce7f3", textAlign:"center" as const, lineHeight:1.1, marginBottom:8 }}>{storeName}</div>
        <Stars5 c="#991b1b"/>
        <div style={{ fontSize:8, color:"rgba(252,231,243,.4)", marginTop:10, lineHeight:1.5 }}>本日のご体験はいかがでしたでしょうか</div>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", paddingTop:14 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            <div style={{ border:"1px solid rgba(220,38,38,.4)", background:"#1a0408", padding:10 }}>
              {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#fce7f3" bgColor="#1a0408"/>}
            </div>
            <div style={{ fontSize:7, color:"rgba(220,38,38,.5)", letterSpacing:"3px" }}>QRをスキャン</div>
          </div>
        </div>
        {incentive && (
          <div style={{ border:"1px solid rgba(153,27,27,.4)", background:"rgba(153,27,27,.1)", padding:"8px 12px", textAlign:"center" as const }}>
            <div style={{ fontSize:8, color:"rgba(220,38,38,.5)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#fda4af" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   20. VITALITY  — ヴィタリティ
═══════════════════════════════════════════════════ */
function PosterVitality({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#052e16", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* leaf SVGs */}
      <svg style={{ position:"absolute", top:0, right:0, width:"45%", opacity:.15 }} viewBox="0 0 100 120">
        <path d="M85,5 Q112,5 112,38 Q112,78 70,104 Q28,118 12,92 Q-4,66 22,40 Q50,5 85,5Z" fill="rgba(52,211,153,.08)"/>
      </svg>
      <svg style={{ position:"absolute", bottom:0, left:0, width:"40%", opacity:.12 }} viewBox="0 0 100 100">
        <path d="M15,95 Q-12,95 -12,62 Q-12,18 32,3 Q72,-8 88,20 Q104,48 76,68 Q52,95 15,95Z" fill="rgba(52,211,153,.08)"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 20px 18px" }}>
        {/* leaf icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginBottom:8 }}>
          <path d="M17 8C8 10 5.9 16.17 3.82 19.44a1 1 0 001.66 1.06C7.07 18.5 12 16 12 16s-1 4 2 6c3-4 4.31-8.34 5-12" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div style={{ fontSize:7, letterSpacing:"6px", color:"rgba(52,211,153,.4)", marginBottom:10 }}>VITALITY REVIEW</div>
        <div style={{ fontSize:30, fontWeight:900, color:"#d1fae5", textAlign:"center" as const, lineHeight:1.1, marginBottom:10 }}>{storeName}</div>
        <Stars5 c="#34d399"/>
        <div style={{ fontSize:8, color:"rgba(209,250,229,.5)", marginTop:10, marginBottom:16 }}>本日のご感想をお聞かせください</div>
        <div style={{ background:"rgba(255,255,255,.1)", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)", border:"1px solid rgba(52,211,153,.3)", borderRadius:16, padding:12, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#052e16" bgColor="#d1fae5"/>}
          <div style={{ fontSize:7, color:"#34d399", letterSpacing:"2px" }}>QRをスキャン</div>
        </div>
        {incentive && (
          <div style={{ marginTop:12, width:"100%", border:"1px solid rgba(52,211,153,.25)", background:"rgba(52,211,153,.08)", padding:"8px 12px", textAlign:"center" as const, borderRadius:8 }}>
            <div style={{ fontSize:8, color:"#6ee7b7", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#d1fae5" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   21. MESH  — メッシュ
═══════════════════════════════════════════════════ */
function PosterMesh({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#0f0824", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* color blobs */}
      <div style={{ position:"absolute", top:"-15%", left:"5%", width:"60%", height:"60%", background:"radial-gradient(circle,#f43f5e 0%,transparent 65%)", filter:"blur(50px)", opacity:.5, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"20%", right:"-10%", width:"55%", height:"55%", background:"radial-gradient(circle,#6366f1 0%,transparent 65%)", filter:"blur(50px)", opacity:.5, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-10%", left:"15%", width:"60%", height:"55%", background:"radial-gradient(circle,#0ea5e9 0%,transparent 65%)", filter:"blur(50px)", opacity:.5, pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 20px 18px" }}>
        <div style={{ fontSize:7, letterSpacing:"6px", color:"rgba(248,250,252,.3)", marginBottom:10 }}>MESH REVIEW</div>
        {/* gradient text */}
        <div style={{ fontSize:32, fontWeight:900, lineHeight:1.05, textAlign:"center" as const, paddingLeft:8, paddingRight:8, background:"linear-gradient(135deg,#f43f5e,#6366f1,#0ea5e9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:10 }}>{storeName}</div>
        <Stars5 c="#f43f5e"/>
        <div style={{ fontSize:8, color:"rgba(255,255,255,.45)", marginTop:10, marginBottom:16 }}>本日のご感想をお聞かせください</div>
        {/* gradient border QR */}
        <div style={{ padding:1, borderRadius:18, background:"linear-gradient(135deg,#f43f5e,#6366f1,#0ea5e9)", display:"inline-flex" }}>
          <div style={{ background:"rgba(15,8,36,.95)", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)", borderRadius:17, padding:12, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#0f0824" bgColor="#f8fafc"/>}
            <div style={{ fontSize:7, letterSpacing:"2px", color:"rgba(248,250,252,.5)" }}>QRをスキャン</div>
          </div>
        </div>
        {incentive && (
          <div style={{ marginTop:12, marginLeft:16, marginRight:16, width:"calc(100% - 32px)", background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", borderRadius:10, padding:"8px 12px", textAlign:"center" as const }}>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.4)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   22. FOREST  — フォレスト
═══════════════════════════════════════════════════ */
function PosterForest({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#071a0e", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* tree silhouettes */}
      <svg style={{ position:"absolute", bottom:0, left:0, width:"100%" }} viewBox="0 0 200 80" preserveAspectRatio="none">
        <polygon points="10,80 22,20 34,80" fill="rgba(52,153,52,.15)"/>
        <polygon points="40,80 58,5 76,80" fill="rgba(52,153,52,.12)"/>
        <polygon points="90,80 110,0 130,80" fill="rgba(52,153,52,.15)"/>
        <polygon points="140,80 155,15 170,80" fill="rgba(52,153,52,.12)"/>
        <polygon points="175,80 188,25 200,80" fill="rgba(52,153,52,.12)"/>
      </svg>
      {/* top gold line */}
      <div style={{ height:3, background:"linear-gradient(to right,#b8860b,#ffd700,#b8860b)", flexShrink:0 }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 20px 16px" }}>
        <div style={{ fontSize:7, letterSpacing:"8px", color:"rgba(212,175,55,.4)", marginBottom:8 }}>FOREST REVIEW</div>
        <div style={{ fontSize:30, fontWeight:900, color:"#d4f5c0", textAlign:"center" as const, lineHeight:1.1, marginBottom:8 }}>{storeName}</div>
        <div style={{ height:1, width:"60%", background:"rgba(212,175,55,.3)", marginBottom:10 }}/>
        <Stars5 c="#d4af37"/>
        <div style={{ fontSize:8, color:"rgba(212,175,55,.5)", marginTop:10, marginBottom:14 }}>ご来店ありがとうございます</div>
        <div style={{ background:"#d4f5c0", padding:10, border:"1px solid rgba(212,175,55,.4)" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#071a0e"/>}
        </div>
        <div style={{ fontSize:7, color:"rgba(212,175,55,.6)", letterSpacing:"2px", marginTop:8 }}>QRをスキャン</div>
        {incentive && (
          <div style={{ marginTop:10, width:"100%", border:"1px solid rgba(212,175,55,.3)", background:"rgba(212,175,55,.06)", padding:"8px 12px", textAlign:"center" as const }}>
            <div style={{ fontSize:8, color:"rgba(212,175,55,.55)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#d4af37" }}>{incentive}</div>
          </div>
        )}
      </div>
      {/* bottom gold line */}
      <div style={{ height:3, background:"linear-gradient(to right,#b8860b,#ffd700,#b8860b)", flexShrink:0 }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   23. SUNSET  — サンセット
═══════════════════════════════════════════════════ */
function PosterSunset({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", overflow:"hidden", background:"linear-gradient(180deg,#0f1f3d 0%,#1e3a5f 20%,#c1440e 60%,#e85d7c 80%,#f9a8d4 100%)" }}>
      {/* sun */}
      <div style={{ position:"absolute", bottom:"25%", left:"50%", transform:"translateX(-50%)", width:80, height:80, borderRadius:"50%", background:"radial-gradient(circle,#ffd700,#f97316,transparent)" }}/>
      {/* upper content */}
      <div style={{ position:"relative", zIndex:1, paddingTop:22, paddingLeft:20, paddingRight:20, textAlign:"center" as const }}>
        <div style={{ fontSize:7, letterSpacing:"6px", color:"rgba(255,248,240,.5)", marginBottom:10 }}>SUNSET REVIEW</div>
        <div style={{ fontSize:30, fontWeight:900, color:"#fff", textShadow:"0 2px 20px rgba(0,0,0,.3)", lineHeight:1.1, marginBottom:10 }}>{storeName}</div>
        <Stars5 c="#ffd700"/>
        {incentive && (
          <div style={{ marginTop:10, display:"inline-block", background:"rgba(0,0,0,.3)", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)", padding:"6px 12px", color:"#fff", borderRadius:8 }}>
            <div style={{ fontSize:7, color:"rgba(253,230,138,.8)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#fde68a" }}>{incentive}</div>
          </div>
        )}
      </div>
      {/* QR fixed bottom center */}
      <div style={{ position:"absolute", bottom:16, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        <div style={{ background:"rgba(255,248,240,.9)", padding:10, borderRadius:12 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#0f1f3d"/>}
        </div>
        <div style={{ fontSize:7, color:"rgba(255,248,240,.7)", letterSpacing:"2px" }}>QRをスキャン</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   24. TYPO  — タイポグラフィ
═══════════════════════════════════════════════════ */
function PosterTypo({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#fffff8", overflow:"hidden" }}>
      {/* ghost REVIEW text */}
      <div style={{ position:"absolute", fontSize:80, fontWeight:900, color:"rgba(0,0,0,.04)", letterSpacing:"-4px", bottom:"-5%", right:"-5%", userSelect:"none" as const, pointerEvents:"none", whiteSpace:"nowrap" }}>REVIEW</div>
      {/* left vertical line */}
      <div style={{ position:"absolute", left:16, top:0, bottom:0, width:4, background:"#111" }}/>
      {/* content */}
      <div style={{ position:"relative", zIndex:1, paddingLeft:32, paddingRight:16, paddingTop:20, paddingBottom:16, display:"flex", flexDirection:"column", height:"100%" }}>
        <div style={{ fontSize:7, letterSpacing:"8px", color:"#aaa", marginBottom:8 }}>TYPOGRAPHY</div>
        <div style={{ fontSize:36, fontWeight:900, color:"#111", lineHeight:0.95, letterSpacing:"-2px", marginBottom:10 }}>{storeName}</div>
        <div style={{ height:2, background:"#111", width:"40%" }}/>
        <div style={{ marginTop:12, marginBottom:12 }}><Stars5 c="#111"/></div>
        <div style={{ fontSize:8, color:"#555", marginBottom:14 }}>ご感想をお聞かせください</div>
        <div style={{ display:"inline-block", border:"2px solid #111", padding:8 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#111"/>}
        </div>
        <div style={{ fontSize:7, color:"#ccc", letterSpacing:"3px", marginTop:8 }}>QRをスキャン</div>
        {incentive && (
          <div style={{ marginTop:12, borderTop:"2px solid #111", paddingTop:10 }}>
            <div style={{ fontSize:7, color:"#aaa", letterSpacing:"4px", marginBottom:2 }}>SPECIAL OFFER</div>
            <div style={{ fontSize:13, fontWeight:900, color:"#111" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   25. GLITCH  — グリッチ
═══════════════════════════════════════════════════ */
function PosterGlitch({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#080010", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* scanline overlay */}
      <div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0px,rgba(255,255,255,.03) 1px,transparent 1px,transparent 4px)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"28px 20px 18px" }}>
        <div style={{ fontSize:7, letterSpacing:"8px", color:"rgba(0,255,255,.4)", marginBottom:10 }}>GLITCH REVIEW</div>
        {/* glitch name */}
        <div style={{ fontSize:30, fontWeight:900, color:"#fff", lineHeight:1.05, textShadow:"-2px 0 #ff0050, 2px 0 #00ffff", marginBottom:8 }}>{storeName}</div>
        <div style={{ height:2, width:36, background:"#ff0050", marginBottom:12 }}/>
        <Stars5 c="#ff0050"/>
        <div style={{ fontSize:8, color:"rgba(0,255,255,.5)", fontFamily:"monospace", marginTop:10, lineHeight:1.5 }}>FEEDBACK_MODE: ON<br/>ご感想を入力してください</div>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", paddingTop:14 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            <div style={{ border:"1px solid #00ffff", boxShadow:"0 0 15px rgba(0,255,255,.2), inset 0 0 15px rgba(0,255,255,.05)", background:"#080010", padding:10 }}>
              {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#ff0050" bgColor="#080010"/>}
            </div>
            <div style={{ fontSize:7, letterSpacing:"3px", color:"rgba(0,255,255,.6)", fontFamily:"monospace" }}>SCAN &gt;&gt; SUBMIT</div>
          </div>
        </div>
        {incentive && (
          <div style={{ border:"1px solid rgba(255,0,80,.4)", background:"rgba(255,0,80,.06)", padding:"8px 12px", textAlign:"center" as const, fontFamily:"monospace" }}>
            <div style={{ fontSize:7, color:"rgba(0,255,255,.45)", marginBottom:2 }}>REWARD_UNLOCKED:</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#ff0050" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   26. WATERCOLOR  — 水彩
═══════════════════════════════════════════════════ */
function PosterWatercolor({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#fefcfa", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center" }}>
      {/* watercolor blobs with SVG filter */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="wc2">
            <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="4" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        <ellipse cx="30" cy="25" rx="35" ry="30" fill="#fda4af" opacity=".3" filter="url(#wc2)"/>
        <ellipse cx="75" cy="20" rx="28" ry="32" fill="#93c5fd" opacity=".25" filter="url(#wc2)"/>
        <ellipse cx="20" cy="80" rx="30" ry="25" fill="#86efac" opacity=".2" filter="url(#wc2)"/>
        <ellipse cx="80" cy="85" rx="25" ry="28" fill="#fbbf24" opacity=".2" filter="url(#wc2)"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, marginTop:28, fontSize:7, color:"#d4919c", letterSpacing:"2px" }}>🎨 WATERCOLOR REVIEW</div>
      <div style={{ position:"relative", zIndex:1, fontSize:28, fontWeight:900, color:"#4a3728", textAlign:"center" as const, marginTop:10, paddingLeft:20, paddingRight:20, lineHeight:1.1, marginBottom:10 }}>{storeName}</div>
      <div style={{ position:"relative", zIndex:1, marginBottom:10 }}><Stars5 c="#f9a8d4"/></div>
      <div style={{ position:"relative", zIndex:1, fontSize:8, color:"#5c4033", marginBottom:14, textAlign:"center" as const }}>本日のご感想をお聞かせください</div>
      <div style={{ position:"relative", zIndex:1, background:"rgba(255,255,255,.8)", backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)", border:"2px solid rgba(249,168,212,.4)", borderRadius:20, padding:12, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#4a3728"/>}
        <div style={{ fontSize:7, color:"#d4919c", letterSpacing:"2px" }}>QRをスキャン</div>
      </div>
      {incentive && (
        <div style={{ position:"relative", zIndex:1, marginTop:12, marginLeft:20, marginRight:20, width:"calc(100% - 40px)", background:"rgba(249,168,212,.1)", border:"1.5px solid rgba(249,168,212,.35)", borderRadius:14, padding:"8px 12px", textAlign:"center" as const }}>
          <div style={{ fontSize:8, color:"#d4919c", marginBottom:2 }}>レビューご記入で</div>
          <div style={{ fontSize:12, fontWeight:700, color:"#4a3728" }}>{incentive}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   27. ORIENTAL  — オリエンタル
═══════════════════════════════════════════════════ */
function PosterOriental({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#1a0505", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* red gradient overlay top */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"40%", background:"linear-gradient(180deg,rgba(127,29,29,.8),transparent)", pointerEvents:"none" }}/>
      {/* lattice SVG */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.12 }} viewBox="0 0 100 148" preserveAspectRatio="none">
        {Array.from({length:7},(_,i)=><line key={"v"+i} x1={i*16+2} y1="0" x2={i*16+2} y2="148" stroke="#d4af37" strokeWidth="0.5"/>)}
        {Array.from({length:10},(_,i)=><line key={"h"+i} x1="0" y1={i*16} x2="100" y2={i*16} stroke="#d4af37" strokeWidth="0.5"/>)}
      </svg>
      {/* top gold line */}
      <div style={{ height:4, background:"linear-gradient(to right,#b8860b,#ffd700,#b8860b)", flexShrink:0, position:"relative", zIndex:2 }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"18px 20px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"#d4af37", marginBottom:6 }}>口コミ  REVIEW</div>
        <div style={{ height:1, width:"60%", background:"linear-gradient(to right,transparent,#d4af37,transparent)", marginBottom:12 }}/>
        <div style={{ fontSize:26, fontWeight:900, color:"#fff9f0", textAlign:"center" as const, lineHeight:1.05, marginBottom:8 }}>{storeName}</div>
        <div style={{ height:1, width:"60%", background:"linear-gradient(to right,transparent,#d4af37,transparent)", marginBottom:10 }}/>
        <Stars5 c="#d4af37"/>
        <div style={{ fontSize:8, color:"rgba(212,175,55,.55)", marginTop:8, letterSpacing:"2px" }}>ご来店ありがとうございます</div>
        <div style={{ marginTop:14, border:"1px solid rgba(212,175,55,.5)", background:"#fff9f0", padding:10, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#1a0505"/>}
          <div style={{ fontSize:7, color:"rgba(212,175,55,.7)", letterSpacing:"2px" }}>QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ marginTop:10, width:"100%", border:"1px solid rgba(212,175,55,.3)", background:"rgba(127,29,29,.2)", padding:"8px 12px", textAlign:"center" as const }}>
            <div style={{ fontSize:8, color:"rgba(212,175,55,.55)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#d4af37" }}>{incentive}</div>
          </div>
        )}
      </div>
      {/* bottom gold line */}
      <div style={{ height:4, background:"linear-gradient(to right,#b8860b,#ffd700,#b8860b)", flexShrink:0, position:"relative", zIndex:2 }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   28. BARBER  — バーバー
═══════════════════════════════════════════════════ */
function PosterBarber({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#fff", overflow:"hidden" }}>
      {/* diagonal stripes */}
      <div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(135deg,transparent,transparent 20px,rgba(0,0,0,.03) 20px,rgba(0,0,0,.03) 21px)", pointerEvents:"none" }}/>
      {/* left black bar */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:14, background:"#111" }}/>
      {/* center red band in bar */}
      <div style={{ position:"absolute", left:0, top:"30%", bottom:"30%", width:14, background:"#dc2626" }}/>
      {/* content */}
      <div style={{ position:"relative", zIndex:1, paddingLeft:24, paddingRight:14, paddingTop:16, paddingBottom:12 }}>
        <div style={{ fontSize:7, letterSpacing:"6px", color:"#555", marginBottom:8 }}>BARBER · REVIEW</div>
        <div style={{ fontSize:30, fontWeight:900, color:"#111", lineHeight:0.95, letterSpacing:"-1px", marginBottom:10 }}>{storeName}</div>
        <div style={{ height:3, width:24, background:"#111", marginBottom:12 }}/>
        <div style={{ fontSize:9, color:"#444", marginBottom:12 }}>本日の仕上がりはいかがでしたか？</div>
        <Stars5 c="#111"/>
      </div>
      {/* QR bottom-right */}
      <div style={{ position:"absolute", bottom:14, right:14, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        {incentive && (
          <div style={{ background:"#111", color:"#fff", padding:"6px 12px", textAlign:"center" as const }}>
            <div style={{ fontSize:7, color:"rgba(255,255,255,.45)", marginBottom:2 }}>ご記入で</div>
            <div style={{ fontSize:11, fontWeight:700 }}>{incentive}</div>
          </div>
        )}
        <div style={{ border:"4px solid #111", padding:8, background:"#fff" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#111"/>}
        </div>
        <div style={{ fontSize:7, letterSpacing:"2px", color:"rgba(0,0,0,.4)" }}>QRをスキャン</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   29. WAVE  — サウンドウェーブ
═══════════════════════════════════════════════════ */
function PosterWave({ storeName, incentive, reviewUrl }: PosterProps) {
  const bars = Array.from({length:40}, (_,i) => {
    const h = Math.sin(i * 0.8) * 20 + 20;
    return { x: i * 5, h, y: (60 - h) / 2 };
  });
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"#0c0920", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* soundwave SVG */}
      <svg style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", left:0, width:"100%", height:"40%" }} viewBox="0 0 200 60" preserveAspectRatio="none">
        {bars.map((b,i)=>(
          <rect key={i} x={b.x} y={b.y} width={2.5} height={b.h} fill="rgba(99,102,241,.6)" rx={1}/>
        ))}
      </svg>
      {/* top wave line */}
      <svg style={{ position:"absolute", top:0, left:0, width:"100%", opacity:.35 }} viewBox="0 0 100 8" preserveAspectRatio="none" height="20">
        <path d="M0,4 Q12,0 25,4 Q37,8 50,4 Q62,0 75,4 Q87,8 100,4" fill="none" stroke="#6366f1" strokeWidth="1.5"/>
      </svg>
      {/* bottom wave line */}
      <svg style={{ position:"absolute", bottom:0, left:0, width:"100%", opacity:.35 }} viewBox="0 0 100 8" preserveAspectRatio="none" height="20">
        <path d="M0,4 Q12,8 25,4 Q37,0 50,4 Q62,8 75,4 Q87,0 100,4" fill="none" stroke="#6366f1" strokeWidth="1.5"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"26px 20px 18px" }}>
        <div style={{ fontSize:7, letterSpacing:"5px", color:"rgba(99,102,241,.4)", fontFamily:"monospace", marginBottom:10 }}>SOUND WAVE REVIEW</div>
        <div style={{ fontSize:28, fontWeight:900, color:"#e0e7ff", textAlign:"center" as const, lineHeight:1.1, marginBottom:10 }}>{storeName}</div>
        <Stars5 c="#6366f1"/>
        <div style={{ marginTop:14, border:"1px solid rgba(99,102,241,.5)", background:"rgba(99,102,241,.08)", backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)", padding:10, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#e0e7ff" bgColor="#1c1a3a"/>}
          <div style={{ fontSize:7, color:"rgba(129,140,248,.7)", letterSpacing:"2px" }}>QRをスキャン</div>
        </div>
        {incentive && (
          <div style={{ marginTop:12, marginLeft:16, marginRight:16, width:"calc(100% - 32px)", border:"1px solid rgba(99,102,241,.3)", background:"rgba(99,102,241,.08)", borderRadius:8, padding:"8px 12px", textAlign:"center" as const }}>
            <div style={{ fontSize:8, color:"rgba(129,140,248,.6)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#818cf8" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   30. KIDS  — キッズ
═══════════════════════════════════════════════════ */
function PosterKids({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:"linear-gradient(160deg,#fffbeb 0%,#fef9c3 50%,#fef3c7 100%)", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center" }}>
      {/* sun top-right */}
      <div style={{ position:"absolute", top:"-8%", right:"-8%", width:"40%", paddingTop:"40%", borderRadius:"50%", background:"radial-gradient(circle,#fbbf24 30%,rgba(251,191,36,.4) 60%,transparent 80%)" }}/>
      {/* clouds */}
      <div style={{ position:"absolute", top:"-3%", left:"5%", width:60, height:28, background:"rgba(255,255,255,.8)", borderRadius:30 }}/>
      <div style={{ position:"absolute", top:"8%", left:"55%", width:45, height:22, background:"rgba(255,255,255,.8)", borderRadius:30 }}/>
      {/* grass */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"12%", background:"#bbf7d0", borderRadius:"50% 50% 0 0 / 30% 30% 0 0" }}/>
      {/* sparkle stars */}
      {([{left:"18%",top:"6%",c:"#fbbf24"},{left:"42%",top:"3%",c:"#f87171"},{left:"62%",top:"8%",c:"#34d399"},{left:"78%",top:"3%",c:"#60a5fa"}] as const).map((s,i)=>(
        <span key={i} style={{ position:"absolute", left:s.left, top:s.top, fontSize:16, color:s.c, opacity:.7 }}>★</span>
      ))}
      {/* content */}
      <div style={{ position:"relative", zIndex:1, marginTop:28, fontSize:10, fontWeight:700, color:"#d97706" }}>😊 みなさまのこえ 😊</div>
      <div style={{ position:"relative", zIndex:1, fontSize:28, fontWeight:900, color:"#92400e", textAlign:"center" as const, marginTop:8, paddingLeft:16, paddingRight:16, lineHeight:1.1 }}>{storeName}</div>
      <div style={{ position:"relative", zIndex:1, fontSize:9, color:"#b45309", marginTop:6, marginBottom:10 }}>きてくれてありがとう！</div>
      {/* colorful stars */}
      <div style={{ position:"relative", zIndex:1, display:"flex", gap:4, marginBottom:12 }}>
        {(["#fbbf24","#f87171","#34d399","#60a5fa","#a78bfa"] as const).map((c,i)=>(
          <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        ))}
      </div>
      <div style={{ position:"relative", zIndex:1, background:"#fff", border:"3px solid #fbbf24", borderRadius:20, padding:12, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#78350f"/>}
        <div style={{ fontSize:8, fontWeight:700, color:"#b45309" }}>スキャンしてね！</div>
      </div>
      {incentive && (
        <div style={{ position:"relative", zIndex:1, marginTop:10, marginLeft:16, marginRight:16, width:"calc(100% - 32px)", background:"linear-gradient(135deg,rgba(251,191,36,.2),rgba(52,211,153,.2))", border:"2px solid #fbbf24", borderRadius:16, padding:"8px 12px", textAlign:"center" as const }}>
          <div style={{ fontSize:9, color:"#92400e", fontWeight:600, marginBottom:2 }}>かいてくれたら</div>
          <div style={{ fontSize:13, fontWeight:900, color:"#78350f" }}>{incentive}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TEMPLATE REGISTRY
═══════════════════════════════════════════════════ */
const TEMPLATES = [
  { id:"aurora",        name:"オーロラ",       thumb:"linear-gradient(135deg,#1a0533,#4c0080,#be185d)",  Component:PosterAurora,
    theme:{ bg:"linear-gradient(135deg,#0d0221,#2e1065,#7c0099)", text:"#fff", sub:"rgba(221,214,254,.65)", accent:"#fbbf24", lbl:"rgba(196,181,253,.6)", pBg:"rgba(255,255,255,.06)", pText:"#ddd6fe", div:"rgba(255,255,255,.15)", qFg:"#1e0040", qBg:"#fff", iBg:"rgba(255,255,255,.08)", iBd:"rgba(255,255,255,.18)", iText:"#c4b5fd" } as LT },
  { id:"hinomaru",      name:"和モダン",       thumb:"linear-gradient(135deg,#faf8f3 60%,#C0392B 60%)",  Component:PosterHinomaru,
    theme:{ bg:"#faf8f3", text:"#1a1a1a", sub:"#666", accent:"#C0392B", lbl:"rgba(192,57,43,.55)", pBg:"rgba(192,57,43,.05)", pText:"#1a1a1a", div:"rgba(192,57,43,.18)", qFg:"#1a1a1a", qBg:"#fff", iBg:"rgba(192,57,43,.05)", iBd:"rgba(192,57,43,.2)", iText:"#C0392B" } as LT },
  { id:"vice",          name:"ネオン",         thumb:"linear-gradient(135deg,#06040f,#ff00cc,#00e5ff)",  Component:PosterVice,
    theme:{ bg:"#06040f", text:"#fff", sub:"rgba(255,255,255,.45)", accent:"#ff00cc", lbl:"rgba(0,229,255,.55)", pBg:"rgba(0,0,0,.35)", pText:"#00e5ff", div:"rgba(255,0,204,.2)", qFg:"#06040f", qBg:"#fff", iBg:"rgba(255,0,204,.08)", iBd:"rgba(255,0,204,.3)", iText:"#ff00cc" } as LT },
  { id:"bauhaus",       name:"バウハウス",     thumb:"linear-gradient(135deg,#fafafa 55%,#e11d48 55%)",  Component:PosterBauhaus,
    theme:{ bg:"#fafafa", text:"#111", sub:"#555", accent:"#e11d48", lbl:"#bbb", pBg:"#f0f0f0", pText:"#333", div:"rgba(0,0,0,.1)", qFg:"#111", qBg:"#fff", iBg:"rgba(225,29,72,.05)", iBd:"rgba(225,29,72,.18)", iText:"#e11d48" } as LT },
  { id:"deco",          name:"アールデコ",     thumb:"linear-gradient(135deg,#080604,#c9a84c)",          Component:PosterDeco,
    theme:{ bg:"linear-gradient(135deg,#080604,#1a1408)", text:"#f5e6c8", sub:"rgba(245,230,200,.5)", accent:"#c9a84c", lbl:"rgba(201,168,76,.55)", pBg:"rgba(201,168,76,.06)", pText:"#c9a84c", div:"rgba(201,168,76,.25)", qFg:"#1a1408", qBg:"#f5e6c8", iBg:"rgba(201,168,76,.08)", iBd:"rgba(201,168,76,.28)", iText:"#c9a84c" } as LT },
  { id:"constructivist",name:"ポップアート",   thumb:"linear-gradient(135deg,#E63946,#1d3557)",          Component:PosterConstructivist,
    theme:{ bg:"#E63946", text:"#fff", sub:"rgba(255,255,255,.75)", accent:"#fff", lbl:"rgba(255,255,255,.6)", pBg:"#1d3557", pText:"#fff", div:"rgba(255,255,255,.2)", qFg:"#1d3557", qBg:"#fff", iBg:"rgba(255,255,255,.1)", iBd:"rgba(255,255,255,.25)", iText:"#fff" } as LT },
  { id:"wabi",          name:"わびさび",       thumb:"linear-gradient(135deg,#f7f0e6,#8fad88)",          Component:PosterWabi,
    theme:{ bg:"#f7f0e6", text:"#2d2a24", sub:"#7a7268", accent:"#8fad88", lbl:"#a09585", pBg:"#ede4d8", pText:"#2d2a24", div:"rgba(143,173,136,.2)", qFg:"#2d2a24", qBg:"#fff", iBg:"rgba(143,173,136,.08)", iBd:"rgba(143,173,136,.28)", iText:"#5a7d52" } as LT },
  { id:"hud",           name:"テック",         thumb:"linear-gradient(135deg,#030d1a,#00e5ff)",          Component:PosterHUD,
    theme:{ bg:"#030d1a", text:"#00e5ff", sub:"rgba(0,229,255,.45)", accent:"#00e5ff", lbl:"rgba(0,229,255,.4)", pBg:"rgba(0,229,255,.04)", pText:"#00e5ff", div:"rgba(0,229,255,.2)", qFg:"#030d1a", qBg:"#e0f8ff", iBg:"rgba(0,229,255,.06)", iBd:"rgba(0,229,255,.22)", iText:"#00e5ff" } as LT },
  { id:"couture",       name:"クチュール",     thumb:"linear-gradient(135deg,#1a0a1a 30%,#fdf8f5 30%)", Component:PosterCouture,
    theme:{ bg:"#1a0a1a", text:"#fdf8f5", sub:"rgba(253,248,245,.5)", accent:"#c9a84c", lbl:"rgba(201,168,76,.55)", pBg:"#fdf8f5", pText:"#1a0a1a", div:"rgba(201,168,76,.3)", qFg:"#1a0a1a", qBg:"#fff", iBg:"rgba(201,168,76,.08)", iBd:"rgba(201,168,76,.28)", iText:"#c9a84c" } as LT },
  { id:"riot",          name:"ボールド",       thumb:"linear-gradient(135deg,#fff 55%,#111 55%)",        Component:PosterRiot,
    theme:{ bg:"#fff", text:"#111", sub:"#555", accent:"#111", lbl:"#aaa", pBg:"#111", pText:"#fff", div:"#111", qFg:"#111", qBg:"#fff", iBg:"#f0f0f0", iBd:"#ddd", iText:"#111" } as LT },
  { id:"clinic",        name:"クリニック",     thumb:"linear-gradient(135deg,#fff,#0369a1)",             Component:PosterClinic,
    theme:{ bg:"#fff", text:"#0c4a6e", sub:"#4b7fa0", accent:"#0369a1", lbl:"rgba(3,105,161,.45)", pBg:"#eff6ff", pText:"#0c4a6e", div:"rgba(3,105,161,.15)", qFg:"#0c4a6e", qBg:"#fff", iBg:"rgba(3,105,161,.05)", iBd:"rgba(3,105,161,.18)", iText:"#0369a1" } as LT },
  { id:"zen",           name:"ウェルネス",     thumb:"linear-gradient(135deg,#f0fdf4,#34d399)",          Component:PosterZen,
    theme:{ bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)", text:"#064e3b", sub:"#4b7a6a", accent:"#34d399", lbl:"rgba(6,78,59,.4)", pBg:"rgba(52,211,153,.08)", pText:"#064e3b", div:"rgba(52,211,153,.22)", qFg:"#064e3b", qBg:"#fff", iBg:"rgba(52,211,153,.08)", iBd:"rgba(52,211,153,.25)", iText:"#065f46" } as LT },
  { id:"studio",        name:"サロン",         thumb:"linear-gradient(135deg,#111 40%,#fff 40%)",        Component:PosterStudio,
    theme:{ bg:"#111", text:"#fff", sub:"rgba(255,255,255,.45)", accent:"#fff", lbl:"rgba(255,255,255,.3)", pBg:"#222", pText:"#fff", div:"rgba(255,255,255,.1)", qFg:"#111", qBg:"#fff", iBg:"rgba(255,255,255,.06)", iBd:"rgba(255,255,255,.14)", iText:"#fff" } as LT },
  { id:"marble",        name:"スパ",           thumb:"linear-gradient(135deg,#faf6f0,#c9a84c)",          Component:PosterMarble,
    theme:{ bg:"#faf6f0", text:"#2c2218", sub:"#7a6a58", accent:"#c9a84c", lbl:"rgba(201,168,76,.5)", pBg:"#f5efe6", pText:"#2c2218", div:"rgba(201,168,76,.2)", qFg:"#2c2218", qBg:"#fff", iBg:"rgba(201,168,76,.07)", iBd:"rgba(201,168,76,.22)", iText:"#8a6a1e" } as LT },
  { id:"rush",          name:"スポーツ",       thumb:"linear-gradient(135deg,#0a0a0a,#ef4444,#f97316)",  Component:PosterRush,
    theme:{ bg:"#0a0a0a", text:"#fff", sub:"rgba(255,255,255,.45)", accent:"#f97316", lbl:"rgba(249,115,22,.5)", pBg:"rgba(239,68,68,.07)", pText:"#fff", div:"rgba(239,68,68,.2)", qFg:"#0a0a0a", qBg:"#fff", iBg:"rgba(249,115,22,.08)", iBd:"rgba(249,115,22,.28)", iText:"#f97316" } as LT },
  { id:"ink",           name:"レトロ",         thumb:"linear-gradient(135deg,#f2ead8,#2c3e50)",          Component:PosterInk,
    theme:{ bg:"#f2ead8", text:"#1a1209", sub:"#5a4a35", accent:"#2c3e50", lbl:"#8a7a65", pBg:"#e8ddc8", pText:"#1a1209", div:"rgba(44,62,80,.15)", qFg:"#1a1209", qBg:"#fff", iBg:"rgba(26,18,9,.05)", iBd:"rgba(26,18,9,.15)", iText:"#1a1209" } as LT },
  { id:"hygge",         name:"北欧",           thumb:"linear-gradient(135deg,#f5f0ea,#8b7355)",          Component:PosterHygge,
    theme:{ bg:"#f5f0ea", text:"#2c2018", sub:"#7a6a58", accent:"#8b7355", lbl:"#a09585", pBg:"#ede5dc", pText:"#2c2018", div:"rgba(139,115,85,.15)", qFg:"#2c2018", qBg:"#fff", iBg:"rgba(139,115,85,.07)", iBd:"rgba(139,115,85,.22)", iText:"#6b5535" } as LT },
  { id:"candy",         name:"キャンディ",     thumb:"linear-gradient(135deg,#fda4af,#a78bfa,#86efac)",  Component:PosterCandy,
    theme:{ bg:"linear-gradient(135deg,#fff0f5,#f0f0ff,#f0fff8)", text:"#6d28d9", sub:"#a78bfa", accent:"#a78bfa", lbl:"rgba(167,139,250,.55)", pBg:"rgba(167,139,250,.07)", pText:"#6d28d9", div:"rgba(167,139,250,.2)", qFg:"#4c1d95", qBg:"#fff", iBg:"rgba(167,139,250,.07)", iBd:"rgba(167,139,250,.22)", iText:"#7c3aed" } as LT },
  { id:"noir",          name:"ノワール",       thumb:"linear-gradient(135deg,#100608,#991b1b)",          Component:PosterNoir,
    theme:{ bg:"#100608", text:"#fce7f3", sub:"rgba(252,231,243,.42)", accent:"#991b1b", lbl:"rgba(220,38,38,.42)", pBg:"rgba(153,27,27,.07)", pText:"#fce7f3", div:"rgba(220,38,38,.2)", qFg:"#fce7f3", qBg:"#1a0408", iBg:"rgba(153,27,27,.08)", iBd:"rgba(153,27,27,.28)", iText:"#fda4af" } as LT },
  { id:"vitality",      name:"ヴィタリティ",   thumb:"linear-gradient(135deg,#052e16,#34d399)",          Component:PosterVitality,
    theme:{ bg:"#052e16", text:"#d1fae5", sub:"rgba(209,250,229,.45)", accent:"#34d399", lbl:"rgba(52,211,153,.45)", pBg:"rgba(52,211,153,.06)", pText:"#d1fae5", div:"rgba(52,211,153,.2)", qFg:"#052e16", qBg:"#d1fae5", iBg:"rgba(52,211,153,.08)", iBd:"rgba(52,211,153,.22)", iText:"#34d399" } as LT },
  { id:"mesh",          name:"メッシュ",       thumb:"linear-gradient(135deg,#0f0824,#f43f5e,#6366f1,#0ea5e9)", Component:PosterMesh,
    theme:{ bg:"linear-gradient(135deg,#0f0824,#1e0533)", text:"#f8fafc", sub:"rgba(248,250,252,.45)", accent:"#f43f5e", lbl:"rgba(99,102,241,.5)", pBg:"rgba(244,63,94,.06)", pText:"#f8fafc", div:"rgba(99,102,241,.25)", qFg:"#0f0824", qBg:"#f8fafc", iBg:"rgba(244,63,94,.07)", iBd:"rgba(244,63,94,.25)", iText:"#fb7185" } as LT },
  { id:"forest",        name:"フォレスト",     thumb:"linear-gradient(135deg,#071a0e,#d4af37)",          Component:PosterForest,
    theme:{ bg:"#071a0e", text:"#d4f5c0", sub:"rgba(212,245,192,.45)", accent:"#d4af37", lbl:"rgba(212,175,55,.45)", pBg:"rgba(212,175,55,.05)", pText:"#d4f5c0", div:"rgba(212,175,55,.2)", qFg:"#071a0e", qBg:"#d4f5c0", iBg:"rgba(212,175,55,.07)", iBd:"rgba(212,175,55,.22)", iText:"#d4af37" } as LT },
  { id:"sunset",        name:"サンセット",     thumb:"linear-gradient(180deg,#1e3a5f,#f97316,#ec4899)",  Component:PosterSunset,
    theme:{ bg:"linear-gradient(160deg,#1e3a5f,#7b3f10)", text:"#fff8f0", sub:"rgba(255,248,240,.5)", accent:"#f97316", lbl:"rgba(249,115,22,.45)", pBg:"rgba(249,115,22,.08)", pText:"#fff8f0", div:"rgba(249,115,22,.2)", qFg:"#1e3a5f", qBg:"#fff8f0", iBg:"rgba(249,115,22,.08)", iBd:"rgba(249,115,22,.25)", iText:"#f97316" } as LT },
  { id:"typo",          name:"タイポ",         thumb:"linear-gradient(135deg,#fffff8 85%,#111 85%)",     Component:PosterTypo,
    theme:{ bg:"#fffff8", text:"#111", sub:"#555", accent:"#111", lbl:"#aaa", pBg:"#111", pText:"#fff", div:"#111", qFg:"#111", qBg:"#fffff8", iBg:"#f0f0e8", iBd:"#ddd", iText:"#111" } as LT },
  { id:"glitch",        name:"グリッチ",       thumb:"linear-gradient(135deg,#0a0010,#ff0050,#00ffff)",  Component:PosterGlitch,
    theme:{ bg:"#0a0010", text:"#fff", sub:"rgba(255,255,255,.45)", accent:"#ff0050", lbl:"rgba(0,255,255,.45)", pBg:"rgba(255,0,80,.05)", pText:"#fff", div:"rgba(0,255,255,.2)", qFg:"#0a0010", qBg:"#fff", iBg:"rgba(255,0,80,.06)", iBd:"rgba(255,0,80,.25)", iText:"#ff0050" } as LT },
  { id:"watercolor",    name:"水彩",           thumb:"linear-gradient(135deg,#fefcfa,#fda4af,#93c5fd)",  Component:PosterWatercolor,
    theme:{ bg:"#fefcfa", text:"#4a3728", sub:"#9b7e6e", accent:"#f9a8d4", lbl:"#d4919c", pBg:"rgba(249,168,212,.06)", pText:"#4a3728", div:"rgba(249,168,212,.25)", qFg:"#4a3728", qBg:"#fff", iBg:"rgba(249,168,212,.08)", iBd:"rgba(249,168,212,.25)", iText:"#4a3728" } as LT },
  { id:"oriental",      name:"オリエンタル",   thumb:"linear-gradient(135deg,#1a0505,#d4af37)",          Component:PosterOriental,
    theme:{ bg:"#1a0505", text:"#fff9f0", sub:"rgba(255,249,240,.45)", accent:"#d4af37", lbl:"rgba(212,175,55,.45)", pBg:"rgba(212,175,55,.05)", pText:"#fff9f0", div:"rgba(212,175,55,.25)", qFg:"#1a0505", qBg:"#fff9f0", iBg:"rgba(127,29,29,.2)", iBd:"rgba(212,175,55,.28)", iText:"#d4af37" } as LT },
  { id:"barber",        name:"バーバー",       thumb:"linear-gradient(135deg,#fff 85%,#dc2626 85%)",     Component:PosterBarber,
    theme:{ bg:"#fff", text:"#111", sub:"#555", accent:"#dc2626", lbl:"#aaa", pBg:"#111", pText:"#fff", div:"#111", qFg:"#111", qBg:"#fff", iBg:"#111", iBd:"#333", iText:"#fff" } as LT },
  { id:"wave",          name:"サウンドウェーブ",thumb:"linear-gradient(135deg,#0c0920,#6366f1)",          Component:PosterWave,
    theme:{ bg:"#0c0920", text:"#e0e7ff", sub:"rgba(224,231,255,.45)", accent:"#6366f1", lbl:"rgba(99,102,241,.45)", pBg:"rgba(99,102,241,.07)", pText:"#e0e7ff", div:"rgba(99,102,241,.25)", qFg:"#0c0920", qBg:"#e0e7ff", iBg:"rgba(99,102,241,.08)", iBd:"rgba(99,102,241,.28)", iText:"#818cf8" } as LT },
  { id:"kids",          name:"キッズ",         thumb:"linear-gradient(160deg,#fffbeb,#fbbf24,#bbf7d0)",  Component:PosterKids,
    theme:{ bg:"linear-gradient(135deg,#fffbeb,#fef9c3)", text:"#78350f", sub:"#b45309", accent:"#fbbf24", lbl:"#d97706", pBg:"rgba(251,191,36,.1)", pText:"#78350f", div:"rgba(251,191,36,.3)", qFg:"#78350f", qBg:"#fff", iBg:"rgba(251,191,36,.12)", iBd:"rgba(251,191,36,.35)", iText:"#78350f" } as LT },
] as const;

type TemplateId = typeof TEMPLATES[number]["id"];

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export default function QrGeneratorPage() {
  const { stores, selectedStore, setSelectedStoreId, loading } = useStores();
  const [incentive, setIncentive] = useState(incentiveOptions[0]);
  const [customIncentive, setCustomIncentive] = useState("");
  const [templateId, setTemplateId] = useState<TemplateId>("aurora");
  const [templateExpanded, setTemplateExpanded] = useState(false);
  const [sizeId, setSizeId] = useState<SizeId>("hagaki");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const posterRef = useRef<HTMLDivElement>(null);

  const displayIncentive = incentive === "特典なし" ? "" : (customIncentive || incentive);
  // window.location.originを使い、どのドメインにデプロイされていても正しいURLを生成する
  const appUrl = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL ?? "");
  const reviewUrl = selectedStore ? `${appUrl}/review/${selectedStore.id}` : "";
  const template = TEMPLATES.find(t => t.id === templateId) ?? TEMPLATES[0];
  const PosterComponent = template.Component;
  const size = SIZES.find(s => s.id === sizeId) ?? SIZES[1];

  // 縦横に応じてmm寸法・アスペクト比・maxW・スケールを決定
  const mmW = orientation === "portrait" ? size.pw : size.ph;
  const mmH = orientation === "portrait" ? size.ph : size.pw;
  const maxW = orientation === "portrait" ? size.pmaxW : size.lmaxW;
  const aspectRatio = `${mmW}/${mmH}`;
  // コンテナpx幅に対するスケール（はがき288px基準）
  const containerPx = orientation === "portrait" ? size.pxW : size.lxW;
  const previewScale = containerPx / BASE_PX;
  const invPct = `${(100 / previewScale).toFixed(3)}%`;

  if (loading) {
    return (
      <div className="p-6"><div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded"/><div className="h-4 w-64 bg-gray-100 rounded"/>
        <div className="grid grid-cols-2 gap-6 mt-6"><div className="h-96 bg-gray-100 rounded-xl"/><div className="h-96 bg-gray-100 rounded-xl"/></div>
      </div></div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-gray-300"/>
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
        {/* Settings */}
        <div className="space-y-5">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <QrCode className="w-4 h-4"/>ポスター設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">店舗選択</Label>
                <Select value={selectedStore?.id ?? ""} onValueChange={(v) => v && setSelectedStoreId(v)}>
                  <SelectTrigger className="border-gray-200 w-full">
                    <SelectValue>{selectedStore?.name ?? "店舗を選択"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map(s => <SelectItem key={s.id} value={s.id} label={s.name}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5"/>レビューのお礼
                </Label>
                <Select value={incentive} onValueChange={(v) => setIncentive(v ?? incentiveOptions[0])}>
                  <SelectTrigger className="border-gray-200"><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {incentiveOptions.map(opt => <SelectItem key={opt} value={opt} label={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
                {incentive !== "特典なし" && (
                  <Input placeholder="カスタムテキスト（任意）" value={customIncentive}
                    onChange={e => setCustomIncentive(e.target.value)} className="border-gray-200"/>
                )}
              </div>

              {/* Template grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">デザインテンプレート</Label>
                  <button
                    onClick={() => setTemplateExpanded(v => !v)}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors"
                  >
                    {templateExpanded ? (
                      <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/></svg>折りたたむ</>
                    ) : (
                      <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>全{TEMPLATES.length}種を表示</>
                    )}
                  </button>
                </div>
                <div className={`grid gap-2 transition-all duration-300 ${templateExpanded ? "grid-cols-6 max-h-none overflow-visible" : "grid-cols-5 max-h-56 overflow-y-auto"} pr-0.5`}>
                  {TEMPLATES.map(t => (
                    <button key={t.id} onClick={() => setTemplateId(t.id)} title={t.name}
                      className="group flex flex-col items-center gap-1">
                      <div className={`w-full aspect-[2/3] rounded-lg transition-all duration-150 ${templateId===t.id ? "ring-2 ring-indigo-500 ring-offset-2 scale-105" : "opacity-70 hover:opacity-95 hover:scale-102"}`}
                        style={{ background: t.thumb }}/>
                      <span className={`text-[10px] leading-tight text-center w-full truncate ${templateId===t.id ? "text-indigo-600 font-semibold" : "text-gray-400"}`}>
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

          <Button onClick={() => window.print()} className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Printer className="w-4 h-4"/>印刷する
          </Button>

          <Card className="border-0 shadow-sm bg-blue-50">
            <CardContent className="p-4">
              <p className="text-sm text-blue-700 font-medium mb-1">使い方ガイド</p>
              <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
                <li>店舗・レビューのお礼・デザインを設定</li>
                <li>サイズを選んで印刷してレジ付近に掲示</li>
                <li>お客様がQRコードをスキャンして評価</li>
                <li>設定しきい値以上はGoogleレビューへ誘導</li>
                <li>それ以下は店内フォームで意見収集</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">プレビュー（{mmW}×{mmH}mm）</p>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{template.name}</span>
          </div>

          {/* Size + orientation selector */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="flex gap-1.5 flex-wrap flex-1">
              {SIZES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSizeId(s.id)}
                  className={`flex flex-col items-center px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    sizeId === s.id
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <span className="font-semibold">{s.label}</span>
                  <span className={`text-[10px] font-normal ${sizeId === s.id ? "text-indigo-400" : "text-gray-400"}`}>{orientation === "portrait" ? `${s.pw}×${s.ph}` : `${s.ph}×${s.pw}`}mm</span>
                </button>
              ))}
            </div>

            {/* 縦横トグル */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden shrink-0">
              <button
                onClick={() => setOrientation("portrait")}
                title="縦（ポートレート）"
                className={`flex items-center gap-1 px-2.5 py-2 text-xs font-medium transition-all ${
                  orientation === "portrait" ? "bg-indigo-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {/* 縦長の長方形アイコン */}
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                  <rect x="1" y="1" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                縦
              </button>
              <button
                onClick={() => setOrientation("landscape")}
                title="横（ランドスケープ）"
                className={`flex items-center gap-1 px-2.5 py-2 text-xs font-medium transition-all border-l border-gray-200 ${
                  orientation === "landscape" ? "bg-indigo-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {/* 横長の長方形アイコン */}
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <rect x="1" y="1" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                横
              </button>
            </div>
          </div>

          {/* ポスタープレビュー（scale変換でどのサイズでも崩れない） */}
          <div className={`mx-auto ${maxW}`}>
            <div ref={posterRef}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-lg"
              style={{ aspectRatio, position: "relative" }}
            >
              {/* スケールラッパー: BASE_PX=288基準でコンテナに合わせて縮拡 */}
              <div style={{
                position: "absolute", top: 0, left: 0,
                width: invPct, height: invPct,
                transformOrigin: "top left",
                transform: `scale(${previewScale})`,
              }}>
                {selectedStore && reviewUrl ? (
                  orientation === "portrait"
                    ? <PosterComponent storeName={selectedStore.name} incentive={displayIncentive} reviewUrl={reviewUrl}/>
                    : <LandscapePoster storeName={selectedStore.name} incentive={displayIncentive} reviewUrl={reviewUrl} theme={template.theme as LT}/>
                ) : (
                  <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:"#f9fafb", color:"#9ca3af", fontSize:14 }}>
                    店舗を選択してください
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
