"use client";

import React, { useState, useRef, useEffect } from "react";
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
const SIZES = [
  { id: "meishi",   label: "名刺",   pw: 55,  ph: 91,  pmaxW: "max-w-[180px]", lmaxW: "max-w-[300px]" },
  { id: "hagaki",   label: "はがき", pw: 100, ph: 148, pmaxW: "max-w-xs",       lmaxW: "max-w-sm"       },
  { id: "l",        label: "L判",    pw: 89,  ph: 127, pmaxW: "max-w-[240px]",  lmaxW: "max-w-sm"       },
  { id: "a5",       label: "A5",     pw: 148, ph: 210, pmaxW: "max-w-sm",       lmaxW: "max-w-md"       },
  { id: "a4",       label: "A4",     pw: 210, ph: 297, pmaxW: "max-w-sm",       lmaxW: "max-w-lg"       },
] as const;
type SizeId = typeof SIZES[number]["id"];

// ポスターは常にこの幅でレンダリングし、コンテナに合わせてscale縮小する
const CANONICAL_W = 320;

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
   1. AURORA  — glassmorphism + violet mesh gradient
═══════════════════════════════════════════════════ */
function PosterAurora({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(145deg,#0d0221 0%,#1a0533 25%,#2e1065 55%,#4c0080 75%,#7c0099 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* mesh blobs */}
      <div style={{ position:"absolute", top:"-20%", left:"-10%", width:"70%", height:"60%", borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,.55) 0%,transparent 70%)", filter:"blur(30px)" }}/>
      <div style={{ position:"absolute", bottom:"-10%", right:"-10%", width:"60%", height:"55%", borderRadius:"50%", background:"radial-gradient(circle,rgba(236,72,153,.45) 0%,transparent 70%)", filter:"blur(30px)" }}/>
      <div style={{ position:"absolute", top:"40%", left:"20%", width:"40%", height:"40%", borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,.4) 0%,transparent 70%)", filter:"blur(20px)" }}/>
      {/* ghost letters */}
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", overflow:"hidden" }}>
        <span style={{ fontSize:"clamp(48px,13vw,90px)", fontWeight:900, color:"rgba(255,255,255,.05)", letterSpacing:"-2px", whiteSpace:"nowrap" }}>{storeName}</span>
      </div>
      {/* content */}
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 16px 12px" }}>
        <div style={{ fontSize:9, letterSpacing:"4px", color:"rgba(196,181,253,.75)", textTransform:"uppercase", marginBottom:4 }}>ご来店ありがとうございます</div>
        <div style={{ fontSize:22, fontWeight:900, color:"#fff", textAlign:"center", textShadow:"0 0 30px rgba(167,139,250,.6)", marginBottom:12, lineHeight:1.2 }}>{storeName}</div>
        <Stars5 c="#fbbf24"/>
        <div style={{ fontSize:10, color:"rgba(221,214,254,.7)", margin:"10px 0 14px", textAlign:"center" }}>本日のご感想をお聞かせください</div>
        {/* glass card */}
        <div style={{ background:"rgba(255,255,255,.1)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,.2)", borderRadius:20, padding:"14px 14px 10px", display:"flex", flexDirection:"column", alignItems:"center", gap:8, marginBottom:12 }}>
          <div style={{ background:"#fff", borderRadius:12, padding:8 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={118} level="M" fgColor="#1e0040"/>}
          </div>
          <div style={{ fontSize:9, color:"rgba(221,214,254,.75)", letterSpacing:"2px" }}>📱 QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.15)", borderRadius:14, padding:"10px 12px", textAlign:"center", marginBottom:12 }}>
            <div style={{ fontSize:9, color:"rgba(196,181,253,.65)" }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"rgba(196,181,253,.5)" }}>スタッフにお声がけください</div>
          </div>
        )}
        <div style={{ display:"flex", gap:14, marginTop:"auto" }}>
          {["スキャン","評価","完了"].map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:16, height:16, borderRadius:"50%", background:"rgba(167,139,250,.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff" }}>{i+1}</div>
              <span style={{ fontSize:9, color:"rgba(221,214,254,.65)" }}>{s}</span>
              {i<2&&<span style={{ color:"rgba(167,139,250,.4)", fontSize:10 }}>›</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   2. HINOMARU  — Japanese minimal, red sun disc
═══════════════════════════════════════════════════ */
function PosterHinomaru({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#faf8f3", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* red sun — large, centered-high */}
      <div style={{ position:"absolute", top:"-5%", left:"50%", transform:"translateX(-50%)", width:"80%", paddingTop:"80%", borderRadius:"50%", background:"#C0392B", opacity:.12 }}/>
      {/* top/bottom rules */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:5, background:"#C0392B" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:5, background:"#C0392B" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"18px 20px 14px" }}>
        <div style={{ fontSize:9, letterSpacing:"6px", color:"#C0392B", marginBottom:6 }}>口 コ ミ</div>
        <div style={{ width:24, height:2, background:"#C0392B", marginBottom:14 }}/>
        <div style={{ fontSize:24, fontWeight:900, color:"#1a0a00", textAlign:"center", lineHeight:1.2, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:9, color:"#8b6f5e", marginBottom:14, letterSpacing:"2px" }}>ご来店ありがとうございます</div>
        <Stars5 c="#C0392B"/>
        <div style={{ fontSize:10, color:"#5c3317", margin:"10px 0 14px", textAlign:"center" }}>本日のご感想をお聞かせください</div>
        {/* QR in red-bordered frame */}
        <div style={{ border:"3px solid #C0392B", padding:"10px", background:"#fff", marginBottom:10 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={118} level="M" fgColor="#1a0a00"/>}
        </div>
        <div style={{ fontSize:9, color:"#C0392B", marginBottom:12, letterSpacing:"2px" }}>QRコードをスキャン</div>
        {incentive && (
          <div style={{ width:"100%", border:"1px solid #C0392B", padding:"10px 12px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"#8b6f5e" }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#C0392B", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#a0856a" }}>スタッフにお声がけください</div>
          </div>
        )}
        <div style={{ fontSize:8, color:"#c4a882", letterSpacing:"3px", marginTop:"auto" }}>またのお越しをお待ちしております</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   3. VICE  — neon pink+cyan split, dark
═══════════════════════════════════════════════════ */
function PosterVice({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#06040f", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* dual glow pools */}
      <div style={{ position:"absolute", top:"10%", left:"-5%", width:"55%", height:"55%", background:"radial-gradient(circle,rgba(255,0,180,.25) 0%,transparent 70%)", filter:"blur(25px)" }}/>
      <div style={{ position:"absolute", top:"10%", right:"-5%", width:"55%", height:"55%", background:"radial-gradient(circle,rgba(0,230,255,.2) 0%,transparent 70%)", filter:"blur(25px)" }}/>
      {/* diagonal divider */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.06 }} viewBox="0 0 100 148" preserveAspectRatio="none">
        <line x1="0" y1="148" x2="100" y2="0" stroke="#fff" strokeWidth="0.5"/>
      </svg>
      {/* scanlines */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,rgba(255,255,255,.015) 0px,transparent 1px,transparent 3px)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 16px 12px" }}>
        <div style={{ fontSize:9, letterSpacing:"5px", background:"linear-gradient(90deg,#ff00cc,#00e5ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:8 }}>REVIEW</div>
        {/* chrome store name */}
        <div style={{ fontSize:21, fontWeight:900, textAlign:"center", lineHeight:1.15, marginBottom:4, background:"linear-gradient(180deg,#fff 40%,rgba(255,255,255,.5) 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{storeName}</div>
        <div style={{ fontSize:9, color:"rgba(255,255,255,.35)", marginBottom:12 }}>ご来店ありがとうございます</div>
        <Stars5 c="#ff00cc"/>
        <div style={{ fontSize:10, color:"rgba(255,255,255,.5)", margin:"10px 0 14px" }}>本日のご感想をお聞かせください</div>
        {/* neon frame QR */}
        <div style={{ position:"relative", padding:2, borderRadius:12, background:"linear-gradient(135deg,#ff00cc,#00e5ff)", marginBottom:10 }}>
          <div style={{ background:"#06040f", borderRadius:10, padding:"10px 10px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <div style={{ background:"#fff", padding:6, borderRadius:6 }}>
              {reviewUrl && <QRCode value={reviewUrl} size={116} level="M" fgColor="#06040f"/>}
            </div>
            <div style={{ fontSize:8, letterSpacing:"3px", background:"linear-gradient(90deg,#ff00cc,#00e5ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>SCAN → REVIEW</div>
          </div>
        </div>
        {incentive && (
          <div style={{ width:"100%", border:"1px solid rgba(255,0,204,.3)", background:"rgba(255,0,204,.06)", borderRadius:10, padding:"10px 12px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,.35)" }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#ff00cc", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.25)" }}>スタッフにお声がけください</div>
          </div>
        )}
        <div style={{ display:"flex", gap:14, marginTop:"auto" }}>
          {["SCAN","RATE","DONE"].map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:16, height:16, borderRadius:4, background:i%2===0?"rgba(255,0,204,.4)":"rgba(0,229,255,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff" }}>{i+1}</div>
              <span style={{ fontSize:9, color:"rgba(255,255,255,.4)" }}>{s}</span>
              {i<2&&<span style={{ color:"rgba(255,255,255,.2)" }}>›</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   4. BAUHAUS  — Swiss International Style
═══════════════════════════════════════════════════ */
function PosterBauhaus({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#fafafa", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* giant background text */}
      <div style={{ position:"absolute", bottom:"20%", left:"-2%", fontSize:"clamp(50px,14vw,100px)", fontWeight:900, color:"rgba(0,0,0,.04)", letterSpacing:"-4px", lineHeight:1, whiteSpace:"nowrap", pointerEvents:"none" }}>REVIEW</div>
      {/* red stripe */}
      <div style={{ position:"absolute", top:"30%", left:0, right:0, height:6, background:"#e11d48" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column" }}>
        {/* top block */}
        <div style={{ padding:"22px 20px 0", flex:"0 0 auto" }}>
          <div style={{ fontSize:8, letterSpacing:"5px", color:"#999", marginBottom:6 }}>CUSTOMER REVIEW</div>
          <div style={{ fontSize:28, fontWeight:900, color:"#0a0a0a", lineHeight:.95, letterSpacing:"-1px" }}>{storeName}</div>
        </div>
        {/* center QR */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 20px", gap:10 }}>
          <div style={{ fontSize:10, color:"#555", textAlign:"center" }}>本日のご感想をお聞かせください</div>
          <Stars5 c="#e11d48"/>
          <div style={{ border:"3px solid #0a0a0a", padding:10, background:"#fff" }}>
            {reviewUrl && <QRCode value={reviewUrl} size={118} level="M" fgColor="#0a0a0a"/>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:24, height:1, background:"#ccc" }}/>
            <span style={{ fontSize:8, letterSpacing:"3px", color:"#aaa" }}>QRコードをスキャン</span>
            <div style={{ width:24, height:1, background:"#ccc" }}/>
          </div>
        </div>
        {/* bottom */}
        {incentive && (
          <div style={{ background:"#0a0a0a", padding:"12px 20px", textAlign:"center" }}>
            <div style={{ fontSize:8, color:"#666", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#555", marginTop:2 }}>スタッフにお声がけください</div>
          </div>
        )}
        {!incentive && (
          <div style={{ padding:"10px 20px", display:"flex", justifyContent:"center", gap:16 }}>
            {["スキャン","評価","完了"].map((s,i)=>(
              <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:16, height:16, borderRadius:"50%", background:"#e11d48", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff" }}>{i+1}</div>
                <span style={{ fontSize:9, color:"#888" }}>{s}</span>
                {i<2&&<span style={{ color:"#ccc" }}>›</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   5. DECO  — Art Deco noir + gold sunburst
═══════════════════════════════════════════════════ */
function PosterDeco({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#080604", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* sunburst SVG */}
      <svg style={{ position:"absolute", top:"8%", left:"50%", transform:"translateX(-50%)", width:"90%", opacity:.15 }} viewBox="0 0 200 200">
        {Array.from({length:24},(_,i)=>{
          const a=i*(360/24)*Math.PI/180;
          return <line key={i} x1={100} y1={100} x2={100+95*Math.cos(a)} y2={100+95*Math.sin(a)} stroke="#c9a84c" strokeWidth="0.8"/>;
        })}
        <circle cx="100" cy="100" r="30" fill="none" stroke="#c9a84c" strokeWidth="1"/>
        <circle cx="100" cy="100" r="20" fill="none" stroke="#c9a84c" strokeWidth="0.5"/>
        <circle cx="100" cy="100" r="90" fill="none" stroke="#c9a84c" strokeWidth="0.5"/>
      </svg>
      {/* double border */}
      <div style={{ position:"absolute", inset:8, border:"1px solid rgba(201,168,76,.35)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:12, border:"1px solid rgba(201,168,76,.15)", pointerEvents:"none" }}/>
      {/* corner diamonds */}
      {[[14,14],[14,"calc(100% - 14px)"],["calc(100% - 14px)",14],["calc(100% - 14px)","calc(100% - 14px)"]].map(([t,l],i)=>(
        <div key={i} style={{ position:"absolute", top:t as string|number, left:l as string|number, width:6, height:6, background:"#c9a84c", transform:"rotate(45deg)", opacity:.6 }}/>
      ))}
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"22px 20px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"#c9a84c", marginBottom:4 }}>✦  PRESTIGE  ✦</div>
        <div style={{ width:40, height:1, background:"linear-gradient(to right,transparent,#c9a84c,transparent)", marginBottom:14 }}/>
        <div style={{ fontSize:20, fontWeight:900, color:"#f5e6c8", textAlign:"center", lineHeight:1.2, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:8, color:"rgba(201,168,76,.6)", letterSpacing:"3px", marginBottom:14 }}>ご来店賜り誠にありがとうございます</div>
        <Stars5 c="#c9a84c"/>
        <div style={{ fontSize:10, color:"rgba(245,230,200,.6)", margin:"10px 0 14px", textAlign:"center" }}>本日のご感想をお聞かせいただけますでしょうか</div>
        <div style={{ border:"1px solid #c9a84c", padding:2, marginBottom:10 }}>
          <div style={{ border:"1px solid rgba(201,168,76,.3)", padding:10, background:"#0f0b07" }}>
            {reviewUrl && <QRCode value={reviewUrl} size={114} level="M" fgColor="#f5e6c8" bgColor="#0f0b07"/>}
          </div>
        </div>
        <div style={{ fontSize:8, color:"rgba(201,168,76,.55)", letterSpacing:"2px", marginBottom:12 }}>QRコードをスキャンしてください</div>
        {incentive && (
          <div style={{ width:"100%", border:"1px solid rgba(201,168,76,.25)", background:"rgba(201,168,76,.06)", padding:"10px 12px", textAlign:"center", marginBottom:8 }}>
            <div style={{ fontSize:8, color:"rgba(201,168,76,.5)" }}>レビューご記入で</div>
            <div style={{ fontSize:12, fontWeight:600, color:"#c9a84c", margin:"4px 0" }}>✦ {incentive} ✦</div>
            <div style={{ fontSize:8, color:"rgba(201,168,76,.35)" }}>スタッフへお申し付けください</div>
          </div>
        )}
        <div style={{ marginTop:"auto", width:40, height:1, background:"linear-gradient(to right,transparent,#c9a84c,transparent)" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   6. CONSTRUCTIVIST  — Bold primary, geometric
═══════════════════════════════════════════════════ */
function PosterConstructivist({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#E63946", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* geometric shapes */}
      <div style={{ position:"absolute", top:"-10%", right:"-10%", width:"55%", paddingTop:"55%", borderRadius:"50%", background:"#1d3557" }}/>
      <div style={{ position:"absolute", bottom:"-5%", left:"-8%", width:"45%", paddingTop:"45%", background:"#f1faee" }}/>
      <div style={{ position:"absolute", top:"38%", left:"10%", width:"80%", height:5, background:"#f1faee", opacity:.3 }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 18px 12px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"rgba(241,250,238,.7)", marginBottom:6 }}>REVIEW</div>
        <div style={{ fontSize:24, fontWeight:900, color:"#f1faee", textAlign:"center", lineHeight:1.1, marginBottom:6, textShadow:"3px 3px 0 rgba(0,0,0,.3)" }}>{storeName}</div>
        <Stars5 c="#ffd166"/>
        <div style={{ fontSize:10, color:"rgba(241,250,238,.8)", margin:"10px 0 14px", textAlign:"center" }}>本日のご感想をお聞かせください</div>
        <div style={{ background:"#f1faee", padding:"12px 12px 10px", marginBottom:10, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={118} level="M" fgColor="#1d3557"/>}
          <div style={{ fontSize:8, color:"#1d3557", letterSpacing:"2px", fontWeight:700 }}>QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"#1d3557", padding:"10px 12px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"rgba(241,250,238,.5)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#f1faee" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"rgba(241,250,238,.4)", marginTop:2 }}>スタッフにお声がけください</div>
          </div>
        )}
        <div style={{ display:"flex", gap:12, marginTop:"auto" }}>
          {["①スキャン","②評価","③完了"].map((s)=>(
            <div key={s} style={{ fontSize:9, color:"rgba(241,250,238,.7)", background:"rgba(0,0,0,.2)", padding:"3px 7px", borderRadius:4 }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   7. WABI  — organic shapes, warm botanical
═══════════════════════════════════════════════════ */
function PosterWabi({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#f7f0e6", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* organic blobs */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 100 148" preserveAspectRatio="none">
        <ellipse cx="85" cy="25" rx="28" ry="32" fill="#d4b896" opacity=".25" transform="rotate(-20 85 25)"/>
        <ellipse cx="15" cy="120" rx="32" ry="26" fill="#8fad88" opacity=".2" transform="rotate(15 15 120)"/>
        <ellipse cx="90" cy="110" rx="18" ry="24" fill="#c4956a" opacity=".15" transform="rotate(-10 90 110)"/>
        <path d="M0,80 Q20,70 15,95 Q10,115 0,110Z" fill="#8fad88" opacity=".15"/>
      </svg>
      {/* leaf motif top right */}
      <svg style={{ position:"absolute", top:8, right:10, width:50, height:60, opacity:.3 }} viewBox="0 0 50 60">
        <path d="M40,5 Q55,5 55,25 Q55,50 30,58 Q5,60 5,40 Q5,15 40,5Z" fill="#5a7a52"/>
        <path d="M40,5 L20,50" stroke="#fff" strokeWidth="1.5" fill="none" opacity=".5"/>
        <path d="M40,15 Q30,30 25,45" stroke="#fff" strokeWidth="0.8" fill="none" opacity=".3"/>
        <path d="M40,15 Q48,28 42,42" stroke="#fff" strokeWidth="0.8" fill="none" opacity=".3"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 20px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"#8b6f47", marginBottom:4 }}>🌿 おこしやす 🌿</div>
        <div style={{ width:16, height:2, background:"#c4956a", marginBottom:12 }}/>
        <div style={{ fontSize:22, fontWeight:900, color:"#3d2b1f", textAlign:"center", lineHeight:1.2, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:9, color:"#8b6f47", marginBottom:14 }}>本日もご来店ありがとうございます</div>
        <Stars5 c="#c4956a"/>
        <div style={{ fontSize:10, color:"#5a4030", margin:"10px 0 14px", textAlign:"center" }}>本日のご感想をお聞かせください</div>
        <div style={{ border:"2px solid #d4b896", background:"#fffdf7", padding:10, marginBottom:10, display:"flex", flexDirection:"column", alignItems:"center", gap:6, borderRadius:4 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={116} level="M" fgColor="#3d2b1f"/>}
          <div style={{ fontSize:8, color:"#8b6f47", letterSpacing:"2px" }}>QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", border:"1px dashed #c4956a", background:"rgba(196,149,106,.08)", borderRadius:8, padding:"10px 12px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"#8b6f47" }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#3d2b1f", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#a0856a" }}>スタッフにお声がけください</div>
          </div>
        )}
        <div style={{ fontSize:8, color:"#c4b09a", marginTop:"auto" }}>またのお越しをお待ちしております</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   8. HUD  — holographic terminal, hex grid
═══════════════════════════════════════════════════ */
function buildHexPoints(): string[] {
  const pts: string[] = [];
  for(let row=0;row<7;row++)for(let col=0;col<7;col++){
    const x=col*18+(row%2?9:0), y=row*15.6;
    pts.push(`${x},${y-10} ${x+8.66},${y-5} ${x+8.66},${y+5} ${x},${y+10} ${x-8.66},${y+5} ${x-8.66},${y-5}`);
  }
  return pts;
}
const HEX_PTS = buildHexPoints();

function PosterHUD({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#030d1a", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* hex grid */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.12 }} viewBox="0 0 100 148" preserveAspectRatio="xMidYMid slice">
        {HEX_PTS.map((p,i)=><polygon key={i} points={p} fill="none" stroke="#00e5ff" strokeWidth="0.4"/>)}
      </svg>
      {/* glow center */}
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:"60%", height:"50%", background:"radial-gradient(circle,rgba(0,229,255,.15) 0%,transparent 70%)", filter:"blur(15px)" }}/>
      {/* corner brackets */}
      <div style={{ position:"absolute", top:12, left:12, width:16, height:16, borderTop:"2px solid #00e5ff", borderLeft:"2px solid #00e5ff" }}/>
      <div style={{ position:"absolute", top:12, right:12, width:16, height:16, borderTop:"2px solid #00e5ff", borderRight:"2px solid #00e5ff" }}/>
      <div style={{ position:"absolute", bottom:12, left:12, width:16, height:16, borderBottom:"2px solid #00e5ff", borderLeft:"2px solid #00e5ff" }}/>
      <div style={{ position:"absolute", bottom:12, right:12, width:16, height:16, borderBottom:"2px solid #00e5ff", borderRight:"2px solid #00e5ff" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"22px 16px 12px" }}>
        <div style={{ fontSize:8, letterSpacing:"4px", color:"#00e5ff", marginBottom:6, fontFamily:"monospace" }}>[ REVIEW.SYS ]</div>
        <div style={{ width:"100%", height:1, background:"linear-gradient(to right,transparent,#00e5ff,transparent)", marginBottom:14 }}/>
        <div style={{ fontSize:20, fontWeight:900, color:"#e0f8ff", textAlign:"center", lineHeight:1.2, textShadow:"0 0 20px rgba(0,229,255,.5)", marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:8, color:"rgba(0,229,255,.45)", fontFamily:"monospace", marginBottom:12 }}>&gt;&gt; THANK_YOU_FOR_VISITING</div>
        <Stars5 c="#00e5ff"/>
        <div style={{ fontSize:9, color:"rgba(224,248,255,.5)", margin:"10px 0 12px", fontFamily:"monospace" }}>INPUT: ご感想を入力してください</div>
        <div style={{ border:"1px solid #00e5ff", background:"rgba(0,229,255,.05)", padding:10, marginBottom:10, boxShadow:"0 0 16px rgba(0,229,255,.2)", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <div style={{ background:"#e0f8ff", padding:6 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={114} level="M" fgColor="#030d1a"/>}
          </div>
          <div style={{ fontSize:8, letterSpacing:"2px", color:"rgba(0,229,255,.65)", fontFamily:"monospace" }}>SCAN → EXECUTE</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", border:"1px solid rgba(0,229,255,.25)", background:"rgba(0,229,255,.04)", padding:"10px 12px", textAlign:"center", marginBottom:10, fontFamily:"monospace" }}>
            <div style={{ fontSize:8, color:"rgba(0,229,255,.45)" }}>REWARD_ON_COMPLETE:</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#00e5ff", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"rgba(0,229,255,.3)" }}>ASK_STAFF &gt;&gt; CLAIM</div>
          </div>
        )}
        <div style={{ marginTop:"auto", width:"100%", height:1, background:"linear-gradient(to right,transparent,#00e5ff,transparent)" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   9. COUTURE  — diagonal split, fashion editorial
═══════════════════════════════════════════════════ */
function PosterCouture({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#fdf8f5", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* diagonal blocks */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 100 148" preserveAspectRatio="none">
        <polygon points="0,0 38,0 0,148" fill="#1a0a1a"/>
        <polygon points="0,0 40,0 0,148" fill="none" stroke="#b8860b" strokeWidth="0.4" opacity=".5"/>
      </svg>
      {/* vertical store name on dark strip */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"38%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", paddingBottom:"40px" }}>
        <div style={{ writingMode:"vertical-rl", textOrientation:"mixed", transform:"rotate(180deg)", fontSize:16, fontWeight:900, color:"#fdf8f5", letterSpacing:2, lineHeight:1, textAlign:"center" }}>{storeName}</div>
        <div style={{ marginTop:10, writingMode:"vertical-rl", textOrientation:"mixed", transform:"rotate(180deg)", fontSize:7, color:"rgba(255,255,255,.35)", letterSpacing:3 }}>REVIEW</div>
      </div>
      {/* right content */}
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", paddingLeft:"42%", paddingRight:"10px", paddingTop:18, paddingBottom:12 }}>
        <div style={{ fontSize:8, letterSpacing:"3px", color:"#b8860b", marginBottom:10 }}>✦ AVIS</div>
        <Stars5 c="#b8860b"/>
        <div style={{ fontSize:9, color:"#4a3728", margin:"10px 0 12px", textAlign:"center" }}>ご感想を<br/>お聞かせください</div>
        <div style={{ border:"2px solid #1a0a1a", padding:8, marginBottom:8, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={100} level="M" fgColor="#1a0a1a"/>}
          <div style={{ fontSize:7, color:"#888", letterSpacing:"2px" }}>SCAN ME</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"#1a0a1a", padding:"8px 10px", textAlign:"center", marginBottom:8 }}>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.4)", marginBottom:2 }}>ご記入で</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#fdf8f5" }}>🎁 {incentive}</div>
            <div style={{ fontSize:7, color:"rgba(255,255,255,.3)", marginTop:2 }}>スタッフへ</div>
          </div>
        )}
        <div style={{ marginTop:"auto", display:"flex", flexDirection:"column", gap:4 }}>
          {["① スキャン","② 評価","③ 完了"].map(s=><div key={s} style={{ fontSize:8, color:"#888" }}>{s}</div>)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   10. RIOT  — brutalist B&W, giant star
═══════════════════════════════════════════════════ */
function PosterRiot({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#fff", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* giant background star */}
      <div style={{ position:"absolute", top:"-5%", left:"50%", transform:"translateX(-50%)", fontSize:"clamp(120px,35vw,260px)", fontWeight:900, color:"rgba(0,0,0,.04)", lineHeight:1, pointerEvents:"none", whiteSpace:"nowrap" }}>★</div>
      {/* black accent bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:8, background:"#111" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"18px 20px 0" }}>
          <div style={{ fontSize:7, letterSpacing:"6px", color:"#999", marginBottom:4 }}>YOUR VOICE MATTERS</div>
          <div style={{ fontSize:26, fontWeight:900, color:"#111", lineHeight:.9, letterSpacing:"-1px" }}>{storeName}</div>
          <div style={{ width:20, height:4, background:"#111", marginTop:8 }}/>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 20px" }}>
          <div style={{ fontSize:10, color:"#555", marginBottom:8, textAlign:"center" }}>本日のご感想をお聞かせください</div>
          <Stars5 c="#222"/>
          <div style={{ marginTop:12, border:"4px solid #111", padding:10 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={114} level="M" fgColor="#111"/>}
          </div>
          <div style={{ fontSize:8, letterSpacing:"3px", color:"#bbb", marginTop:8 }}>QRコードをスキャン</div>
        </div>
        <div style={{ background:"#111", padding:"12px 20px" }}>
          {incentive ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:8, color:"#666", marginBottom:3 }}>レビューご記入で</div>
              <div style={{ fontSize:14, fontWeight:900, color:"#fff" }}>🎁 {incentive}</div>
              <div style={{ fontSize:8, color:"#555", marginTop:3 }}>スタッフにお声がけください</div>
            </div>
          ) : (
            <div style={{ display:"flex", justifyContent:"center", gap:16 }}>
              {["SCAN","RATE","DONE"].map((s,i)=>(
                <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:900, color:"#111" }}>{i+1}</div>
                  <span style={{ fontSize:9, color:"#fff", fontWeight:700 }}>{s}</span>
                  {i<2&&<span style={{ color:"#555" }}>›</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   11. CLINIC  — medical precision, blue+white
═══════════════════════════════════════════════════ */
function PosterClinic({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#fff", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* top banner */}
      <div style={{ background:"linear-gradient(90deg,#0369a1,#0ea5e9)", padding:"16px 20px 14px", display:"flex", alignItems:"center", gap:10 }}>
        {/* plus mark */}
        <div style={{ position:"relative", width:26, height:26, flexShrink:0 }}>
          <div style={{ position:"absolute", top:"50%", left:0, right:0, height:8, background:"rgba(255,255,255,.9)", transform:"translateY(-50%)", borderRadius:2 }}/>
          <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:8, background:"rgba(255,255,255,.9)", transform:"translateX(-50%)", borderRadius:2 }}/>
        </div>
        <div>
          <div style={{ fontSize:7, color:"rgba(255,255,255,.65)", letterSpacing:"3px" }}>PATIENT REVIEW</div>
          <div style={{ fontSize:16, fontWeight:900, color:"#fff", lineHeight:1.1 }}>{storeName}</div>
        </div>
      </div>
      {/* subtle dot grid */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.04 }}>
        <defs><pattern id="dot" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="1" fill="#0ea5e9"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#dot)"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"18px 20px 14px" }}>
        <div style={{ width:"100%", background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:12, padding:"14px 16px", display:"flex", flexDirection:"column", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:600, color:"#0369a1", textAlign:"center" }}>本日の対応はいかがでしたか？</div>
          <div style={{ fontSize:9, color:"#7dd3fc", textAlign:"center" }}>皆様のご意見がサービス向上に繋がります</div>
          <Stars5 c="#0ea5e9"/>
          <div style={{ background:"#fff", border:"1px solid #bae6fd", padding:8, borderRadius:8 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={114} level="M" fgColor="#0369a1"/>}
          </div>
          <div style={{ fontSize:8, color:"#7dd3fc", letterSpacing:"2px" }}>📱 QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", border:"1px solid #bae6fd", background:"#f0f9ff", borderRadius:10, padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"#0ea5e9", marginBottom:2 }}>アンケートご回答で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#0369a1" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#7dd3fc", marginTop:2 }}>受付にてお申し付けください</div>
          </div>
        )}
        <div style={{ marginTop:"auto", fontSize:8, color:"#cbd5e1", letterSpacing:"3px" }}>より良い医療のために</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   12. ZEN  — concentric rings, sage wellness
═══════════════════════════════════════════════════ */
function PosterZen({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(160deg,#f0fdf4,#d1fae5 60%,#a7f3d0)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* concentric rings */}
      <svg style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:"120%", opacity:.12 }} viewBox="0 0 200 200">
        {[90,75,60,45,30].map((r,i)=><circle key={i} cx="100" cy="100" r={r} fill="none" stroke="#059669" strokeWidth="0.8"/>)}
      </svg>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"28%" }}>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width:"100%", height:"100%" }}>
          <path d="M0,20 Q25,0 50,20 Q75,40 100,20 L100,40 L0,40Z" fill="#34d399" opacity=".25"/>
          <path d="M0,28 Q25,8 50,28 Q75,48 100,28 L100,40 L0,40Z" fill="#6ee7b7" opacity=".2"/>
        </svg>
      </div>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"22px 20px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"#059669", marginBottom:4 }}>🌿 WELLNESS</div>
        <div style={{ width:20, height:1, background:"#a7f3d0", marginBottom:14 }}/>
        <div style={{ fontSize:21, fontWeight:900, color:"#064e3b", textAlign:"center", lineHeight:1.2, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:9, color:"#10b981", marginBottom:14 }}>ご来院ありがとうございます</div>
        <Stars5 c="#34d399"/>
        <div style={{ fontSize:10, color:"#065f46", margin:"10px 0 14px", textAlign:"center" }}>本日の施術はいかがでしたか？</div>
        <div style={{ background:"rgba(255,255,255,.75)", backdropFilter:"blur(8px)", border:"1.5px solid #a7f3d0", borderRadius:20, padding:"12px 12px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, marginBottom:12 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={114} level="M" fgColor="#064e3b"/>}
          <div style={{ fontSize:8, color:"#10b981", letterSpacing:"2px" }}>📱 QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"rgba(52,211,153,.15)", border:"1.5px solid #a7f3d0", borderRadius:12, padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"#059669" }}>ご記入いただいた方に</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#064e3b", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#6ee7b7" }}>スタッフへお声がけください</div>
          </div>
        )}
        <div style={{ fontSize:8, color:"#a7f3d0", marginTop:"auto" }}>心身ともに健やかに</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   13. STUDIO  — fashion B&W, editorial, CENTERED
═══════════════════════════════════════════════════ */
function PosterStudio({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#fff", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* bold black top section */}
      <div style={{ background:"#111", padding:"20px 20px 16px", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ fontSize:8, letterSpacing:"8px", color:"rgba(255,255,255,.4)", marginBottom:6 }}>HAIR & BEAUTY SALON</div>
        <div style={{ fontSize:24, fontWeight:900, color:"#fff", textAlign:"center", lineHeight:.95, letterSpacing:"-1px" }}>{storeName}</div>
        <div style={{ width:30, height:3, background:"#fff", marginTop:10 }}/>
      </div>
      {/* white content */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"16px 20px 14px" }}>
        <div style={{ fontSize:10, color:"#333", marginBottom:8, textAlign:"center" }}>本日のスタイルはいかがでしたか？</div>
        <Stars5 c="#111"/>
        <div style={{ margin:"14px 0", border:"3px solid #111", padding:10, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={114} level="M" fgColor="#111"/>}
          <div style={{ fontSize:8, letterSpacing:"3px", color:"#555" }}>SCAN TO REVIEW</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"#111", padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:8, color:"#666", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#555", marginTop:2 }}>スタッフにお声がけください</div>
          </div>
        )}
        <div style={{ marginTop:"auto", display:"flex", gap:16 }}>
          {["① SCAN","② RATE","③ DONE"].map(s=><div key={s} style={{ fontSize:8, color:"#999" }}>{s}</div>)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   14. MARBLE  — marble veins, warm gold spa
═══════════════════════════════════════════════════ */
function PosterMarble({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#faf6f0", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* marble veins SVG */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.2 }} viewBox="0 0 100 148" preserveAspectRatio="none">
        <path d="M20,0 Q35,30 15,60 Q5,90 25,148" stroke="#c4a882" strokeWidth="2.5" fill="none"/>
        <path d="M60,0 Q75,40 55,80 Q45,110 70,148" stroke="#d4b896" strokeWidth="1.5" fill="none"/>
        <path d="M85,10 Q95,50 80,90 Q70,120 90,148" stroke="#c4a882" strokeWidth="1" fill="none"/>
        <path d="M0,40 Q30,45 50,35 Q70,25 100,30" stroke="#d4b896" strokeWidth="0.8" fill="none"/>
        <path d="M0,100 Q20,95 40,110 Q60,120 100,105" stroke="#c4a882" strokeWidth="0.8" fill="none"/>
      </svg>
      {/* gold frame */}
      <div style={{ position:"absolute", inset:10, border:"1px solid rgba(201,168,76,.35)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"22px 20px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"#c9a84c", marginBottom:4 }}>S P A</div>
        <div style={{ width:30, height:1, background:"linear-gradient(to right,transparent,#c9a84c,transparent)", marginBottom:14 }}/>
        <div style={{ fontSize:20, fontWeight:900, color:"#3d2b1f", textAlign:"center", lineHeight:1.2, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:9, color:"#b8966a", marginBottom:14 }}>癒しのひとときをご提供できましたか</div>
        <Stars5 c="#c9a84c"/>
        <div style={{ fontSize:10, color:"#5c3d2a", margin:"10px 0 14px", textAlign:"center" }}>本日のご感想をお聞かせください</div>
        <div style={{ background:"rgba(255,255,255,.85)", border:"1.5px solid #dfc090", borderRadius:4, padding:"12px 12px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, marginBottom:12 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={114} level="M" fgColor="#3d2b1f"/>}
          <div style={{ fontSize:8, color:"#b8966a", letterSpacing:"2px" }}>QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", border:"1px solid #dfc090", background:"rgba(201,168,76,.06)", borderRadius:4, padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"#b8966a" }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#3d2b1f", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#c9a84c" }}>スタッフへお申し付けください</div>
          </div>
        )}
        <div style={{ marginTop:"auto", width:30, height:1, background:"linear-gradient(to right,transparent,#c9a84c,transparent)" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   15. RUSH  — sports, speed wedge, explosive
═══════════════════════════════════════════════════ */
function PosterRush({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#0a0a0a", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* speed wedges */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 100 148" preserveAspectRatio="none">
        <polygon points="0,0 55,0 0,55" fill="#ef4444" opacity=".9"/>
        <polygon points="0,0 40,0 0,40" fill="#f97316" opacity=".8"/>
        <polygon points="100,148 45,148 100,93" fill="#ef4444" opacity=".4"/>
        <polygon points="100,148 60,148 100,108" fill="#f97316" opacity=".3"/>
      </svg>
      {/* halftone */}
      <svg style={{ position:"absolute", right:0, top:"20%", width:"50%", height:"60%", opacity:.06 }} viewBox="0 0 80 100">
        {Array.from({length:7},(_,row)=>Array.from({length:5},(_,col)=><circle key={`${row}-${col}`} cx={col*16+8} cy={row*14+7} r="5" fill="#f97316"/>))}
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 18px 12px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"#f97316", marginBottom:6 }}>💪 GYM REVIEW</div>
        <div style={{ fontSize:22, fontWeight:900, color:"#fff", textAlign:"center", lineHeight:1.1, textShadow:"0 0 20px rgba(249,115,22,.4)", marginBottom:4 }}>{storeName}</div>
        <div style={{ width:24, height:3, background:"linear-gradient(to right,#ef4444,#f97316)", marginBottom:12 }}/>
        <Stars5 c="#f97316"/>
        <div style={{ fontSize:10, color:"rgba(255,255,255,.6)", margin:"10px 0 14px", textAlign:"center" }}>本日のトレーニングはいかがでしたか？</div>
        <div style={{ border:"2px solid #f97316", background:"rgba(249,115,22,.06)", padding:10, marginBottom:10, display:"flex", flexDirection:"column", alignItems:"center", gap:6, boxShadow:"0 0 20px rgba(249,115,22,.2)" }}>
          <div style={{ background:"#1a1a1a", padding:8 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={112} level="M" fgColor="#f9fafb" bgColor="#1a1a1a"/>}
          </div>
          <div style={{ fontSize:8, color:"#f97316", letterSpacing:"2px" }}>QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"linear-gradient(90deg,#ef4444,#f97316)", padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,.7)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:900, color:"#fff" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.5)", marginTop:2 }}>スタッフにお声がけください</div>
          </div>
        )}
        <div style={{ display:"flex", gap:14, marginTop:"auto" }}>
          {["SCAN","RATE","DONE"].map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:16, height:16, borderRadius:3, background:i===0?"#ef4444":i===1?"#f97316":"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:900, color:i===2?"#111":"#fff" }}>{i+1}</div>
              <span style={{ fontSize:9, color:"rgba(255,255,255,.5)", fontWeight:700 }}>{s}</span>
              {i<2&&<span style={{ color:"rgba(255,255,255,.2)" }}>›</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   16. INK  — 2-color risograph, vintage poster
═══════════════════════════════════════════════════ */
function PosterInk({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#f2ead8", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* large circle stamp */}
      <div style={{ position:"absolute", top:"8%", left:"50%", transform:"translateX(-50%)", width:"75%", paddingTop:"75%", borderRadius:"50%", border:"4px solid #2c3e50", opacity:.08 }}/>
      <div style={{ position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)", width:"68%", paddingTop:"68%", borderRadius:"50%", background:"#2c3e50", opacity:.05 }}/>
      {/* texture overlay */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.06 }}>
        <filter id="noise2"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#noise2)"/>
      </svg>
      {/* double frame */}
      <div style={{ position:"absolute", inset:8, border:"3px solid #2c3e50" }}/>
      <div style={{ position:"absolute", inset:12, border:"1px solid #2c3e50", opacity:.4 }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"22px 22px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"#2c3e50", marginBottom:6 }}>〜 お客様の声 〜</div>
        <div style={{ fontSize:22, fontWeight:900, color:"#2c3e50", textAlign:"center", lineHeight:1.2, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:9, color:"#5d6d7e", marginBottom:14, letterSpacing:"2px" }}>ご愛顧ありがとうございます</div>
        <Stars5 c="#e67e22"/>
        <div style={{ fontSize:10, color:"#2c3e50", margin:"10px 0 14px", textAlign:"center" }}>本日のご感想をお聞かせください</div>
        <div style={{ border:"3px solid #2c3e50", padding:8, background:"#fffdf5", marginBottom:10, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={112} level="M" fgColor="#2c3e50" bgColor="#fffdf5"/>}
          <div style={{ fontSize:8, color:"#5d6d7e", letterSpacing:"2px" }}>QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", border:"2px solid #2c3e50", padding:"10px 14px", textAlign:"center", marginBottom:10, background:"rgba(44,62,80,.04)" }}>
            <div style={{ fontSize:9, color:"#5d6d7e" }}>ご記入いただいた方へ</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#2c3e50", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#5d6d7e" }}>店員にお声がけください</div>
          </div>
        )}
        <div style={{ fontSize:8, color:"#8d9ea7", marginTop:"auto", letterSpacing:"3px" }}>またのお越しをお待ちしております</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   17. HYGGE  — Scandinavian, warm minimal
═══════════════════════════════════════════════════ */
function PosterHygge({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#f5f0ea", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* warm geometric */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:6, background:"#2d2926" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:6, background:"#2d2926" }}/>
      <div style={{ position:"absolute", top:20, right:16, width:50, height:50, borderRadius:"50%", background:"#e8ddd0", opacity:.8 }}/>
      <div style={{ position:"absolute", bottom:24, left:14, width:36, height:36, background:"#d6c8b8", opacity:.5, transform:"rotate(45deg)" }}/>
      {/* Scandi cross motif */}
      <svg style={{ position:"absolute", top:"55%", right:"10%", width:40, height:40, opacity:.12 }} viewBox="0 0 40 40">
        <line x1="20" y1="0" x2="20" y2="40" stroke="#2d2926" strokeWidth="3"/>
        <line x1="0" y1="20" x2="40" y2="20" stroke="#2d2926" strokeWidth="3"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 20px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"#8b7355", marginBottom:6 }}>RECENSIONE</div>
        <div style={{ fontSize:22, fontWeight:900, color:"#2d2926", textAlign:"center", lineHeight:1.2, marginBottom:4 }}>{storeName}</div>
        <div style={{ width:16, height:2, background:"#2d2926", marginBottom:14 }}/>
        <Stars5 c="#c4a882"/>
        <div style={{ fontSize:10, color:"#5c5248", margin:"10px 0 14px", textAlign:"center" }}>本日のご体験はいかがでしたか？</div>
        <div style={{ border:"2px solid #2d2926", padding:10, background:"#fff", marginBottom:10, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={112} level="M" fgColor="#2d2926"/>}
          <div style={{ fontSize:8, letterSpacing:"3px", color:"#8b7355" }}>SCAN QR CODE</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"#2d2926", padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:8, color:"#8b7355", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#f5f0ea" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#5c5248", marginTop:2 }}>スタッフにお声がけください</div>
          </div>
        )}
        <div style={{ fontSize:8, letterSpacing:"4px", color:"#c4b5a0", marginTop:"auto" }}>TACK · ありがとう</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   18. CANDY  — rainbow gradient, kawaii
═══════════════════════════════════════════════════ */
function PosterCandy({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(160deg,#fff0f5 0%,#f0f0ff 40%,#f0fff8 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* wavy rainbow top */}
      <svg style={{ position:"absolute", top:0, left:0, right:0, width:"100%", height:28 }} viewBox="0 0 100 20" preserveAspectRatio="none">
        <defs><linearGradient id="rb" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ff9de2"/><stop offset="25%" stopColor="#a78bfa"/><stop offset="50%" stopColor="#67e8f9"/><stop offset="75%" stopColor="#86efac"/><stop offset="100%" stopColor="#fde68a"/></linearGradient></defs>
        <rect width="100" height="20" fill="url(#rb)"/>
      </svg>
      {/* bubbly shapes */}
      <div style={{ position:"absolute", top:"12%", left:"8%", width:20, height:20, borderRadius:"50%", background:"#fda4af", opacity:.45 }}/>
      <div style={{ position:"absolute", top:"15%", right:"10%", width:14, height:14, borderRadius:"50%", background:"#93c5fd", opacity:.45 }}/>
      <div style={{ position:"absolute", bottom:"18%", left:"5%", width:16, height:16, borderRadius:"50%", background:"#86efac", opacity:.45 }}/>
      <div style={{ position:"absolute", bottom:"14%", right:"8%", width:18, height:18, borderRadius:"50%", background:"#c4b5fd", opacity:.45 }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"32px 18px 14px" }}>
        <div style={{ fontSize:9, fontWeight:700, color:"#a78bfa", marginBottom:6 }}>🌈 ご感想をおしえてね！</div>
        <div style={{ fontSize:21, fontWeight:900, color:"#6d28d9", textAlign:"center", lineHeight:1.2, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:9, color:"#a78bfa", marginBottom:12 }}>ご来店ありがとうございます！</div>
        <div style={{ display:"flex", gap:3 }}>
          {["#fda4af","#fbbf24","#86efac","#93c5fd","#c4b5fd"].map((c,i)=>(
            <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill={c}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ))}
        </div>
        <div style={{ fontSize:10, color:"#7c3aed", margin:"10px 0 12px", textAlign:"center" }}>今日はどうでしたか？</div>
        <div style={{ border:"3px solid #e9d5ff", background:"#fff", borderRadius:24, padding:"12px 12px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, marginBottom:12, boxShadow:"0 4px 20px rgba(167,139,250,.15)" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={112} level="M" fgColor="#4c1d95"/>}
          <div style={{ fontSize:8, color:"#a78bfa", letterSpacing:"1px" }}>📱 スキャンしてね！</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"linear-gradient(135deg,rgba(253,164,175,.2),rgba(147,197,253,.2),rgba(196,181,253,.2))", border:"2px solid #e9d5ff", borderRadius:20, padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"#7c3aed", marginBottom:2 }}>レビューで</div>
            <div style={{ fontSize:13, fontWeight:900, color:"#6d28d9" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#a78bfa", marginTop:2 }}>スタッフに話しかけてね</div>
          </div>
        )}
        <div style={{ fontSize:8, color:"#ddd6fe", marginTop:"auto" }}>またきてね～！✨</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   19. NOIR  — dark wine, editorial sophistication
═══════════════════════════════════════════════════ */
function PosterNoir({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#100608", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* wine gradient wash */}
      <div style={{ position:"absolute", top:"-10%", left:"-10%", width:"70%", height:"60%", background:"radial-gradient(circle,rgba(153,27,27,.35) 0%,transparent 70%)", filter:"blur(25px)" }}/>
      <div style={{ position:"absolute", bottom:"-10%", right:"-10%", width:"60%", height:"50%", background:"radial-gradient(circle,rgba(120,10,35,.3) 0%,transparent 70%)", filter:"blur(20px)" }}/>
      {/* thin rule lines */}
      <div style={{ position:"absolute", top:12, left:14, right:14, height:1, background:"linear-gradient(to right,transparent,rgba(220,38,38,.4),transparent)" }}/>
      <div style={{ position:"absolute", bottom:12, left:14, right:14, height:1, background:"linear-gradient(to right,transparent,rgba(220,38,38,.4),transparent)" }}/>
      <div style={{ position:"absolute", top:14, left:12, bottom:14, width:1, background:"linear-gradient(to bottom,transparent,rgba(220,38,38,.2),transparent)" }}/>
      <div style={{ position:"absolute", top:14, right:12, bottom:14, width:1, background:"linear-gradient(to bottom,transparent,rgba(220,38,38,.2),transparent)" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"22px 20px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"rgba(220,38,38,.6)", marginBottom:4 }}>✦  CRITIQUE  ✦</div>
        <div style={{ width:30, height:1, background:"rgba(220,38,38,.3)", marginBottom:14 }}/>
        <div style={{ fontSize:20, fontWeight:900, color:"#fce7f3", textAlign:"center", lineHeight:1.2, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:8, color:"rgba(220,38,38,.4)", letterSpacing:"3px", marginBottom:14 }}>ご来店ありがとうございます</div>
        <Stars5 c="#991b1b"/>
        <div style={{ fontSize:9, color:"rgba(252,231,243,.45)", margin:"10px 0 14px", textAlign:"center" }}>本日のご体験はいかがでしたでしょうか</div>
        <div style={{ border:"1px solid rgba(220,38,38,.4)", background:"rgba(153,27,27,.1)", padding:10, marginBottom:10, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <div style={{ background:"#1a0408", padding:8 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={112} level="M" fgColor="#fce7f3" bgColor="#1a0408"/>}
          </div>
          <div style={{ fontSize:8, color:"rgba(220,38,38,.5)", letterSpacing:"2px" }}>QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", border:"1px solid rgba(153,27,27,.4)", background:"rgba(153,27,27,.1)", padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:8, color:"rgba(220,38,38,.4)" }}>レビューご記入で</div>
            <div style={{ fontSize:12, fontWeight:600, color:"#fda4af", margin:"4px 0" }}>✦ {incentive} ✦</div>
            <div style={{ fontSize:8, color:"rgba(153,27,27,.4)" }}>スタッフへお申し付けください</div>
          </div>
        )}
        <div style={{ marginTop:"auto", width:30, height:1, background:"rgba(220,38,38,.3)" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   20. VITALITY  — fresh green, health forward
═══════════════════════════════════════════════════ */
function PosterVitality({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(160deg,#052e16 0%,#064e3b 40%,#065f46 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* leaf shapes */}
      <svg style={{ position:"absolute", top:0, right:0, width:"45%", opacity:.2 }} viewBox="0 0 100 120">
        <path d="M85,5 Q110,5 110,35 Q110,75 70,100 Q30,115 15,90 Q0,65 25,40 Q50,5 85,5Z" fill="#34d399"/>
        <path d="M85,5 L45,95" stroke="rgba(255,255,255,.4)" strokeWidth="2" fill="none"/>
        <path d="M85,20 Q65,50 55,80" stroke="rgba(255,255,255,.2)" strokeWidth="1" fill="none"/>
      </svg>
      <svg style={{ position:"absolute", bottom:0, left:0, width:"35%", opacity:.15 }} viewBox="0 0 100 100">
        <path d="M15,90 Q-10,90 -10,60 Q-10,20 30,5 Q70,-5 85,20 Q100,45 75,65 Q50,90 15,90Z" fill="#6ee7b7"/>
      </svg>
      {/* glow */}
      <div style={{ position:"absolute", top:"25%", left:"50%", transform:"translateX(-50%)", width:"70%", height:"40%", background:"radial-gradient(circle,rgba(52,211,153,.2) 0%,transparent 70%)", filter:"blur(20px)" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"22px 18px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"#6ee7b7", marginBottom:4 }}>🌱 HEALTH REVIEW</div>
        <div style={{ width:20, height:1, background:"#34d399", marginBottom:14 }}/>
        <div style={{ fontSize:21, fontWeight:900, color:"#ecfdf5", textAlign:"center", lineHeight:1.2, marginBottom:4, textShadow:"0 0 20px rgba(52,211,153,.3)" }}>{storeName}</div>
        <div style={{ fontSize:9, color:"rgba(110,231,183,.6)", marginBottom:14 }}>ご利用ありがとうございます</div>
        <Stars5 c="#34d399"/>
        <div style={{ fontSize:10, color:"rgba(236,253,245,.65)", margin:"10px 0 14px", textAlign:"center" }}>本日のご満足度をお聞かせください</div>
        <div style={{ background:"rgba(255,255,255,.08)", backdropFilter:"blur(8px)", border:"1.5px solid rgba(52,211,153,.4)", borderRadius:16, padding:"12px 12px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, marginBottom:12 }}>
          <div style={{ background:"#ecfdf5", padding:8, borderRadius:8 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={112} level="M" fgColor="#064e3b"/>}
          </div>
          <div style={{ fontSize:8, color:"#6ee7b7", letterSpacing:"2px" }}>📱 QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"rgba(52,211,153,.15)", border:"1.5px solid rgba(52,211,153,.35)", borderRadius:12, padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"#6ee7b7", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#ecfdf5" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"rgba(110,231,183,.5)", marginTop:2 }}>スタッフへお申し付けください</div>
          </div>
        )}
        <div style={{ display:"flex", gap:14, marginTop:"auto" }}>
          {["スキャン","評価","完了"].map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:16, height:16, borderRadius:"50%", background:"rgba(52,211,153,.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#ecfdf5" }}>{i+1}</div>
              <span style={{ fontSize:9, color:"rgba(110,231,183,.6)" }}>{s}</span>
              {i<2&&<span style={{ color:"rgba(52,211,153,.3)" }}>›</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   21. MESH  — fluid color mesh gradient
═══════════════════════════════════════════════════ */
function PosterMesh({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#0f0824", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* mesh blobs */}
      <div style={{ position:"absolute", top:"-15%", left:"10%", width:"60%", height:"60%", background:"radial-gradient(circle,#f43f5e 0%,transparent 65%)", filter:"blur(35px)", opacity:.7 }}/>
      <div style={{ position:"absolute", top:"20%", right:"-10%", width:"55%", height:"55%", background:"radial-gradient(circle,#6366f1 0%,transparent 65%)", filter:"blur(30px)", opacity:.6 }}/>
      <div style={{ position:"absolute", bottom:"-10%", left:"20%", width:"60%", height:"55%", background:"radial-gradient(circle,#0ea5e9 0%,transparent 65%)", filter:"blur(35px)", opacity:.5 }}/>
      <div style={{ position:"absolute", bottom:"30%", left:"-5%", width:"40%", height:"40%", background:"radial-gradient(circle,#a855f7 0%,transparent 65%)", filter:"blur(25px)", opacity:.5 }}/>
      {/* noise overlay */}
      <div style={{ position:"absolute", inset:0, background:"rgba(15,8,36,.35)" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"22px 18px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"rgba(255,255,255,.5)", marginBottom:6 }}>REVIEW</div>
        <div style={{ fontSize:22, fontWeight:900, color:"#fff", textAlign:"center", lineHeight:1.15, marginBottom:6 }}>{storeName}</div>
        <div style={{ width:40, height:2, background:"linear-gradient(to right,#f43f5e,#a855f7,#0ea5e9)", borderRadius:2, marginBottom:14 }}/>
        <Stars5 c="#f43f5e"/>
        <div style={{ fontSize:10, color:"rgba(255,255,255,.55)", margin:"10px 0 14px", textAlign:"center" }}>本日のご感想をお聞かせください</div>
        <div style={{ position:"relative", padding:2, borderRadius:18, background:"linear-gradient(135deg,#f43f5e,#a855f7,#0ea5e9)", marginBottom:12 }}>
          <div style={{ background:"rgba(15,8,36,.85)", backdropFilter:"blur(12px)", borderRadius:16, padding:"12px 12px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <div style={{ background:"#fff", borderRadius:10, padding:8 }}>
              {reviewUrl && <QRCode value={reviewUrl} size={112} level="M" fgColor="#0f0824"/>}
            </div>
            <div style={{ fontSize:8, background:"linear-gradient(to right,#f43f5e,#0ea5e9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"2px" }}>QRコードをスキャン</div>
          </div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", borderRadius:12, padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,.4)" }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.3)" }}>スタッフにお声がけください</div>
          </div>
        )}
        <div style={{ display:"flex", gap:14, marginTop:"auto" }}>
          {["スキャン","評価","完了"].map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:16, height:16, borderRadius:"50%", background:["#f43f5e","#a855f7","#0ea5e9"][i], display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff" }}>{i+1}</div>
              <span style={{ fontSize:9, color:"rgba(255,255,255,.45)" }}>{s}</span>
              {i<2&&<span style={{ color:"rgba(255,255,255,.2)" }}>›</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   22. FOREST  — dark green+gold, hotel/ryokan
═══════════════════════════════════════════════════ */
function PosterForest({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(160deg,#071a0e 0%,#0d2b18 50%,#0a2010 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* tree silhouettes */}
      <svg style={{ position:"absolute", bottom:0, left:0, right:0, width:"100%", opacity:.18 }} viewBox="0 0 100 50" preserveAspectRatio="none">
        <polygon points="10,50 15,20 20,50" fill="#34d399"/>
        <polygon points="25,50 32,10 39,50" fill="#4ade80"/>
        <polygon points="50,50 58,5 66,50" fill="#34d399"/>
        <polygon points="72,50 78,18 84,50" fill="#4ade80"/>
        <polygon points="85,50 91,25 97,50" fill="#34d399"/>
      </svg>
      {/* gold accent */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(to right,transparent,#d4af37,transparent)" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:"linear-gradient(to right,transparent,#d4af37,transparent)" }}/>
      {/* glow */}
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:"70%", height:"50%", background:"radial-gradient(circle,rgba(52,211,153,.12) 0%,transparent 70%)", filter:"blur(20px)" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"22px 20px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"#d4af37", marginBottom:4 }}>✦ WELCOME ✦</div>
        <div style={{ width:30, height:1, background:"linear-gradient(to right,transparent,#d4af37,transparent)", marginBottom:14 }}/>
        <div style={{ fontSize:20, fontWeight:900, color:"#ecfdf5", textAlign:"center", lineHeight:1.2, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:9, color:"rgba(212,175,55,.55)", letterSpacing:"2px", marginBottom:14 }}>ご滞在ありがとうございます</div>
        <Stars5 c="#d4af37"/>
        <div style={{ fontSize:10, color:"rgba(236,253,245,.55)", margin:"10px 0 14px", textAlign:"center" }}>本日のご感想をお聞かせください</div>
        <div style={{ border:"1px solid rgba(212,175,55,.4)", background:"rgba(212,175,55,.05)", padding:10, marginBottom:10, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <div style={{ background:"#ecfdf5", padding:8 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={112} level="M" fgColor="#071a0e"/>}
          </div>
          <div style={{ fontSize:8, color:"rgba(212,175,55,.6)", letterSpacing:"2px" }}>QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", border:"1px solid rgba(212,175,55,.25)", background:"rgba(212,175,55,.06)", padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"rgba(212,175,55,.5)" }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#d4af37", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"rgba(212,175,55,.35)" }}>スタッフへお申し付けください</div>
          </div>
        )}
        <div style={{ marginTop:"auto", width:30, height:1, background:"linear-gradient(to right,transparent,#d4af37,transparent)" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   23. SUNSET  — warm orange-pink, resort/beach
═══════════════════════════════════════════════════ */
function PosterSunset({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", background:"linear-gradient(180deg,#1e3a5f 0%,#2d6a9f 20%,#f97316 55%,#f43f5e 75%,#ec4899 100%)" }}>
      {/* sun */}
      <div style={{ position:"absolute", top:"25%", left:"50%", transform:"translate(-50%,-50%)", width:"55%", paddingTop:"55%", borderRadius:"50%", background:"radial-gradient(circle,#fde68a 0%,#fbbf24 40%,rgba(251,191,36,0) 70%)", opacity:.6 }}/>
      {/* horizon line */}
      <div style={{ position:"absolute", top:"50%", left:0, right:0, height:1, background:"rgba(255,255,255,.2)" }}/>
      {/* wave reflection */}
      <svg style={{ position:"absolute", bottom:0, left:0, right:0, width:"100%", height:"25%", opacity:.2 }} viewBox="0 0 100 30" preserveAspectRatio="none">
        <path d="M0,15 Q25,5 50,15 Q75,25 100,15 L100,30 L0,30Z" fill="#fde68a"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 18px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"rgba(255,255,255,.7)", marginBottom:6 }}>🌅 REVIEW</div>
        <div style={{ fontSize:21, fontWeight:900, color:"#fff", textAlign:"center", lineHeight:1.15, textShadow:"0 2px 12px rgba(0,0,0,.3)", marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:9, color:"rgba(255,255,255,.65)", marginBottom:14 }}>ご来店ありがとうございます</div>
        <Stars5 c="#fde68a"/>
        <div style={{ fontSize:10, color:"rgba(255,255,255,.7)", margin:"10px 0 14px", textAlign:"center" }}>本日のご感想をお聞かせください</div>
        <div style={{ background:"rgba(255,255,255,.15)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,.3)", borderRadius:20, padding:"12px 12px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, marginBottom:12 }}>
          <div style={{ background:"#fff", borderRadius:12, padding:8 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={112} level="M" fgColor="#1e3a5f"/>}
          </div>
          <div style={{ fontSize:8, color:"rgba(255,255,255,.75)", letterSpacing:"2px" }}>📱 QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.2)", borderRadius:12, padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,.6)" }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#fde68a", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.45)" }}>スタッフにお声がけください</div>
          </div>
        )}
        <div style={{ display:"flex", gap:14, marginTop:"auto" }}>
          {["スキャン","評価","完了"].map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:16, height:16, borderRadius:"50%", background:"rgba(253,230,138,.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff" }}>{i+1}</div>
              <span style={{ fontSize:9, color:"rgba(255,255,255,.6)" }}>{s}</span>
              {i<2&&<span style={{ color:"rgba(255,255,255,.3)" }}>›</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   24. TYPO  — typography-only composition
═══════════════════════════════════════════════════ */
function PosterTypo({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#fffff8", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* giant "★" background art */}
      <div style={{ position:"absolute", top:"-8%", right:"-5%", fontSize:"clamp(80px,24vw,180px)", fontWeight:900, color:"rgba(0,0,0,.04)", lineHeight:1, pointerEvents:"none" }}>★</div>
      {/* side thick rule */}
      <div style={{ position:"absolute", top:0, left:0, bottom:0, width:8, background:"#111" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", paddingLeft:18, paddingRight:16, paddingTop:16, paddingBottom:12 }}>
        <div style={{ fontSize:7, letterSpacing:"6px", color:"#aaa", marginBottom:10 }}>REVIEW</div>
        <div style={{ fontSize:10, fontWeight:900, color:"#111", letterSpacing:"-0.5px", lineHeight:1, marginBottom:2 }}>本日の</div>
        <div style={{ fontSize:10, fontWeight:900, color:"#111", lineHeight:1, marginBottom:2 }}>ご感想を</div>
        <div style={{ fontSize:10, fontWeight:900, color:"#111", lineHeight:1, marginBottom:10 }}>お聞かせください</div>
        <div style={{ fontSize:22, fontWeight:900, color:"#111", lineHeight:.95, letterSpacing:"-1px", marginBottom:10 }}>{storeName}</div>
        <div style={{ width:"100%", height:4, background:"#111", marginBottom:14 }}/>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ border:"3px solid #111", padding:8, flexShrink:0 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={100} level="M" fgColor="#111"/>}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <Stars5 c="#111"/>
            <div style={{ fontSize:8, letterSpacing:"1px", color:"#555", lineHeight:1.4 }}>QRコードをスキャンして評価してください</div>
          </div>
        </div>
        {incentive && (
          <div style={{ borderTop:"2px solid #111", paddingTop:10, marginBottom:8 }}>
            <div style={{ fontSize:7, color:"#aaa", marginBottom:2, letterSpacing:"3px" }}>SPECIAL OFFER</div>
            <div style={{ fontSize:14, fontWeight:900, color:"#111" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#888", marginTop:2 }}>スタッフにお声がけください</div>
          </div>
        )}
        <div style={{ marginTop:"auto", display:"flex", gap:14 }}>
          {["①SCAN","②RATE","③DONE"].map(s=><div key={s} style={{ fontSize:8, color:"#bbb" }}>{s}</div>)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   25. GLITCH  — digital noise, game/entertainment
═══════════════════════════════════════════════════ */
function PosterGlitch({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#0a0010", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* glitch color channels */}
      <div style={{ position:"absolute", top:"15%", left:"3%", fontSize:"clamp(22px,6vw,44px)", fontWeight:900, color:"rgba(255,0,80,.25)", lineHeight:1, pointerEvents:"none", whiteSpace:"nowrap" }}>{storeName}</div>
      <div style={{ position:"absolute", top:"calc(15% + 3px)", left:"1%", fontSize:"clamp(22px,6vw,44px)", fontWeight:900, color:"rgba(0,255,255,.2)", lineHeight:1, pointerEvents:"none", whiteSpace:"nowrap" }}>{storeName}</div>
      {/* scan lines */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,rgba(255,255,255,.015) 0,transparent 1px,transparent 3px)", pointerEvents:"none" }}/>
      {/* noise bars */}
      <div style={{ position:"absolute", top:"42%", left:0, right:0, height:3, background:"rgba(255,0,80,.15)" }}/>
      <div style={{ position:"absolute", top:"44%", left:"10%", right:"20%", height:1, background:"rgba(0,255,255,.12)" }}/>
      {/* pixel border */}
      <div style={{ position:"absolute", inset:6, border:"1px solid rgba(255,0,80,.2)" }}/>
      <div style={{ position:"absolute", inset:8, border:"1px solid rgba(0,255,255,.1)" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 18px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"#ff0050", fontFamily:"monospace", marginBottom:8 }}>[ REVIEW.EXE ]</div>
        <div style={{ fontSize:22, fontWeight:900, color:"#fff", textAlign:"center", lineHeight:1.1, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:8, color:"rgba(0,255,255,.5)", fontFamily:"monospace", marginBottom:12 }}>PLAYER_FEEDBACK_MODE: ON</div>
        <Stars5 c="#ff0050"/>
        <div style={{ fontSize:9, color:"rgba(255,255,255,.45)", fontFamily:"monospace", margin:"10px 0 12px", textAlign:"center" }}>ご感想を入力してください</div>
        <div style={{ border:"1px solid #ff0050", boxShadow:"0 0 12px rgba(255,0,80,.3),inset 0 0 8px rgba(255,0,80,.05)", padding:10, marginBottom:10, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <div style={{ background:"#0a0010", padding:8, border:"1px solid rgba(0,255,255,.2)" }}>
            {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#ff0050" bgColor="#0a0010"/>}
          </div>
          <div style={{ fontSize:8, letterSpacing:"2px", color:"rgba(0,255,255,.6)", fontFamily:"monospace" }}>SCAN &gt;&gt; SUBMIT</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"rgba(255,0,80,.06)", border:"1px solid rgba(255,0,80,.25)", padding:"10px 14px", textAlign:"center", marginBottom:10, fontFamily:"monospace" }}>
            <div style={{ fontSize:8, color:"rgba(0,255,255,.4)" }}>REWARD_UNLOCKED:</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#ff0050", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.25)" }}>CLAIM AT DESK</div>
          </div>
        )}
        <div style={{ display:"flex", gap:12, marginTop:"auto", fontFamily:"monospace" }}>
          {["[1]SCAN","[2]RATE","[3]WIN"].map((s,i)=><div key={i} style={{ fontSize:8, color:i===2?"#ff0050":"rgba(0,255,255,.5)" }}>{s}</div>)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   26. WATERCOLOR  — soft wash, floral gallery
═══════════════════════════════════════════════════ */
function PosterWatercolor({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#fefcfa", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* watercolor washes */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 100 148" preserveAspectRatio="none">
        <defs>
          <filter id="wc"><feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="5" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/></filter>
        </defs>
        <ellipse cx="25" cy="20" rx="28" ry="22" fill="#fda4af" opacity=".35" filter="url(#wc)"/>
        <ellipse cx="78" cy="35" rx="22" ry="26" fill="#93c5fd" opacity=".3" filter="url(#wc)"/>
        <ellipse cx="15" cy="100" rx="24" ry="20" fill="#86efac" opacity=".25" filter="url(#wc)"/>
        <ellipse cx="85" cy="120" rx="20" ry="22" fill="#fbbf24" opacity=".25" filter="url(#wc)"/>
        <ellipse cx="50" cy="75" rx="18" ry="15" fill="#c4b5fd" opacity=".2" filter="url(#wc)"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"22px 20px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"4px", color:"#d4919c", marginBottom:6 }}>🎨 REVIEW</div>
        <div style={{ fontSize:21, fontWeight:900, color:"#4a3728", textAlign:"center", lineHeight:1.2, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:9, color:"#9b7e6e", marginBottom:14 }}>ご来店ありがとうございます</div>
        <Stars5 c="#f9a8d4"/>
        <div style={{ fontSize:10, color:"#5c4033", margin:"10px 0 14px", textAlign:"center" }}>本日のご感想をお聞かせください</div>
        <div style={{ background:"rgba(255,255,255,.8)", backdropFilter:"blur(4px)", border:"2px solid rgba(249,168,212,.4)", borderRadius:20, padding:"12px 12px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, marginBottom:12, boxShadow:"0 4px 20px rgba(249,168,212,.15)" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#4a3728"/>}
          <div style={{ fontSize:8, color:"#d4919c", letterSpacing:"2px" }}>📱 QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"rgba(249,168,212,.12)", border:"1.5px solid rgba(249,168,212,.35)", borderRadius:16, padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"#d4919c" }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#4a3728", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#9b7e6e" }}>スタッフにお声がけください</div>
          </div>
        )}
        <div style={{ fontSize:8, color:"#c9b0a4", marginTop:"auto" }}>またのお越しをお待ちしております</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   27. ORIENTAL  — Chinese/Asian luxury
═══════════════════════════════════════════════════ */
function PosterOriental({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#1a0505", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* red wash */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"45%", background:"linear-gradient(180deg,#7f1d1d 0%,transparent 100%)", opacity:.6 }}/>
      {/* geometric pattern top */}
      <svg style={{ position:"absolute", top:0, left:0, right:0, width:"100%", height:"30%", opacity:.15 }} viewBox="0 0 100 44" preserveAspectRatio="none">
        {Array.from({length:6},(_,i)=><rect key={i} x={i*18-2} y="0" width="14" height="44" fill="none" stroke="#d4af37" strokeWidth="0.5"/>)}
        {Array.from({length:4},(_,i)=><line key={i} x1="0" y1={i*14} x2="100" y2={i*14} stroke="#d4af37" strokeWidth="0.5"/>)}
      </svg>
      {/* gold top bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:"linear-gradient(to right,#b8860b,#ffd700,#b8860b)" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:4, background:"linear-gradient(to right,#b8860b,#ffd700,#b8860b)" }}/>
      {/* cloud motif sides */}
      <svg style={{ position:"absolute", left:0, top:"30%", width:16, height:60, opacity:.25 }} viewBox="0 0 16 60">
        <path d="M8,5 Q15,15 8,25 Q1,35 8,45 Q15,55 8,60" stroke="#d4af37" strokeWidth="1.5" fill="none"/>
      </svg>
      <svg style={{ position:"absolute", right:0, top:"30%", width:16, height:60, opacity:.25 }} viewBox="0 0 16 60">
        <path d="M8,5 Q1,15 8,25 Q15,35 8,45 Q1,55 8,60" stroke="#d4af37" strokeWidth="1.5" fill="none"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 20px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"#d4af37", marginBottom:4 }}>口コミ  REVIEW</div>
        <div style={{ width:40, height:1, background:"linear-gradient(to right,transparent,#d4af37,transparent)", marginBottom:14 }}/>
        <div style={{ fontSize:20, fontWeight:900, color:"#fff9f0", textAlign:"center", lineHeight:1.2, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:8, color:"rgba(212,175,55,.5)", letterSpacing:"3px", marginBottom:14 }}>ご来店ありがとうございます</div>
        <Stars5 c="#d4af37"/>
        <div style={{ fontSize:9, color:"rgba(255,249,240,.55)", margin:"10px 0 14px", textAlign:"center" }}>本日のご感想をお聞かせください</div>
        <div style={{ border:"1px solid rgba(212,175,55,.5)", background:"rgba(212,175,55,.05)", padding:10, marginBottom:10, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <div style={{ background:"#fff9f0", padding:8 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#1a0505"/>}
          </div>
          <div style={{ fontSize:8, color:"rgba(212,175,55,.6)", letterSpacing:"2px" }}>QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", border:"1px solid rgba(212,175,55,.3)", background:"rgba(127,29,29,.2)", padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"rgba(212,175,55,.5)" }}>レビューご記入で</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#d4af37", margin:"4px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"rgba(212,175,55,.35)" }}>スタッフへお申し付けください</div>
          </div>
        )}
        <div style={{ marginTop:"auto", width:40, height:1, background:"linear-gradient(to right,transparent,#d4af37,transparent)" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   28. BARBER  — high contrast B&W, barbershop
═══════════════════════════════════════════════════ */
function PosterBarber({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#fff", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* bold diagonal stripe */}
      <div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(135deg,transparent,transparent 24px,rgba(0,0,0,.04) 24px,rgba(0,0,0,.04) 25px)" }}/>
      {/* left thick bar */}
      <div style={{ position:"absolute", top:0, left:0, bottom:0, width:14, background:"#111" }}/>
      {/* red stripe on bar */}
      <div style={{ position:"absolute", top:"35%", left:0, bottom:"35%", width:14, background:"#dc2626" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", paddingLeft:24, paddingRight:16, paddingTop:18, paddingBottom:12 }}>
        <div style={{ fontSize:7, letterSpacing:"7px", color:"#555", marginBottom:6 }}>BARBER · REVIEW</div>
        <div style={{ fontSize:24, fontWeight:900, color:"#111", lineHeight:.9, letterSpacing:"-1px", marginBottom:8 }}>{storeName}</div>
        <div style={{ width:24, height:3, background:"#111", marginBottom:14 }}/>
        <div style={{ fontSize:10, color:"#444", marginBottom:8, textAlign:"left" }}>本日の仕上がりはいかがでしたか？</div>
        <Stars5 c="#111"/>
        <div style={{ margin:"14px 0 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <div style={{ border:"4px solid #111", padding:8 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={108} level="M" fgColor="#111"/>}
          </div>
          <div style={{ fontSize:8, letterSpacing:"3px", color:"#888" }}>QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"#111", padding:"10px 14px", textAlign:"center", marginTop:4, marginBottom:10 }}>
            <div style={{ fontSize:8, color:"#555", marginBottom:2 }}>ご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#444", marginTop:2 }}>スタッフへ</div>
          </div>
        )}
        <div style={{ marginTop:"auto", display:"flex", gap:14 }}>
          {["SCAN","RATE","DONE"].map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:15, height:15, borderRadius:"50%", background:i===0?"#dc2626":"#111", display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, fontWeight:900, color:"#fff" }}>{i+1}</div>
              <span style={{ fontSize:8, color:"#888" }}>{s}</span>
              {i<2&&<span style={{ color:"#ddd" }}>›</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   29. WAVE  — soundwave, music/karaoke
═══════════════════════════════════════════════════ */
function PosterWave({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#0c0920", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* soundwave bars */}
      <svg style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", left:0, right:0, width:"100%", height:"50%", opacity:.12 }} viewBox="0 0 100 50" preserveAspectRatio="none">
        {[3,5,8,12,18,22,18,12,8,14,20,24,20,14,8,12,18,14,8,5,3,6,10,16,20,22,16,10,6,4,8,12,18,22,18,14,8,12,16,10,6,4,8,14,20,24,18,10,6,3].map((h,i)=>(
          <rect key={i} x={i*2} y={(50-h)/2} width="1.5" height={h} fill="#818cf8" rx="0.5"/>
        ))}
      </svg>
      {/* gradient accent */}
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:"80%", height:"40%", background:"radial-gradient(circle,rgba(129,140,248,.2) 0%,transparent 70%)", filter:"blur(20px)" }}/>
      {/* top/bottom wave */}
      <svg style={{ position:"absolute", top:0, left:0, right:0, width:"100%", opacity:.3 }} viewBox="0 0 100 8" preserveAspectRatio="none" height="20">
        <path d="M0,4 Q12,0 25,4 Q37,8 50,4 Q62,0 75,4 Q87,8 100,4" fill="none" stroke="#6366f1" strokeWidth="1.5"/>
      </svg>
      <svg style={{ position:"absolute", bottom:0, left:0, right:0, width:"100%", opacity:.3 }} viewBox="0 0 100 8" preserveAspectRatio="none" height="20">
        <path d="M0,4 Q12,8 25,4 Q37,0 50,4 Q62,8 75,4 Q87,0 100,4" fill="none" stroke="#6366f1" strokeWidth="1.5"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"22px 18px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"#818cf8", marginBottom:6 }}>🎵 REVIEW</div>
        <div style={{ fontSize:21, fontWeight:900, color:"#fff", textAlign:"center", lineHeight:1.15, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:9, color:"rgba(129,140,248,.55)", marginBottom:14 }}>ご来店ありがとうございます</div>
        <Stars5 c="#818cf8"/>
        <div style={{ fontSize:10, color:"rgba(255,255,255,.5)", margin:"10px 0 14px", textAlign:"center" }}>本日のご感想をお聞かせください</div>
        <div style={{ border:"1px solid rgba(99,102,241,.5)", background:"rgba(99,102,241,.08)", padding:10, marginBottom:10, borderRadius:8, display:"flex", flexDirection:"column", alignItems:"center", gap:6, boxShadow:"0 0 20px rgba(99,102,241,.2)" }}>
          <div style={{ background:"#1c1a3a", padding:8, borderRadius:6 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={110} level="M" fgColor="#e0e7ff" bgColor="#1c1a3a"/>}
          </div>
          <div style={{ fontSize:8, color:"rgba(129,140,248,.65)", letterSpacing:"2px" }}>📱 QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"rgba(99,102,241,.12)", border:"1px solid rgba(99,102,241,.3)", borderRadius:10, padding:"10px 14px", textAlign:"center", marginBottom:10 }}>
            <div style={{ fontSize:9, color:"rgba(129,140,248,.55)" }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#818cf8", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"rgba(129,140,248,.4)" }}>スタッフにお声がけください</div>
          </div>
        )}
        <div style={{ display:"flex", gap:14, marginTop:"auto" }}>
          {["スキャン","評価","完了"].map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:16, height:16, borderRadius:"50%", background:"rgba(99,102,241,.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff" }}>{i+1}</div>
              <span style={{ fontSize:9, color:"rgba(129,140,248,.5)" }}>{s}</span>
              {i<2&&<span style={{ color:"rgba(99,102,241,.3)" }}>›</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   30. KIDS  — children, playful illustration
═══════════════════════════════════════════════════ */
function PosterKids({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(160deg,#fffbeb 0%,#fef9c3 50%,#fefce8 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* sun */}
      <div style={{ position:"absolute", top:"-5%", right:"-5%", width:"35%", paddingTop:"35%", borderRadius:"50%", background:"radial-gradient(circle,#fbbf24 40%,rgba(251,191,36,.3) 70%,transparent 100%)" }}/>
      {/* cloud shapes */}
      {[["-5%","30%",60,30],["75%","10%",50,25]].map(([l,t,w,h],i)=>(
        <div key={i} style={{ position:"absolute", top:t as string, left:l as string, width:w, height:h, background:"rgba(255,255,255,.7)", borderRadius:30 }}/>
      ))}
      {/* stars scattered */}
      {[["15%","8%","★"],["40%","4%","✦"],["65%","10%","★"],["85%","5%","✦"]].map(([l,t,s],i)=>(
        <div key={i} style={{ position:"absolute", top:t as string, left:l as string, fontSize:14, color:"#fbbf24", opacity:.5 }}>{s}</div>
      ))}
      {/* ground strip */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"12%", background:"#bbf7d0", borderRadius:"50% 50% 0 0 / 20% 20% 0 0" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 18px 16px" }}>
        <div style={{ fontSize:10, fontWeight:700, color:"#d97706", marginBottom:6 }}>😊 みなさまのこえ 😊</div>
        <div style={{ fontSize:20, fontWeight:900, color:"#92400e", textAlign:"center", lineHeight:1.2, marginBottom:4 }}>{storeName}</div>
        <div style={{ fontSize:9, color:"#b45309", marginBottom:12 }}>きてくれてありがとう！</div>
        <div style={{ display:"flex", gap:3 }}>
          {["#fbbf24","#f87171","#34d399","#60a5fa","#a78bfa"].map((c,i)=>(
            <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ))}
        </div>
        <div style={{ fontSize:10, fontWeight:600, color:"#78350f", margin:"10px 0 12px", textAlign:"center" }}>きょうはどうだったかな？</div>
        <div style={{ background:"#fff", border:"3px solid #fbbf24", borderRadius:20, padding:"12px 12px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, marginBottom:12, boxShadow:"0 4px 12px rgba(251,191,36,.2)" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={108} level="M" fgColor="#78350f"/>}
          <div style={{ fontSize:8, color:"#b45309", fontWeight:700 }}>📱 スキャンしてね！</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", background:"linear-gradient(135deg,rgba(251,191,36,.2),rgba(52,211,153,.2))", border:"2px solid #fbbf24", borderRadius:16, padding:"10px 14px", textAlign:"center", marginBottom:8 }}>
            <div style={{ fontSize:9, color:"#92400e", fontWeight:600 }}>かいてくれたら</div>
            <div style={{ fontSize:13, fontWeight:900, color:"#78350f", margin:"3px 0" }}>🎁 {incentive}</div>
            <div style={{ fontSize:8, color:"#b45309" }}>スタッフにはなしかけてね</div>
          </div>
        )}
        <div style={{ fontSize:8, color:"#d97706", marginTop:"auto", fontWeight:600 }}>またあそびにきてね！🌟</div>
      </div>
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
  const [previewPx, setPreviewPx] = useState(288);
  const posterRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // コンテナ幅を監視してscaleを計算
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      setPreviewPx(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const displayIncentive = incentive === "特典なし" ? "" : (customIncentive || incentive);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://review-guard-demo.vercel.app";
  const reviewUrl = selectedStore ? `${appUrl}/review/${selectedStore.id}` : "";
  const template = TEMPLATES.find(t => t.id === templateId) ?? TEMPLATES[0];
  const PosterComponent = template.Component;
  const size = SIZES.find(s => s.id === sizeId) ?? SIZES[1];

  // 縦横に応じてmm寸法・アスペクト比・maxWを決定
  const mmW = orientation === "portrait" ? size.pw : size.ph;
  const mmH = orientation === "portrait" ? size.ph : size.pw;
  const maxW = orientation === "portrait" ? size.pmaxW : size.lmaxW;
  const aspectRatio = `${mmW}/${mmH}`;

  // 縦: portrait高さ / 横: landscape専用レイアウトなのでlandscape高さそのまま使用
  const canonicalH = orientation === "portrait"
    ? CANONICAL_W * (size.ph / size.pw)  // portrait: 縦長canvas
    : CANONICAL_W * (mmH / mmW);          // landscape: 横長canvas (専用レイアウト)
  const posterScale = previewPx / CANONICAL_W;
  const offsetX = 0;
  const offsetY = 0;

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

          {/* ポスタープレビュー：常にportrait寸法でレンダリングし、縦横両方に収まるようscale+センタリング */}
          <div ref={previewRef} className={`mx-auto ${maxW}`}>
            <div
              className="border border-gray-200 rounded-xl overflow-hidden shadow-lg"
              style={{ aspectRatio, position: "relative" }}
            >
              <div ref={posterRef} style={{
                position: "absolute",
                top: offsetY,
                left: offsetX,
                width: CANONICAL_W,
                height: canonicalH,
                transformOrigin: "top left",
                transform: `scale(${posterScale})`,
              }}>
                {selectedStore && reviewUrl ? (
                  orientation === "portrait"
                    ? <PosterComponent storeName={selectedStore.name} incentive={displayIncentive} reviewUrl={reviewUrl}/>
                    : <LandscapePoster storeName={selectedStore.name} incentive={displayIncentive} reviewUrl={reviewUrl} theme={template.theme as LT}/>
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", color: "#9ca3af", fontSize: 14 }}>
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
