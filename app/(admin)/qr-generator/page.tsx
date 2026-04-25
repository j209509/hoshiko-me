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
   1. AURORA  — deep cosmos, store name as glowing anchor
═══════════════════════════════════════════════════ */
function PosterAurora({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(160deg,#030010 0%,#0d0030 30%,#1a0050 60%,#2d0070 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      <div style={{ position:"absolute", top:"-15%", left:"-20%", width:"80%", height:"70%", borderRadius:"50%", background:"radial-gradient(ellipse,rgba(139,92,246,.6) 0%,transparent 65%)", filter:"blur(40px)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-20%", right:"-15%", width:"75%", height:"65%", borderRadius:"50%", background:"radial-gradient(ellipse,rgba(236,72,153,.5) 0%,transparent 65%)", filter:"blur(45px)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"35%", left:"30%", width:"50%", height:"45%", borderRadius:"50%", background:"radial-gradient(ellipse,rgba(79,70,229,.45) 0%,transparent 65%)", filter:"blur(30px)", pointerEvents:"none" }}/>
      {[["8%","12%"],["22%","5%"],["45%","8%"],["70%","14%"],["88%","6%"],["15%","88%"],["55%","92%"],["80%","85%"],["5%","55%"],["92%","45%"]].map(([l,t],i)=>(
        <div key={i} style={{ position:"absolute", left:l, top:t, width:2, height:2, borderRadius:"50%", background:"rgba(255,255,255,0.6)", pointerEvents:"none" }}/>
      ))}
      <div style={{ position:"relative", zIndex:1, paddingTop:22, paddingLeft:20, paddingRight:20 }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"rgba(196,181,253,.6)", textTransform:"uppercase" as React.CSSProperties["textTransform"] }}>✦  G O O G L E  R E V I E W  ✦</div>
      </div>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 20px" }}>
        <div style={{ fontSize:38, fontWeight:900, color:"#fff", textAlign:"center", lineHeight:1.05, letterSpacing:"-1px", textShadow:"0 0 40px rgba(167,139,250,.9), 0 0 80px rgba(167,139,250,.4)", marginBottom:10 }}>{storeName}</div>
        <Stars5 c="#c4b5fd"/>
        <div style={{ fontSize:10, color:"rgba(221,214,254,.65)", marginTop:10, textAlign:"center" }}>本日のご感想をお聞かせください</div>
      </div>
      <div style={{ position:"relative", zIndex:1, padding:"0 20px 20px" }}>
        <div style={{ background:"rgba(255,255,255,.08)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,.18)", borderRadius:24, padding:"16px 16px 12px", display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ background:"#fff", borderRadius:14, padding:8, flexShrink:0 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={120} level="M" fgColor="#0d0030"/>}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:9, color:"rgba(196,181,253,.55)", letterSpacing:"3px", marginBottom:6 }}>SCAN TO REVIEW</div>
            {incentive && (
              <div style={{ background:"rgba(139,92,246,.25)", border:"1px solid rgba(139,92,246,.4)", borderRadius:10, padding:"7px 10px" }}>
                <div style={{ fontSize:8, color:"rgba(196,181,253,.7)", marginBottom:2 }}>レビューご記入で</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#e9d5ff" }}>{incentive}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   2. HINOMARU  — Japanese modern, asymmetric layout
═══════════════════════════════════════════════════ */
function PosterHinomaru({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#faf8f0", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      <div style={{ position:"absolute", top:"5%", left:"50%", transform:"translateX(-50%)", width:"90%", paddingTop:"90%", borderRadius:"50%", background:"#C0392B", opacity:.06, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:0, left:0, bottom:0, width:6, background:"#C0392B" }}/>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"#C0392B" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", paddingLeft:20, paddingRight:18, paddingTop:24, paddingBottom:18 }}>
        <div style={{ fontSize:8, letterSpacing:"7px", color:"rgba(192,57,43,.55)", marginBottom:18 }}>口 コ ミ  ・  REVIEW</div>
        <div style={{ fontSize:42, fontWeight:900, color:"#1a0400", lineHeight:.92, letterSpacing:"-2px", marginBottom:16 }}>{storeName}</div>
        <div style={{ width:40, height:3, background:"#C0392B", marginBottom:16 }}/>
        <div style={{ fontSize:10, color:"#5c3317", marginBottom:12 }}>本日のご感想をお聞かせください</div>
        <Stars5 c="#C0392B"/>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end", justifyContent:"flex-end", paddingBottom:4 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {incentive && (
              <div style={{ border:"1px solid #C0392B", padding:"8px 12px", textAlign:"center" as React.CSSProperties["textAlign"], maxWidth:140 }}>
                <div style={{ fontSize:8, color:"rgba(192,57,43,.6)", marginBottom:2 }}>レビューご記入で</div>
                <div style={{ fontSize:11, fontWeight:700, color:"#C0392B" }}>{incentive}</div>
              </div>
            )}
            <div style={{ border:"3px solid #1a0400", padding:8, background:"#fff" }}>
              {reviewUrl && <QRCode value={reviewUrl} size={128} level="M" fgColor="#1a0400"/>}
            </div>
            <div style={{ fontSize:8, letterSpacing:"3px", color:"rgba(192,57,43,.7)" }}>QRをスキャン</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   3. VICE  — neon sign aesthetic, pure black
═══════════════════════════════════════════════════ */
function PosterVice({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#000", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      <div style={{ position:"absolute", top:"20%", left:"-20%", width:"80%", height:"60%", background:"radial-gradient(ellipse,rgba(255,0,180,.3) 0%,transparent 65%)", filter:"blur(35px)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"20%", right:"-20%", width:"80%", height:"60%", background:"radial-gradient(ellipse,rgba(0,230,255,.25) 0%,transparent 65%)", filter:"blur(35px)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,rgba(255,255,255,.012) 0px,transparent 1px,transparent 3px)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:10, border:"1px solid rgba(255,0,204,.3)", boxShadow:"inset 0 0 30px rgba(255,0,204,.05)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1, paddingTop:28, paddingLeft:20, paddingRight:20, display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ fontSize:9, letterSpacing:"6px", background:"linear-gradient(90deg,#ff00cc,#00e5ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>NEON  REVIEW</div>
        <div style={{ width:"80%", height:1, background:"linear-gradient(to right,transparent,rgba(255,0,204,.5),rgba(0,229,255,.5),transparent)", marginTop:10 }}/>
      </div>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
        <div style={{ fontSize:36, fontWeight:900, textAlign:"center", lineHeight:1.05, letterSpacing:"-1px", background:"linear-gradient(180deg,#ff00cc 0%,#ff66dd 50%,#fff 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", filter:"drop-shadow(0 0 12px rgba(255,0,204,.8))" }}>{storeName}</div>
        <div style={{ marginTop:10, marginBottom:10 }}><Stars5 c="#ff00cc"/></div>
        <div style={{ fontSize:9, color:"rgba(0,229,255,.65)", letterSpacing:"2px" }}>本日のご感想をお聞かせください</div>
      </div>
      <div style={{ position:"relative", zIndex:1, padding:"0 20px 22px" }}>
        <div style={{ border:"2px solid rgba(0,229,255,.6)", boxShadow:"0 0 20px rgba(0,229,255,.2)", padding:12, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ background:"#000", border:"1px solid rgba(0,229,255,.3)", padding:6, flexShrink:0 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={120} level="M" fgColor="#00e5ff" bgColor="#000"/>}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:8, letterSpacing:"3px", background:"linear-gradient(90deg,#ff00cc,#00e5ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:8 }}>SCAN → REVIEW</div>
            {incentive && (
              <div style={{ border:"1px solid rgba(255,0,204,.35)", background:"rgba(255,0,204,.06)", padding:"7px 10px" }}>
                <div style={{ fontSize:8, color:"rgba(255,255,255,.4)", marginBottom:2 }}>レビューご記入で</div>
                <div style={{ fontSize:11, fontWeight:700, color:"#ff00cc" }}>{incentive}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   4. BAUHAUS  — Swiss International Style, extreme typography
═══════════════════════════════════════════════════ */
function PosterBauhaus({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#f8f8f8", position:"relative", overflow:"hidden", display:"flex" }}>
      {/* thick left red bar */}
      <div style={{ width:12, background:"#e11d48", flexShrink:0 }}/>
      {/* main content */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"20px 18px 18px 16px" }}>
        {/* top: extreme typography */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div style={{ fontSize:8, letterSpacing:"5px", color:"#999", marginBottom:8 }}>CUSTOMER REVIEW</div>
          <div style={{ fontSize:44, fontWeight:900, color:"#0a0a0a", lineHeight:.88, letterSpacing:"-3px", marginBottom:16 }}>{storeName}</div>
          <div style={{ width:50, height:5, background:"#e11d48", marginBottom:16 }}/>
          <div style={{ fontSize:10, color:"#444", marginBottom:12, fontWeight:300, lineHeight:1.5 }}>本日のご感想を<br/>お聞かせください</div>
          <Stars5 c="#e11d48"/>
        </div>
        {/* bottom: QR right-aligned */}
        <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"flex-end", gap:14 }}>
          {incentive && (
            <div style={{ background:"#0a0a0a", padding:"10px 12px", flex:1 }}>
              <div style={{ fontSize:8, color:"#666", marginBottom:2 }}>レビューご記入で</div>
              <div style={{ fontSize:11, fontWeight:900, color:"#fff" }}>{incentive}</div>
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <div style={{ border:"4px solid #0a0a0a", padding:6, background:"#fff" }}>
              {reviewUrl && <QRCode value={reviewUrl} size={128} level="M" fgColor="#0a0a0a"/>}
            </div>
            <div style={{ fontSize:7, letterSpacing:"3px", color:"#aaa" }}>QRコードをスキャン</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   5. DECO  — Art Deco noir, gold sunburst, center layout
═══════════════════════════════════════════════════ */
function PosterDeco({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#07060a", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      <svg style={{ position:"absolute", top:"18%", left:"50%", transform:"translateX(-50%)", width:"85%", opacity:.18 }} viewBox="0 0 200 200">
        {Array.from({length:24},(_,i)=>{
          const a=i*(360/24)*Math.PI/180;
          return <line key={i} x1={100} y1={100} x2={100+95*Math.cos(a)} y2={100+95*Math.sin(a)} stroke="#c9a84c" strokeWidth="0.8"/>;
        })}
        <circle cx="100" cy="100" r="35" fill="none" stroke="#c9a84c" strokeWidth="1.5"/>
        <circle cx="100" cy="100" r="22" fill="none" stroke="#c9a84c" strokeWidth="0.6"/>
      </svg>
      {/* corner ornaments */}
      <div style={{ position:"absolute", inset:10, border:"1px solid rgba(201,168,76,.4)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:14, border:"1px solid rgba(201,168,76,.15)", pointerEvents:"none" }}/>
      {[{top:16,left:16},{top:16,right:16},{bottom:16,left:16},{bottom:16,right:16}].map((pos,i)=>(
        <div key={i} style={{ position:"absolute", ...pos, width:10, height:10, background:"#c9a84c", transform:"rotate(45deg)", opacity:.7 }}/>
      ))}
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"26px 22px 18px" }}>
        <div style={{ fontSize:8, letterSpacing:"8px", color:"#c9a84c", marginBottom:6 }}>✦  PRESTIGE REVIEW  ✦</div>
        <div style={{ width:60, height:1, background:"linear-gradient(to right,transparent,#c9a84c,transparent)", marginBottom:20 }}/>
        <div style={{ fontSize:32, fontWeight:900, color:"#f5e6c8", textAlign:"center", lineHeight:1.1, letterSpacing:"2px", marginBottom:8 }}>{storeName}</div>
        <Stars5 c="#c9a84c"/>
        <div style={{ fontSize:9, color:"rgba(201,168,76,.6)", margin:"12px 0 18px", letterSpacing:"1px", textAlign:"center" }}>ご来店賜り誠にありがとうございます</div>
        <div style={{ border:"1px solid #c9a84c", padding:2 }}>
          <div style={{ border:"1px solid rgba(201,168,76,.3)", padding:12, background:"#0f0b07", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={128} level="M" fgColor="#f5e6c8" bgColor="#0f0b07"/>}
            <div style={{ fontSize:8, color:"rgba(201,168,76,.7)", letterSpacing:"3px" }}>QRコードをスキャン</div>
          </div>
        </div>
        {incentive && (
          <div style={{ width:"100%", marginTop:14, border:"1px solid rgba(201,168,76,.3)", background:"rgba(201,168,76,.06)", padding:"10px 14px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
            <div style={{ fontSize:9, color:"rgba(201,168,76,.55)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#c9a84c" }}>✦ {incentive} ✦</div>
          </div>
        )}
        <div style={{ marginTop:"auto", width:60, height:1, background:"linear-gradient(to right,transparent,#c9a84c,transparent)" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   6. CONSTRUCTIVIST  — Bold red, diagonal navy block
═══════════════════════════════════════════════════ */
function PosterConstructivist({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#D62828", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* diagonal navy block */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 100 148" preserveAspectRatio="none">
        <polygon points="55,0 100,0 100,148 10,148" fill="#1d2d50"/>
      </svg>
      {/* yellow circle accent */}
      <div style={{ position:"absolute", top:"-8%", left:"-8%", width:"38%", paddingTop:"38%", borderRadius:"50%", background:"#F7B731", opacity:.9 }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"22px 18px 18px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"rgba(255,255,255,.6)", marginBottom:14 }}>REVIEW</div>
        <div style={{ fontSize:40, fontWeight:900, color:"#f1faee", lineHeight:.9, letterSpacing:"-2px", marginBottom:12, textShadow:"3px 3px 0 rgba(0,0,0,.25)" }}>{storeName}</div>
        <Stars5 c="#F7B731"/>
        <div style={{ fontSize:10, color:"rgba(241,250,238,.75)", margin:"12px 0 0", lineHeight:1.5 }}>本日のご感想を<br/>お聞かせください</div>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end", justifyContent:"flex-end" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {incentive && (
              <div style={{ background:"#f1faee", padding:"8px 12px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
                <div style={{ fontSize:8, color:"#1d2d50", marginBottom:2 }}>レビューご記入で</div>
                <div style={{ fontSize:11, fontWeight:900, color:"#D62828" }}>{incentive}</div>
              </div>
            )}
            <div style={{ background:"#f1faee", padding:10 }}>
              {reviewUrl && <QRCode value={reviewUrl} size={128} level="M" fgColor="#1d2d50"/>}
            </div>
            <div style={{ fontSize:8, color:"rgba(241,250,238,.65)", letterSpacing:"2px" }}>QRコードをスキャン</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   7. WABI  — wabi-sabi, brushstroke circle, minimal
═══════════════════════════════════════════════════ */
function PosterWabi({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#f5ede0", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* brushstroke circle */}
      <svg style={{ position:"absolute", top:"12%", left:"50%", transform:"translateX(-50%)", width:"75%", opacity:.15 }} viewBox="0 0 200 200">
        <path d="M100,15 C150,15 185,50 185,100 C185,150 150,185 100,185 C50,185 15,150 15,100 C15,50 50,15 100,15" fill="none" stroke="#4a3728" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 4"/>
      </svg>
      {/* minimal top rule */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"#4a3728", opacity:.35 }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"#4a3728", opacity:.35 }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 24px 22px" }}>
        <div style={{ fontSize:7, letterSpacing:"8px", color:"rgba(74,55,40,.5)", marginBottom:24 }}>わ び さ び</div>
        <div style={{ fontSize:34, fontWeight:300, color:"#2d1f14", textAlign:"center", lineHeight:1.15, letterSpacing:"6px", marginBottom:20 }}>{storeName}</div>
        <div style={{ width:24, height:1, background:"#c4956a", marginBottom:20 }}/>
        <Stars5 c="#c4956a"/>
        <div style={{ fontSize:10, fontWeight:300, color:"#6b5040", margin:"16px 0 24px", textAlign:"center", letterSpacing:"1px", lineHeight:1.7 }}>本日のご感想を<br/>お聞かせください</div>
        {/* and QR in fine and frame */}
        <div style={{ border:"1px solid rgba(196,149,106,.5)", padding:2, background:"#fffcf5" }}>
          <div style={{ border:"1px solid rgba(196,149,106,.2)", padding:10 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={130} level="M" fgColor="#2d1f14"/>}
          </div>
        </div>
        <div style={{ fontSize:8, letterSpacing:"4px", color:"rgba(196,149,106,.7)", marginTop:10 }}>QRをスキャン</div>
        {incentive && (
          <div style={{ marginTop:14, width:"100%", border:"1px dashed rgba(196,149,106,.5)", padding:"10px 14px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
            <div style={{ fontSize:8, color:"rgba(107,80,64,.6)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#2d1f14" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   8. HUD  — holographic terminal, corner brackets
═══════════════════════════════════════════════════ */
function PosterHUD({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#020b14", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* scanlines */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,rgba(0,229,255,.03) 0px,transparent 1px,transparent 3px)", pointerEvents:"none" }}/>
      {/* glow */}
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:"70%", height:"60%", background:"radial-gradient(circle,rgba(0,229,255,.12) 0%,transparent 70%)", filter:"blur(20px)", pointerEvents:"none" }}/>
      {/* corner brackets */}
      <div style={{ position:"absolute", top:14, left:14, width:20, height:20, borderTop:"2px solid #00e5ff", borderLeft:"2px solid #00e5ff" }}/>
      <div style={{ position:"absolute", top:14, right:14, width:20, height:20, borderTop:"2px solid #00e5ff", borderRight:"2px solid #00e5ff" }}/>
      <div style={{ position:"absolute", bottom:14, left:14, width:20, height:20, borderBottom:"2px solid #00e5ff", borderLeft:"2px solid #00e5ff" }}/>
      <div style={{ position:"absolute", bottom:14, right:14, width:20, height:20, borderBottom:"2px solid #00e5ff", borderRight:"2px solid #00e5ff" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"28px 24px 22px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"#00e5ff", fontFamily:"monospace", marginBottom:8 }}>[ REVIEW.SYS ]</div>
        <div style={{ width:"100%", height:1, background:"linear-gradient(to right,#00e5ff,transparent)", marginBottom:16, opacity:.5 }}/>
        <div style={{ fontSize:32, fontWeight:900, color:"#e0f8ff", lineHeight:1.0, textShadow:"0 0 24px rgba(0,229,255,.7)", marginBottom:6 }}>{storeName}</div>
        <div style={{ fontSize:8, color:"rgba(0,229,255,.5)", fontFamily:"monospace", marginBottom:16 }}>&gt;&gt; THANK_YOU_FOR_VISITING</div>
        <Stars5 c="#00e5ff"/>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingTop:14 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            <div style={{ border:"1px solid #00e5ff", background:"rgba(0,229,255,.05)", padding:10, boxShadow:"0 0 20px rgba(0,229,255,.15)" }}>
              <div style={{ background:"#e0f8ff", padding:6 }}>
                {reviewUrl && <QRCode value={reviewUrl} size={130} level="M" fgColor="#020b14"/>}
              </div>
            </div>
            <div style={{ fontSize:8, letterSpacing:"3px", color:"rgba(0,229,255,.7)", fontFamily:"monospace" }}>SCAN TO EXECUTE</div>
          </div>
        </div>
        {incentive && (
          <div style={{ border:"1px solid rgba(0,229,255,.25)", background:"rgba(0,229,255,.04)", padding:"10px 14px", fontFamily:"monospace", marginTop:10 }}>
            <div style={{ fontSize:8, color:"rgba(0,229,255,.5)", marginBottom:2 }}>REWARD_ON_COMPLETE:</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#00e5ff" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   9. COUTURE  — vertical split, editorial fashion
═══════════════════════════════════════════════════ */
function PosterCouture({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", overflow:"hidden", display:"flex" }}>
      {/* left dark panel */}
      <div style={{ width:"45%", background:"#141010", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"18px 12px", position:"relative" }}>
        {/* vertical rotated store name */}
        <div style={{ writingMode:"vertical-rl" as React.CSSProperties["writingMode"], textOrientation:"mixed" as React.CSSProperties["textOrientation"], transform:"rotate(180deg)", fontSize:22, fontWeight:900, color:"#faf5ec", letterSpacing:4, lineHeight:1, textAlign:"center" as React.CSSProperties["textAlign"] }}>{storeName}</div>
        <div style={{ marginTop:12, writingMode:"vertical-rl" as React.CSSProperties["writingMode"], transform:"rotate(180deg)", fontSize:7, color:"rgba(255,255,255,.3)", letterSpacing:4 }}>REVIEW</div>
      </div>
      {/* gold divider */}
      <div style={{ width:2, background:"linear-gradient(to bottom,transparent,#b8860b,#b8860b,transparent)", flexShrink:0 }}/>
      {/* right cream panel */}
      <div style={{ flex:1, background:"#faf5ec", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"18px 14px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"4px", color:"#b8860b", marginBottom:14 }}>✦ AVIS ✦</div>
        <Stars5 c="#b8860b"/>
        <div style={{ fontSize:9, color:"#4a3728", margin:"12px 0 16px", textAlign:"center" as React.CSSProperties["textAlign"], lineHeight:1.6 }}>ご感想を<br/>お聞かせください</div>
        <div style={{ border:"2px solid #141010", padding:8 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={120} level="M" fgColor="#141010"/>}
        </div>
        <div style={{ fontSize:7, color:"rgba(0,0,0,.35)", letterSpacing:"3px", marginTop:8 }}>SCAN ME</div>
        {incentive && (
          <div style={{ width:"100%", background:"#141010", padding:"8px 10px", textAlign:"center" as React.CSSProperties["textAlign"], marginTop:14 }}>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.4)", marginBottom:2 }}>ご記入で</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#faf5ec" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   10. RIOT  — brutalist B&W, top 1/3 black
═══════════════════════════════════════════════════ */
function PosterRiot({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#fff", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* top black block */}
      <div style={{ background:"#111", padding:"22px 20px 18px", flexShrink:0 }}>
        <div style={{ fontSize:8, letterSpacing:"7px", color:"rgba(255,255,255,.35)", marginBottom:8 }}>YOUR VOICE MATTERS</div>
        <div style={{ fontSize:44, fontWeight:900, color:"#fff", lineHeight:.88, letterSpacing:"-2px" }}>{storeName}</div>
        <div style={{ width:32, height:4, background:"#fff", marginTop:12 }}/>
      </div>
      {/* white content block */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 20px 16px" }}>
        <Stars5 c="#111"/>
        <div style={{ fontSize:10, color:"#444", margin:"12px 0 16px", textAlign:"center" as React.CSSProperties["textAlign"] }}>本日のご感想をお聞かせください</div>
        <div style={{ border:"4px solid #111", padding:10 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={130} level="M" fgColor="#111"/>}
        </div>
        <div style={{ fontSize:8, letterSpacing:"4px", color:"#bbb", marginTop:10 }}>QRコードをスキャン</div>
        {incentive && (
          <div style={{ width:"100%", marginTop:"auto", background:"#111", padding:"12px 18px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.45)", marginBottom:3 }}>レビューご記入で</div>
            <div style={{ fontSize:14, fontWeight:900, color:"#fff" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   11. CLINIC  — medical precision, grid layout
═══════════════════════════════════════════════════ */
function PosterClinic({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#fff", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* top blue banner with cross */}
      <div style={{ background:"linear-gradient(90deg,#0369a1,#0ea5e9)", padding:"16px 18px 14px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ position:"relative", width:28, height:28, flexShrink:0 }}>
          <div style={{ position:"absolute", top:"50%", left:0, right:0, height:9, background:"rgba(255,255,255,.9)", transform:"translateY(-50%)", borderRadius:2 }}/>
          <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:9, background:"rgba(255,255,255,.9)", transform:"translateX(-50%)", borderRadius:2 }}/>
        </div>
        <div>
          <div style={{ fontSize:7, color:"rgba(255,255,255,.65)", letterSpacing:"4px" }}>REVIEW</div>
          <div style={{ fontSize:28, fontWeight:900, color:"#fff", lineHeight:1.0 }}>{storeName}</div>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"18px 18px 14px" }}>
        <div style={{ fontSize:10, fontWeight:700, color:"#0369a1", marginBottom:12, textAlign:"center" as React.CSSProperties["textAlign"] }}>本日の対応はいかがでしたか？</div>
        <Stars5 c="#0ea5e9"/>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"14px 0" }}>
          <div style={{ background:"#f0f9ff", border:"2px solid #bae6fd", borderRadius:16, padding:"14px 14px 10px", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {reviewUrl && <QRCode value={reviewUrl} size={130} level="M" fgColor="#0369a1"/>}
            <div style={{ fontSize:8, color:"#0ea5e9", letterSpacing:"2px" }}>QRコードをスキャン</div>
          </div>
        </div>
        {incentive && (
          <div style={{ border:"1px solid #bae6fd", background:"#f0f9ff", borderRadius:10, padding:"10px 14px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
            <div style={{ fontSize:9, color:"#0ea5e9", marginBottom:2 }}>アンケートご回答で</div>
            <div style={{ fontSize:14, fontWeight:700, color:"#0369a1" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   12. ZEN  — wellness, concentric circles, round QR
═══════════════════════════════════════════════════ */
function PosterZen({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(160deg,#f0fdf4 0%,#dcfce7 50%,#bbf7d0 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* concentric circles */}
      <svg style={{ position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)", width:"130%", opacity:.1 }} viewBox="0 0 200 200">
        {[95,78,61,44,27].map((r,i)=><circle key={i} cx="100" cy="100" r={r} fill="none" stroke="#059669" strokeWidth="1"/>)}
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"26px 20px 20px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"#059669", marginBottom:6 }}>WELLNESS</div>
        <div style={{ width:24, height:1, background:"#a7f3d0", marginBottom:18 }}/>
        <div style={{ fontSize:32, fontWeight:900, color:"#064e3b", textAlign:"center", lineHeight:1.1, marginBottom:6 }}>{storeName}</div>
        <div style={{ fontSize:9, fontWeight:300, color:"#10b981", marginBottom:18, letterSpacing:"2px" }}>ご来院ありがとうございます</div>
        <Stars5 c="#34d399"/>
        <div style={{ fontSize:10, color:"#065f46", margin:"14px 0 16px", textAlign:"center", lineHeight:1.6 }}>本日の施術は<br/>いかがでしたか？</div>
        {/* round QR frame */}
        <div style={{ background:"rgba(255,255,255,.8)", backdropFilter:"blur(8px)", border:"2px solid #a7f3d0", borderRadius:24, padding:"14px 14px 10px", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={130} level="M" fgColor="#064e3b"/>}
          <div style={{ fontSize:8, color:"#10b981", letterSpacing:"2px" }}>QRをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", marginTop:14, background:"rgba(52,211,153,.15)", border:"1.5px solid #a7f3d0", borderRadius:12, padding:"10px 14px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
            <div style={{ fontSize:9, color:"#059669", marginBottom:2 }}>ご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#064e3b" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   13. STUDIO  — top half black / bottom half white
═══════════════════════════════════════════════════ */
function PosterStudio({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* top: black with QR */}
      <div style={{ background:"#111", flex:"0 0 55%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"18px 18px 14px" }}>
        <div style={{ fontSize:7, letterSpacing:"7px", color:"rgba(255,255,255,.35)", marginBottom:12 }}>HAIR & BEAUTY SALON</div>
        <div style={{ border:"2px solid rgba(255,255,255,.6)", padding:8, background:"rgba(255,255,255,.05)" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={128} level="M" fgColor="#fff" bgColor="#111"/>}
        </div>
        <div style={{ fontSize:8, letterSpacing:"3px", color:"rgba(255,255,255,.5)", marginTop:10 }}>SCAN TO REVIEW</div>
      </div>
      {/* gold divider */}
      <div style={{ height:3, background:"linear-gradient(to right,transparent,#c9a84c,transparent)", flexShrink:0 }}/>
      {/* bottom: white with store name */}
      <div style={{ background:"#fff", flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"16px 20px 14px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"#aaa", marginBottom:8 }}>REVIEW</div>
        <div style={{ fontSize:36, fontWeight:900, color:"#111", lineHeight:.9, letterSpacing:"-2px", marginBottom:12 }}>{storeName}</div>
        <Stars5 c="#111"/>
        {incentive && (
          <div style={{ marginTop:14, border:"2px solid #111", padding:"8px 14px" }}>
            <div style={{ fontSize:8, color:"#888", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#111" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   14. MARBLE  — marble veins SVG, gold double frame
═══════════════════════════════════════════════════ */
function PosterMarble({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#faf6f0", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.25 }} viewBox="0 0 100 148" preserveAspectRatio="none">
        <path d="M20,0 Q35,30 15,60 Q5,90 25,148" stroke="#c4a882" strokeWidth="3" fill="none"/>
        <path d="M60,0 Q75,40 55,80 Q45,110 70,148" stroke="#d4b896" strokeWidth="2" fill="none"/>
        <path d="M88,12 Q95,55 78,95 Q68,125 88,148" stroke="#c4a882" strokeWidth="1.2" fill="none"/>
        <path d="M0,38 Q30,45 50,33 Q70,22 100,28" stroke="#d4b896" strokeWidth="0.9" fill="none"/>
        <path d="M0,102 Q22,96 42,112 Q62,124 100,106" stroke="#c4a882" strokeWidth="0.9" fill="none"/>
        <path d="M10,65 Q35,58 55,70 Q75,82 100,72" stroke="#c4a882" strokeWidth="0.6" fill="none"/>
      </svg>
      {/* double gold frame */}
      <div style={{ position:"absolute", inset:10, border:"1.5px solid rgba(201,168,76,.5)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:14, border:"1px solid rgba(201,168,76,.2)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 22px 18px" }}>
        <div style={{ fontSize:8, letterSpacing:"7px", color:"#c9a84c", marginBottom:6 }}>S  P  A</div>
        <div style={{ width:40, height:1, background:"linear-gradient(to right,transparent,#c9a84c,transparent)", marginBottom:18 }}/>
        <div style={{ fontSize:34, fontWeight:900, color:"#3d2b1f", textAlign:"center", lineHeight:1.05, marginBottom:8 }}>{storeName}</div>
        <Stars5 c="#c9a84c"/>
        <div style={{ fontSize:9, color:"#8a6040", margin:"12px 0 16px", textAlign:"center", lineHeight:1.6 }}>癒しのひとときを<br/>ご提供できましたか</div>
        <div style={{ background:"rgba(255,255,255,.85)", border:"1.5px solid #dfc090", padding:"12px 12px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          {reviewUrl && <QRCode value={reviewUrl} size={130} level="M" fgColor="#3d2b1f"/>}
          <div style={{ fontSize:8, color:"#b8966a", letterSpacing:"2px" }}>QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", marginTop:14, border:"1px solid #dfc090", background:"rgba(201,168,76,.06)", padding:"10px 14px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
            <div style={{ fontSize:9, color:"#b8966a", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#3d2b1f" }}>{incentive}</div>
          </div>
        )}
        <div style={{ marginTop:"auto", width:40, height:1, background:"linear-gradient(to right,transparent,#c9a84c,transparent)" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   15. RUSH  — sports, dynamic diagonal orange band
═══════════════════════════════════════════════════ */
function PosterRush({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#0c0c0c", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* diagonal orange band */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 100 148" preserveAspectRatio="none">
        <polygon points="0,38 100,8 100,52 0,82" fill="#f97316" opacity=".9"/>
        <polygon points="0,38 100,8 100,44 0,68" fill="#ef4444" opacity=".6"/>
      </svg>
      {/* halftone dots */}
      <svg style={{ position:"absolute", right:0, bottom:"10%", width:"40%", height:"40%", opacity:.07 }} viewBox="0 0 80 80">
        {Array.from({length:5},(_,row)=>Array.from({length:5},(_,col)=>(
          <circle key={row*5+col} cx={col*16+8} cy={row*16+8} r="5" fill="#f97316"/>
        ))).flat()}
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"20px 18px 18px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"rgba(249,115,22,.8)", marginBottom:10 }}>GYM REVIEW</div>
        <div style={{ fontSize:38, fontWeight:900, color:"#fff", lineHeight:.9, letterSpacing:"-2px", textShadow:"0 0 30px rgba(249,115,22,.5)", marginBottom:8 }}>{storeName}</div>
        <div style={{ width:36, height:4, background:"linear-gradient(to right,#ef4444,#f97316)", marginBottom:16 }}/>
        <Stars5 c="#f97316"/>
        <div style={{ fontSize:10, color:"rgba(255,255,255,.55)", marginTop:12, lineHeight:1.5 }}>本日のトレーニングは<br/>いかがでしたか？</div>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end", justifyContent:"flex-end" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {incentive && (
              <div style={{ background:"linear-gradient(90deg,#ef4444,#f97316)", padding:"8px 14px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
                <div style={{ fontSize:8, color:"rgba(255,255,255,.7)", marginBottom:2 }}>レビューご記入で</div>
                <div style={{ fontSize:12, fontWeight:900, color:"#fff" }}>{incentive}</div>
              </div>
            )}
            <div style={{ border:"3px solid #f97316", padding:8, background:"rgba(249,115,22,.06)", boxShadow:"0 0 24px rgba(249,115,22,.25)" }}>
              <div style={{ background:"#1a1a1a", padding:6 }}>
                {reviewUrl && <QRCode value={reviewUrl} size={128} level="M" fgColor="#f9fafb" bgColor="#1a1a1a"/>}
              </div>
            </div>
            <div style={{ fontSize:8, color:"rgba(249,115,22,.7)", letterSpacing:"2px" }}>QRをスキャン</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   16. INK  — craft paper, stamp aesthetic, zig-zag QR border
═══════════════════════════════════════════════════ */
function PosterInk({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#f0e8d4", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* double frame */}
      <div style={{ position:"absolute", inset:8, border:"3px solid #2c3e50" }}/>
      <div style={{ position:"absolute", inset:13, border:"1px solid rgba(44,62,80,.35)" }}/>
      {/* stamp background circle */}
      <div style={{ position:"absolute", top:"5%", left:"50%", transform:"translateX(-50%)", width:"72%", paddingTop:"72%", borderRadius:"50%", border:"4px solid #2c3e50", opacity:.07 }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"22px 22px 18px" }}>
        <div style={{ fontSize:7, letterSpacing:"7px", color:"rgba(44,62,80,.7)", textTransform:"uppercase" as React.CSSProperties["textTransform"], marginBottom:10 }}>〜 お客様の声 〜</div>
        <div style={{ fontSize:38, fontWeight:900, color:"#2c3e50", lineHeight:.9, letterSpacing:"-1px", marginBottom:14 }}>{storeName}</div>
        <div style={{ width:36, height:3, background:"#e67e22", marginBottom:14 }}/>
        <Stars5 c="#e67e22"/>
        <div style={{ fontSize:10, color:"#2c3e50", margin:"12px 0 0", lineHeight:1.5 }}>本日のご感想を<br/>お聞かせください</div>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end", justifyContent:"flex-end" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {incentive && (
              <div style={{ border:"2px solid #2c3e50", padding:"8px 12px", textAlign:"center" as React.CSSProperties["textAlign"], background:"rgba(44,62,80,.04)" }}>
                <div style={{ fontSize:8, color:"rgba(44,62,80,.55)", marginBottom:2 }}>ご記入で</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#2c3e50" }}>{incentive}</div>
              </div>
            )}
            {/* stamp-style QR */}
            <div style={{ border:"4px solid #2c3e50", padding:8, background:"#fffdf5" }}>
              {reviewUrl && <QRCode value={reviewUrl} size={126} level="M" fgColor="#2c3e50" bgColor="#fffdf5"/>}
            </div>
            <div style={{ fontSize:8, letterSpacing:"3px", color:"rgba(44,62,80,.6)" }}>QRコードをスキャン</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   17. HYGGE  — Scandinavian, warm minimal, generous whitespace
═══════════════════════════════════════════════════ */
function PosterHygge({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#f3ede4", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* top/bottom dark rules */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:5, background:"#2d2926" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:5, background:"#2d2926" }}/>
      {/* Scandi cross motif top-right */}
      <svg style={{ position:"absolute", top:18, right:18, width:44, height:44, opacity:.15 }} viewBox="0 0 44 44">
        <line x1="22" y1="0" x2="22" y2="44" stroke="#2d2926" strokeWidth="4"/>
        <line x1="0" y1="22" x2="44" y2="22" stroke="#2d2926" strokeWidth="4"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"28px 22px 22px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"rgba(45,41,38,.5)", marginBottom:20 }}>RECENSIONE</div>
        <div style={{ fontSize:38, fontWeight:900, color:"#2d2926", lineHeight:.9, letterSpacing:"-1px", marginBottom:16 }}>{storeName}</div>
        <div style={{ width:32, height:3, background:"#2d2926", marginBottom:16 }}/>
        <Stars5 c="#c4a882"/>
        <div style={{ fontSize:10, fontWeight:300, color:"#5c5248", margin:"14px 0 0", lineHeight:1.7 }}>本日のご体験は<br/>いかがでしたか？</div>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end", justifyContent:"center", paddingBottom:6 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {incentive && (
              <div style={{ background:"#2d2926", padding:"10px 16px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
                <div style={{ fontSize:8, color:"rgba(195,168,130,.6)", marginBottom:2 }}>レビューご記入で</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#f3ede4" }}>{incentive}</div>
              </div>
            )}
            <div style={{ border:"3px solid #2d2926", padding:8, background:"#fff" }}>
              {reviewUrl && <QRCode value={reviewUrl} size={130} level="M" fgColor="#2d2926"/>}
            </div>
            <div style={{ fontSize:8, letterSpacing:"3px", color:"rgba(45,41,38,.5)" }}>SCAN QR CODE</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   18. CANDY  — kawaii pastel, rainbow wave top
═══════════════════════════════════════════════════ */
function PosterCandy({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(160deg,#fdf0ff 0%,#f0eeff 50%,#f0fffa 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* rainbow wave top */}
      <svg style={{ position:"absolute", top:0, left:0, width:"100%", height:32 }} viewBox="0 0 100 20" preserveAspectRatio="none">
        <defs><linearGradient id="rbG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ff9de2"/><stop offset="25%" stopColor="#a78bfa"/><stop offset="50%" stopColor="#67e8f9"/><stop offset="75%" stopColor="#86efac"/><stop offset="100%" stopColor="#fde68a"/></linearGradient></defs>
        <rect width="100" height="20" fill="url(#rbG)"/>
        <path d="M0,20 Q25,10 50,20 Q75,28 100,20 L100,20 L0,20Z" fill="rgba(255,255,255,.5)"/>
      </svg>
      {/* bubble decorations */}
      {[{top:"12%",left:"6%",size:24,color:"#fda4af"},{top:"16%",right:"8%",size:18,color:"#93c5fd"},{bottom:"20%",left:"4%",size:20,color:"#86efac"},{bottom:"16%",right:"6%",size:22,color:"#c4b5fd"}].map((b,i)=>{
        const {size,color,...pos} = b;
        return <div key={i} style={{ position:"absolute", ...pos, width:size, height:size, borderRadius:"50%", background:color, opacity:.5 }}/>;
      })}
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"36px 18px 16px" }}>
        <div style={{ fontSize:10, fontWeight:700, color:"#a78bfa", marginBottom:8 }}>ご感想をおしえてね！</div>
        <div style={{ fontSize:32, fontWeight:900, color:"#6d28d9", textAlign:"center", lineHeight:1.1, marginBottom:8 }}>{storeName}</div>
        <div style={{ display:"flex", gap:4, marginBottom:10 }}>
          {["#fda4af","#fbbf24","#86efac","#93c5fd","#c4b5fd"].map((c,i)=>(
            <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ))}
        </div>
        <div style={{ fontSize:9, color:"#7c3aed", marginBottom:16, textAlign:"center" }}>今日はどうでしたか？</div>
        <div style={{ border:"3px solid #e9d5ff", background:"#fff", borderRadius:24, padding:"14px 14px 10px", display:"flex", flexDirection:"column", alignItems:"center", gap:8, boxShadow:"0 6px 24px rgba(167,139,250,.2)" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={128} level="M" fgColor="#4c1d95"/>}
          <div style={{ fontSize:8, color:"#a78bfa", letterSpacing:"1px" }}>スキャンしてね！</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", marginTop:12, background:"linear-gradient(135deg,rgba(253,164,175,.25),rgba(196,181,253,.25))", border:"2px solid #e9d5ff", borderRadius:20, padding:"10px 14px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
            <div style={{ fontSize:9, color:"#7c3aed", marginBottom:2 }}>レビューで</div>
            <div style={{ fontSize:13, fontWeight:900, color:"#6d28d9" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   19. NOIR  — film noir, deep crimson glow, dramatic
═══════════════════════════════════════════════════ */
function PosterNoir({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#0c0406", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      <div style={{ position:"absolute", top:"-10%", left:"-10%", width:"70%", height:"60%", background:"radial-gradient(ellipse,rgba(153,27,27,.4) 0%,transparent 70%)", filter:"blur(30px)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-10%", right:"-10%", width:"60%", height:"50%", background:"radial-gradient(ellipse,rgba(120,10,35,.35) 0%,transparent 70%)", filter:"blur(25px)", pointerEvents:"none" }}/>
      {/* thin rules */}
      <div style={{ position:"absolute", top:12, left:14, right:14, height:1, background:"linear-gradient(to right,transparent,rgba(220,38,38,.5),transparent)" }}/>
      <div style={{ position:"absolute", bottom:12, left:14, right:14, height:1, background:"linear-gradient(to right,transparent,rgba(220,38,38,.5),transparent)" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"26px 20px 18px" }}>
        <div style={{ fontSize:8, letterSpacing:"8px", color:"rgba(220,38,38,.6)", marginBottom:14 }}>✦  CRITIQUE  ✦</div>
        <div style={{ width:40, height:1, background:"rgba(220,38,38,.4)", marginBottom:16 }}/>
        <div style={{ fontSize:36, fontWeight:900, color:"#fce7f3", lineHeight:.95, letterSpacing:"-1px", marginBottom:8, textShadow:"0 0 30px rgba(153,27,27,.5)" }}>{storeName}</div>
        <Stars5 c="#991b1b"/>
        <div style={{ fontSize:9, color:"rgba(252,231,243,.4)", margin:"12px 0 0", lineHeight:1.6 }}>本日のご体験は<br/>いかがでしたでしょうか</div>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end", justifyContent:"flex-end" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {incentive && (
              <div style={{ border:"1px solid rgba(153,27,27,.5)", background:"rgba(153,27,27,.12)", padding:"8px 12px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
                <div style={{ fontSize:8, color:"rgba(220,38,38,.5)", marginBottom:2 }}>レビューご記入で</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#fda4af" }}>{incentive}</div>
              </div>
            )}
            <div style={{ border:"1px solid rgba(220,38,38,.5)", background:"rgba(153,27,27,.12)", padding:10 }}>
              <div style={{ background:"#1a0408", padding:7 }}>
                {reviewUrl && <QRCode value={reviewUrl} size={126} level="M" fgColor="#fce7f3" bgColor="#1a0408"/>}
              </div>
            </div>
            <div style={{ fontSize:8, color:"rgba(220,38,38,.5)", letterSpacing:"3px" }}>QRをスキャン</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   20. VITALITY  — deep forest green, glassmorphism
═══════════════════════════════════════════════════ */
function PosterVitality({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(160deg,#021a0c 0%,#052e16 45%,#064e3b 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* leaf shapes */}
      <svg style={{ position:"absolute", top:0, right:0, width:"48%", opacity:.2 }} viewBox="0 0 100 120">
        <path d="M85,5 Q112,5 112,38 Q112,78 70,104 Q28,118 12,92 Q-4,66 22,40 Q50,5 85,5Z" fill="#34d399"/>
        <path d="M85,5 L42,98" stroke="rgba(255,255,255,.45)" strokeWidth="2" fill="none"/>
        <path d="M86,22 Q62,52 52,82" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" fill="none"/>
      </svg>
      <svg style={{ position:"absolute", bottom:0, left:0, width:"38%", opacity:.15 }} viewBox="0 0 100 100">
        <path d="M15,95 Q-12,95 -12,62 Q-12,18 32,3 Q72,-8 88,20 Q104,48 76,68 Q52,95 15,95Z" fill="#6ee7b7"/>
      </svg>
      <div style={{ position:"absolute", top:"22%", left:"50%", transform:"translateX(-50%)", width:"65%", height:"40%", background:"radial-gradient(circle,rgba(52,211,153,.18) 0%,transparent 70%)", filter:"blur(25px)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"24px 20px 18px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"#6ee7b7", marginBottom:6 }}>HEALTH REVIEW</div>
        <div style={{ width:24, height:1, background:"#34d399", marginBottom:16 }}/>
        <div style={{ fontSize:34, fontWeight:900, color:"#ecfdf5", lineHeight:.95, marginBottom:8, textShadow:"0 0 24px rgba(52,211,153,.35)" }}>{storeName}</div>
        <Stars5 c="#34d399"/>
        <div style={{ fontSize:10, color:"rgba(236,253,245,.55)", marginTop:12, lineHeight:1.5 }}>本日のご満足度を<br/>お聞かせください</div>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end", justifyContent:"flex-end" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {incentive && (
              <div style={{ background:"rgba(52,211,153,.2)", border:"1.5px solid rgba(52,211,153,.4)", borderRadius:10, padding:"8px 12px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
                <div style={{ fontSize:8, color:"#6ee7b7", marginBottom:2 }}>レビューご記入で</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#ecfdf5" }}>{incentive}</div>
              </div>
            )}
            <div style={{ background:"rgba(255,255,255,.08)", backdropFilter:"blur(8px)", border:"1.5px solid rgba(52,211,153,.4)", borderRadius:16, padding:"12px 12px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
              <div style={{ background:"#ecfdf5", borderRadius:8, padding:8 }}>
                {reviewUrl && <QRCode value={reviewUrl} size={126} level="M" fgColor="#064e3b"/>}
              </div>
              <div style={{ fontSize:8, color:"#6ee7b7", letterSpacing:"2px" }}>QRをスキャン</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   21. MESH  — fluid color mesh, gradient text
═══════════════════════════════════════════════════ */
function PosterMesh({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#0c0820", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      <div style={{ position:"absolute", top:"-18%", left:"5%", width:"65%", height:"65%", background:"radial-gradient(circle,#f43f5e 0%,transparent 65%)", filter:"blur(40px)", opacity:.7, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"18%", right:"-12%", width:"60%", height:"58%", background:"radial-gradient(circle,#6366f1 0%,transparent 65%)", filter:"blur(35px)", opacity:.6, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-12%", left:"18%", width:"65%", height:"58%", background:"radial-gradient(circle,#0ea5e9 0%,transparent 65%)", filter:"blur(40px)", opacity:.5, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"28%", left:"-8%", width:"42%", height:"42%", background:"radial-gradient(circle,#a855f7 0%,transparent 65%)", filter:"blur(28px)", opacity:.5, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0, background:"rgba(12,8,32,.3)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"24px 20px 18px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"rgba(255,255,255,.45)", marginBottom:10 }}>REVIEW</div>
        {/* gradient text store name */}
        <div style={{ fontSize:36, fontWeight:900, lineHeight:.95, letterSpacing:"-1px", marginBottom:8, background:"linear-gradient(135deg,#f43f5e 0%,#a855f7 50%,#0ea5e9 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{storeName}</div>
        <div style={{ width:48, height:3, background:"linear-gradient(to right,#f43f5e,#a855f7,#0ea5e9)", borderRadius:2, marginBottom:14 }}/>
        <Stars5 c="#f43f5e"/>
        <div style={{ fontSize:10, color:"rgba(255,255,255,.5)", marginTop:12, lineHeight:1.5 }}>本日のご感想を<br/>お聞かせください</div>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end", justifyContent:"flex-end" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {incentive && (
              <div style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", borderRadius:10, padding:"8px 12px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
                <div style={{ fontSize:8, color:"rgba(255,255,255,.4)", marginBottom:2 }}>レビューご記入で</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{incentive}</div>
              </div>
            )}
            {/* gradient border QR */}
            <div style={{ position:"relative", padding:2, borderRadius:18, background:"linear-gradient(135deg,#f43f5e,#a855f7,#0ea5e9)" }}>
              <div style={{ background:"rgba(12,8,32,.9)", backdropFilter:"blur(12px)", borderRadius:16, padding:"12px 12px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                <div style={{ background:"#fff", borderRadius:10, padding:8 }}>
                  {reviewUrl && <QRCode value={reviewUrl} size={126} level="M" fgColor="#0c0820"/>}
                </div>
                <div style={{ fontSize:8, background:"linear-gradient(to right,#f43f5e,#0ea5e9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"2px" }}>QRをスキャン</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   22. FOREST  — dark forest, tree silhouettes, gold
═══════════════════════════════════════════════════ */
function PosterForest({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(160deg,#060e08 0%,#0a1e10 50%,#0d2416 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* tree silhouettes bottom */}
      <svg style={{ position:"absolute", bottom:0, left:0, right:0, width:"100%", opacity:.2 }} viewBox="0 0 100 55" preserveAspectRatio="none">
        <polygon points="8,55 14,16 20,55" fill="#34d399"/>
        <polygon points="24,55 32,6 40,55" fill="#4ade80"/>
        <polygon points="48,55 58,2 68,55" fill="#34d399"/>
        <polygon points="70,55 77,14 84,55" fill="#4ade80"/>
        <polygon points="84,55 91,22 98,55" fill="#34d399"/>
        <rect x="0" y="48" width="100" height="7" fill="#0d2416"/>
      </svg>
      {/* gold bars */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(to right,transparent,#d4af37 30%,#d4af37 70%,transparent)" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:"linear-gradient(to right,transparent,#d4af37 30%,#d4af37 70%,transparent)" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 20px 18px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"#d4af37", marginBottom:6 }}>✦ WELCOME ✦</div>
        <div style={{ width:36, height:1, background:"linear-gradient(to right,transparent,#d4af37,transparent)", marginBottom:16 }}/>
        <div style={{ fontSize:34, fontWeight:900, color:"#ecfdf5", textAlign:"center", lineHeight:1.05, marginBottom:6 }}>{storeName}</div>
        <Stars5 c="#d4af37"/>
        <div style={{ fontSize:9, color:"rgba(212,175,55,.55)", margin:"10px 0 0", letterSpacing:"1px" }}>ご滞在ありがとうございます</div>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"14px 0" }}>
          <div style={{ border:"1px solid rgba(212,175,55,.5)", background:"rgba(212,175,55,.05)", padding:12, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            <div style={{ background:"#ecfdf5", padding:8 }}>
              {reviewUrl && <QRCode value={reviewUrl} size={130} level="M" fgColor="#060e08"/>}
            </div>
            <div style={{ fontSize:8, color:"rgba(212,175,55,.7)", letterSpacing:"3px" }}>QRコードをスキャン</div>
          </div>
        </div>
        {incentive && (
          <div style={{ width:"100%", border:"1px solid rgba(212,175,55,.3)", background:"rgba(212,175,55,.06)", padding:"10px 14px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
            <div style={{ fontSize:9, color:"rgba(212,175,55,.55)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#d4af37" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   23. SUNSET  — gradient sky, large radial sun
═══════════════════════════════════════════════════ */
function PosterSunset({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", background:"linear-gradient(180deg,#1a3158 0%,#2d6a9f 22%,#e8742a 55%,#e84393 78%,#c33080 100%)" }}>
      {/* large radial sun */}
      <div style={{ position:"absolute", top:"26%", left:"50%", transform:"translate(-50%,-50%)", width:"60%", paddingTop:"60%", borderRadius:"50%", background:"radial-gradient(circle,#fde68a 0%,#fbbf24 35%,rgba(251,191,36,0) 70%)", opacity:.65, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"50%", left:0, right:0, height:1, background:"rgba(255,255,255,.2)" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"22px 20px 18px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"rgba(255,255,255,.65)", marginBottom:14 }}>SUNSET REVIEW</div>
        {/* silhouette store name */}
        <div style={{ fontSize:38, fontWeight:900, color:"rgba(255,255,255,.9)", lineHeight:.9, letterSpacing:"-2px", textShadow:"0 2px 16px rgba(0,0,0,.35)", marginBottom:8 }}>{storeName}</div>
        <Stars5 c="#fde68a"/>
        <div style={{ fontSize:10, color:"rgba(255,255,255,.65)", marginTop:12, lineHeight:1.5 }}>本日のご感想を<br/>お聞かせください</div>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end", justifyContent:"flex-end" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {incentive && (
              <div style={{ background:"rgba(255,255,255,.15)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,.25)", borderRadius:10, padding:"8px 12px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
                <div style={{ fontSize:8, color:"rgba(253,230,138,.8)", marginBottom:2 }}>レビューご記入で</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#fde68a" }}>{incentive}</div>
              </div>
            )}
            <div style={{ background:"rgba(255,255,255,.18)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,255,255,.3)", borderRadius:20, padding:"12px 12px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
              <div style={{ background:"#fff", borderRadius:12, padding:8 }}>
                {reviewUrl && <QRCode value={reviewUrl} size={126} level="M" fgColor="#1a3158"/>}
              </div>
              <div style={{ fontSize:8, color:"rgba(255,255,255,.75)", letterSpacing:"2px" }}>QRをスキャン</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   24. TYPO  — ghost REVIEW background, left rule
═══════════════════════════════════════════════════ */
function PosterTypo({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#fff", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* giant ghost REVIEW */}
      <div style={{ position:"absolute", top:"18%", left:"-2%", fontSize:"clamp(60px,18vw,140px)", fontWeight:900, color:"rgba(0,0,0,.04)", lineHeight:1, pointerEvents:"none", whiteSpace:"nowrap", userSelect:"none" }}>REVIEW</div>
      {/* left thick rule */}
      <div style={{ position:"absolute", top:0, left:0, bottom:0, width:10, background:"#111" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", paddingLeft:22, paddingRight:18, paddingTop:22, paddingBottom:18 }}>
        <div style={{ fontSize:7, letterSpacing:"7px", color:"#bbb", marginBottom:12 }}>REVIEW</div>
        <div style={{ fontSize:44, fontWeight:900, color:"#111", lineHeight:.88, letterSpacing:"-3px", marginBottom:14 }}>{storeName}</div>
        <div style={{ width:"100%", height:5, background:"#111", marginBottom:16 }}/>
        <div style={{ fontSize:10, color:"#555", marginBottom:12, lineHeight:1.6, fontWeight:300 }}>本日のご感想を<br/>お聞かせください</div>
        <Stars5 c="#111"/>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, width:"100%" }}>
            <div style={{ border:"4px solid #111", padding:8, flexShrink:0 }}>
              {reviewUrl && <QRCode value={reviewUrl} size={124} level="M" fgColor="#111"/>}
            </div>
            <div style={{ flex:1 }}>
              {incentive && (
                <div style={{ borderTop:"3px solid #111", paddingTop:10 }}>
                  <div style={{ fontSize:7, color:"#bbb", marginBottom:2, letterSpacing:"4px" }}>SPECIAL OFFER</div>
                  <div style={{ fontSize:14, fontWeight:900, color:"#111" }}>{incentive}</div>
                </div>
              )}
              <div style={{ fontSize:7, color:"#ccc", letterSpacing:"3px", marginTop:10 }}>QRコードをスキャン</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   25. GLITCH  — cyberpunk glitch effect, scanlines
═══════════════════════════════════════════════════ */
function PosterGlitch({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#080010", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* glitch ghost layers */}
      <div style={{ position:"absolute", top:"20%", left:"4%", fontSize:"clamp(22px,7vw,48px)", fontWeight:900, color:"rgba(255,0,80,.2)", lineHeight:1, pointerEvents:"none", whiteSpace:"nowrap" }}>{storeName}</div>
      <div style={{ position:"absolute", top:"calc(20% + 4px)", left:"2%", fontSize:"clamp(22px,7vw,48px)", fontWeight:900, color:"rgba(0,255,255,.15)", lineHeight:1, pointerEvents:"none", whiteSpace:"nowrap" }}>{storeName}</div>
      {/* scanlines */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,rgba(255,255,255,.012) 0,transparent 1px,transparent 3px)", pointerEvents:"none" }}/>
      {/* noise bars */}
      <div style={{ position:"absolute", top:"40%", left:0, right:0, height:3, background:"rgba(255,0,80,.12)" }}/>
      <div style={{ position:"absolute", top:"42.5%", left:"8%", right:"15%", height:1, background:"rgba(0,255,255,.1)" }}/>
      {/* pixel border */}
      <div style={{ position:"absolute", inset:8, border:"1px solid rgba(255,0,80,.25)" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"26px 20px 18px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"#ff0050", fontFamily:"monospace", marginBottom:10 }}>[ REVIEW.EXE ]</div>
        {/* glitch store name with text-shadow effect */}
        <div style={{ fontSize:34, fontWeight:900, color:"#fff", lineHeight:.95, letterSpacing:"-1px", textShadow:"2px 0 #ff0050, -2px 0 #00ffff", marginBottom:8 }}>{storeName}</div>
        <div style={{ width:36, height:2, background:"#ff0050", marginBottom:10 }}/>
        <Stars5 c="#ff0050"/>
        <div style={{ fontSize:8, color:"rgba(0,255,255,.55)", fontFamily:"monospace", marginTop:10, lineHeight:1.6 }}>PLAYER_FEEDBACK_MODE: ON<br/>ご感想を入力してください</div>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end", justifyContent:"flex-end" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {incentive && (
              <div style={{ background:"rgba(255,0,80,.06)", border:"1px solid rgba(255,0,80,.3)", padding:"8px 12px", textAlign:"center" as React.CSSProperties["textAlign"], fontFamily:"monospace" }}>
                <div style={{ fontSize:8, color:"rgba(0,255,255,.45)", marginBottom:2 }}>REWARD_UNLOCKED:</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#ff0050" }}>{incentive}</div>
              </div>
            )}
            <div style={{ border:"1px solid #ff0050", boxShadow:"0 0 14px rgba(255,0,80,.3)", padding:10 }}>
              <div style={{ background:"#080010", border:"1px solid rgba(0,255,255,.2)", padding:7 }}>
                {reviewUrl && <QRCode value={reviewUrl} size={124} level="M" fgColor="#ff0050" bgColor="#080010"/>}
              </div>
            </div>
            <div style={{ fontSize:8, letterSpacing:"3px", color:"rgba(0,255,255,.6)", fontFamily:"monospace" }}>SCAN &gt;&gt; SUBMIT</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   26. WATERCOLOR  — soft floral wash, gentle aesthetic
═══════════════════════════════════════════════════ */
function PosterWatercolor({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#fefcfa", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 100 148" preserveAspectRatio="none">
        <defs>
          <filter id="wcFilter"><feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="5" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>
        </defs>
        <ellipse cx="20" cy="18" rx="32" ry="25" fill="#fda4af" opacity=".4" filter="url(#wcFilter)"/>
        <ellipse cx="80" cy="32" rx="26" ry="30" fill="#93c5fd" opacity=".35" filter="url(#wcFilter)"/>
        <ellipse cx="12" cy="110" rx="28" ry="22" fill="#86efac" opacity=".3" filter="url(#wcFilter)"/>
        <ellipse cx="88" cy="125" rx="24" ry="26" fill="#fbbf24" opacity=".3" filter="url(#wcFilter)"/>
        <ellipse cx="50" cy="72" rx="20" ry="18" fill="#c4b5fd" opacity=".25" filter="url(#wcFilter)"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"26px 22px 18px" }}>
        <div style={{ fontSize:8, letterSpacing:"4px", color:"#d4919c", marginBottom:8 }}>REVIEW</div>
        <div style={{ fontSize:34, fontWeight:900, color:"#4a3728", textAlign:"center", lineHeight:1.1, marginBottom:8 }}>{storeName}</div>
        <div style={{ width:28, height:1, background:"rgba(249,168,212,.6)", marginBottom:14 }}/>
        <Stars5 c="#f9a8d4"/>
        <div style={{ fontSize:10, color:"#5c4033", margin:"12px 0 16px", textAlign:"center", lineHeight:1.6, fontWeight:300 }}>本日のご感想を<br/>お聞かせください</div>
        <div style={{ background:"rgba(255,255,255,.85)", backdropFilter:"blur(6px)", border:"2px solid rgba(249,168,212,.45)", borderRadius:24, padding:"14px 14px 10px", display:"flex", flexDirection:"column", alignItems:"center", gap:8, boxShadow:"0 6px 24px rgba(249,168,212,.2)" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={130} level="M" fgColor="#4a3728"/>}
          <div style={{ fontSize:8, color:"#d4919c", letterSpacing:"2px" }}>QRコードをスキャン</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", marginTop:14, background:"rgba(249,168,212,.12)", border:"1.5px solid rgba(249,168,212,.4)", borderRadius:16, padding:"10px 14px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
            <div style={{ fontSize:9, color:"#d4919c", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#4a3728" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   27. ORIENTAL  — deep red-black, gold lattice, heavy
═══════════════════════════════════════════════════ */
function PosterOriental({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#180305", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* gold lattice top */}
      <svg style={{ position:"absolute", top:0, left:0, right:0, width:"100%", height:"32%", opacity:.2 }} viewBox="0 0 100 48" preserveAspectRatio="none">
        {Array.from({length:7},(_,i)=><rect key={i} x={i*16-2} y="0" width="14" height="48" fill="none" stroke="#d4af37" strokeWidth="0.6"/>)}
        {Array.from({length:4},(_,i)=><line key={i} x1="0" y1={i*14} x2="100" y2={i*14} stroke="#d4af37" strokeWidth="0.6"/>)}
      </svg>
      {/* crimson wash */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"42%", background:"linear-gradient(180deg,rgba(120,10,10,.7) 0%,transparent 100%)", pointerEvents:"none" }}/>
      {/* gold bars */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:"linear-gradient(to right,#8b6914,#ffd700,#8b6914)" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:4, background:"linear-gradient(to right,#8b6914,#ffd700,#8b6914)" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"22px 20px 18px" }}>
        <div style={{ fontSize:8, letterSpacing:"6px", color:"#d4af37", marginBottom:6 }}>口コミ  REVIEW</div>
        <div style={{ width:48, height:1, background:"linear-gradient(to right,transparent,#d4af37,transparent)", marginBottom:16 }}/>
        <div style={{ fontSize:34, fontWeight:900, color:"#fff9f0", textAlign:"center", lineHeight:1.0, marginBottom:6 }}>{storeName}</div>
        <Stars5 c="#d4af37"/>
        <div style={{ fontSize:9, color:"rgba(212,175,55,.55)", margin:"12px 0 0", letterSpacing:"2px" }}>ご来店ありがとうございます</div>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"12px 0" }}>
          <div style={{ border:"1.5px solid #d4af37", padding:2 }}>
            <div style={{ border:"1px solid rgba(212,175,55,.25)", background:"rgba(212,175,55,.04)", padding:12, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
              <div style={{ background:"#fff9f0", padding:8 }}>
                {reviewUrl && <QRCode value={reviewUrl} size={130} level="M" fgColor="#180305"/>}
              </div>
              <div style={{ fontSize:8, color:"rgba(212,175,55,.7)", letterSpacing:"3px" }}>QRコードをスキャン</div>
            </div>
          </div>
        </div>
        {incentive && (
          <div style={{ width:"100%", border:"1px solid rgba(212,175,55,.35)", background:"rgba(120,10,10,.2)", padding:"10px 14px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
            <div style={{ fontSize:9, color:"rgba(212,175,55,.55)", marginBottom:2 }}>レビューご記入で</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#d4af37" }}>{incentive}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   28. BARBER  — barbershop pole, diagonal stripe BG
═══════════════════════════════════════════════════ */
function PosterBarber({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"#fff", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* diagonal stripe BG */}
      <div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(135deg,transparent,transparent 24px,rgba(0,0,0,.035) 24px,rgba(0,0,0,.035) 26px)", pointerEvents:"none" }}/>
      {/* left barbershop pole: black with red center */}
      <div style={{ position:"absolute", top:0, left:0, bottom:0, width:14, background:"#111" }}/>
      <div style={{ position:"absolute", top:"30%", left:0, bottom:"30%", width:14, background:"#dc2626" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", paddingLeft:24, paddingRight:18, paddingTop:20, paddingBottom:18 }}>
        <div style={{ fontSize:7, letterSpacing:"7px", color:"rgba(0,0,0,.4)", textTransform:"uppercase" as React.CSSProperties["textTransform"], marginBottom:8 }}>BARBER · REVIEW</div>
        <div style={{ fontSize:44, fontWeight:900, color:"#111", lineHeight:.88, letterSpacing:"-3px", marginBottom:10 }}>{storeName}</div>
        <div style={{ width:36, height:4, background:"#dc2626", marginBottom:16 }}/>
        <div style={{ fontSize:10, color:"#444", marginBottom:12, lineHeight:1.5 }}>本日の仕上がりは<br/>いかがでしたか？</div>
        <Stars5 c="#111"/>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end", justifyContent:"flex-end" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {incentive && (
              <div style={{ background:"#111", padding:"8px 14px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
                <div style={{ fontSize:8, color:"rgba(255,255,255,.45)", marginBottom:2 }}>ご記入で</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{incentive}</div>
              </div>
            )}
            <div style={{ border:"5px solid #111", padding:8, background:"#fff" }}>
              {reviewUrl && <QRCode value={reviewUrl} size={126} level="M" fgColor="#111"/>}
            </div>
            <div style={{ fontSize:8, letterSpacing:"3px", color:"rgba(0,0,0,.45)" }}>QRコードをスキャン</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   29. WAVE  — soundwave SVG center, indigo dark
═══════════════════════════════════════════════════ */
function PosterWave({ storeName, incentive, reviewUrl }: PosterProps) {
  const waveHeights = [3,5,8,12,18,22,18,12,8,14,20,24,20,14,8,12,18,14,8,5,3,6,10,16,20,22,16,10,6,4,8,12,18,22,18,14,8,12,16,10,6,4,8,14,20,24,18,10,6,3];
  return (
    <div style={{ width:"100%", height:"100%", background:"#0a0820", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* soundwave SVG center */}
      <svg style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", left:0, right:0, width:"100%", height:"55%", opacity:.13 }} viewBox="0 0 100 50" preserveAspectRatio="none">
        {waveHeights.map((h,i)=>(
          <rect key={i} x={i*2} y={(50-h)/2} width="1.6" height={h} fill="#818cf8" rx="0.5"/>
        ))}
      </svg>
      {/* glow */}
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:"75%", height:"40%", background:"radial-gradient(circle,rgba(129,140,248,.18) 0%,transparent 70%)", filter:"blur(20px)", pointerEvents:"none" }}/>
      {/* wave top/bottom */}
      <svg style={{ position:"absolute", top:0, left:0, right:0, width:"100%", opacity:.35 }} viewBox="0 0 100 8" preserveAspectRatio="none" height="22">
        <path d="M0,4 Q12,0 25,4 Q37,8 50,4 Q62,0 75,4 Q87,8 100,4" fill="none" stroke="#6366f1" strokeWidth="1.5"/>
      </svg>
      <svg style={{ position:"absolute", bottom:0, left:0, right:0, width:"100%", opacity:.35 }} viewBox="0 0 100 8" preserveAspectRatio="none" height="22">
        <path d="M0,4 Q12,8 25,4 Q37,0 50,4 Q62,8 75,4 Q87,0 100,4" fill="none" stroke="#6366f1" strokeWidth="1.5"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"24px 20px 18px" }}>
        <div style={{ fontSize:8, letterSpacing:"5px", color:"#818cf8", marginBottom:10 }}>REVIEW</div>
        <div style={{ fontSize:34, fontWeight:900, color:"#fff", lineHeight:.95, marginBottom:8, textShadow:"0 0 20px rgba(99,102,241,.5)" }}>{storeName}</div>
        <div style={{ width:36, height:3, background:"linear-gradient(to right,#6366f1,#818cf8)", marginBottom:14 }}/>
        <Stars5 c="#818cf8"/>
        <div style={{ fontSize:10, color:"rgba(129,140,248,.6)", marginTop:12, lineHeight:1.5 }}>本日のご感想を<br/>お聞かせください</div>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end", justifyContent:"flex-end" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {incentive && (
              <div style={{ background:"rgba(99,102,241,.12)", border:"1px solid rgba(99,102,241,.35)", borderRadius:10, padding:"8px 12px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
                <div style={{ fontSize:8, color:"rgba(129,140,248,.6)", marginBottom:2 }}>レビューご記入で</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#818cf8" }}>{incentive}</div>
              </div>
            )}
            <div style={{ border:"1.5px solid rgba(99,102,241,.55)", background:"rgba(99,102,241,.08)", borderRadius:10, padding:10, boxShadow:"0 0 24px rgba(99,102,241,.2)" }}>
              <div style={{ background:"#1c1a3a", borderRadius:6, padding:8 }}>
                {reviewUrl && <QRCode value={reviewUrl} size={126} level="M" fgColor="#e0e7ff" bgColor="#1c1a3a"/>}
              </div>
            </div>
            <div style={{ fontSize:8, color:"rgba(129,140,248,.7)", letterSpacing:"2px" }}>QRをスキャン</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   30. KIDS  — playful yellow, sun, clouds, rainbow stars
═══════════════════════════════════════════════════ */
function PosterKids({ storeName, incentive, reviewUrl }: PosterProps) {
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(160deg,#fffbeb 0%,#fef9c3 55%,#fefce8 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* radial gradient sun top-right */}
      <div style={{ position:"absolute", top:"-6%", right:"-6%", width:"40%", paddingTop:"40%", borderRadius:"50%", background:"radial-gradient(circle,#fbbf24 35%,rgba(251,191,36,.4) 65%,transparent 100%)" }}/>
      {/* cloud left */}
      <div style={{ position:"absolute", top:"14%", left:"-6%", width:72, height:38, background:"rgba(255,255,255,.75)", borderRadius:30 }}/>
      <div style={{ position:"absolute", top:"10%", left:"6%", width:50, height:30, background:"rgba(255,255,255,.65)", borderRadius:24 }}/>
      {/* cloud right lower */}
      <div style={{ position:"absolute", top:"48%", right:"-4%", width:60, height:30, background:"rgba(255,255,255,.6)", borderRadius:28 }}/>
      {/* rainbow stars */}
      {[{left:"18%",top:"6%",color:"#fbbf24"},{left:"42%",top:"3%",color:"#f87171"},{left:"62%",top:"8%",color:"#34d399"},{left:"78%",top:"3%",color:"#60a5fa"}].map((s,i)=>(
        <div key={i} style={{ position:"absolute", left:s.left, top:s.top, fontSize:16, color:s.color, opacity:.6 }}>★</div>
      ))}
      {/* green ground */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"10%", background:"#bbf7d0", borderRadius:"60% 60% 0 0 / 30% 30% 0 0" }}/>
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"22px 18px 16px" }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#d97706", marginBottom:8 }}>みなさまのこえ</div>
        <div style={{ fontSize:32, fontWeight:900, color:"#92400e", textAlign:"center", lineHeight:1.1, marginBottom:8 }}>{storeName}</div>
        <div style={{ display:"flex", gap:4, marginBottom:12 }}>
          {["#fbbf24","#f87171","#34d399","#60a5fa","#a78bfa"].map((c,i)=>(
            <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill={c}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ))}
        </div>
        <div style={{ fontSize:10, fontWeight:700, color:"#78350f", marginBottom:16, textAlign:"center" }}>きょうはどうでしたか？</div>
        <div style={{ background:"#fff", border:"3px solid #fbbf24", borderRadius:22, padding:"14px 14px 10px", display:"flex", flexDirection:"column", alignItems:"center", gap:8, boxShadow:"0 6px 16px rgba(251,191,36,.25)" }}>
          {reviewUrl && <QRCode value={reviewUrl} size={130} level="M" fgColor="#78350f"/>}
          <div style={{ fontSize:8, fontWeight:700, color:"#b45309" }}>スキャンしてね！</div>
        </div>
        {incentive && (
          <div style={{ width:"100%", marginTop:12, background:"linear-gradient(135deg,rgba(251,191,36,.25),rgba(52,211,153,.2))", border:"2px solid #fbbf24", borderRadius:18, padding:"10px 14px", textAlign:"center" as React.CSSProperties["textAlign"] }}>
            <div style={{ fontSize:9, color:"#92400e", fontWeight:600, marginBottom:2 }}>かいてくれたら</div>
            <div style={{ fontSize:14, fontWeight:900, color:"#78350f" }}>{incentive}</div>
          </div>
        )}
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
