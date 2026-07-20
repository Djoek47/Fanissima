import { useState, useMemo, useCallback, ReactNode, CSSProperties } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Home, Search, Play, User, Bell, ChevronRight,
  Heart, MessageCircle, Share2,
  X, Check, Users, MapPin, Calendar, Clock, ChevronUp
} from "lucide-react"

// ─── Type tokens ───────────────────────────────────────────────────────────────
const DSP  = `"Bodoni Moda", Georgia, serif`
const UI   = `"Figtree", system-ui, sans-serif`
const MONO = `"DM Mono", "SF Mono", monospace`

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:     "#09090F",
  border: "rgba(255,255,255,0.065)",
  pink:   "#FF0080",
  gold:   "#C4A35A",
  lav:    "#A78BFA",
  text:   "#F4F3FF",
  sub:    "rgba(244,243,255,0.50)",
  muted:  "rgba(244,243,255,0.28)",
  dim:    "rgba(244,243,255,0.14)",
}

// ─── Spring configs ────────────────────────────────────────────────────────────
const sp = {
  default: { type:"spring" as const, bounce:0,    duration:0.35 },
  bounce:  { type:"spring" as const, bounce:0.20, duration:0.44 },
  snappy:  { type:"spring" as const, bounce:0,    duration:0.20 },
  sheet:   { type:"spring" as const, bounce:0.10, duration:0.50 },
  gentle:  { type:"spring" as const, bounce:0,    duration:0.60 },
}

// ─── Card / glass recipes ──────────────────────────────────────────────────────
const card: CSSProperties = {
  background: `linear-gradient(145deg, rgba(255,255,255,0.054) 0%, rgba(255,255,255,0.026) 100%)`,
  border: `1px solid ${C.border}`,
  boxShadow: "0 2px 20px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.065)",
}
const cardPink: CSSProperties = {
  background: `linear-gradient(145deg, rgba(255,0,128,0.12) 0%, rgba(255,0,128,0.04) 100%)`,
  border: `1px solid rgba(255,0,128,0.18)`,
  boxShadow: "0 4px 28px rgba(255,0,128,0.14), inset 0 1px 0 rgba(255,255,255,0.06)",
}
const cardGold: CSSProperties = {
  background: `linear-gradient(145deg, rgba(196,163,90,0.12) 0%, rgba(196,163,90,0.04) 100%)`,
  border: `1px solid rgba(196,163,90,0.20)`,
  boxShadow: "0 4px 28px rgba(196,163,90,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
}
const glassNav: CSSProperties = {
  background: "rgba(9,9,15,0.78)",
  backdropFilter: "blur(48px) saturate(180%)",
  WebkitBackdropFilter: "blur(48px) saturate(180%)",
  boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.42), 0 12px 40px rgba(0,0,0,0.40)",
  border: "1px solid rgba(255,255,255,0.14)",
}
const glassTab: CSSProperties = {
  background: "rgba(11,11,18,0.82)",
  backdropFilter: "blur(56px) saturate(200%)",
  WebkitBackdropFilter: "blur(56px) saturate(200%)",
  boxShadow: "inset 0 2px 0 rgba(255,255,255,0.40), 0 -2px 32px rgba(0,0,0,0.50)",
  border: "1px solid rgba(255,255,255,0.12)",
}
const glassSheet: CSSProperties = {
  background: "rgba(10,10,17,0.97)",
  backdropFilter: "blur(64px) saturate(200%)",
  WebkitBackdropFilter: "blur(64px) saturate(200%)",
}

function shadeColor(hex:string, p:number) {
  const n=parseInt(hex.slice(1),16)
  return `rgb(${Math.min(255,Math.max(0,(n>>16)+p))},${Math.min(255,Math.max(0,((n>>8)&0xff)+p))},${Math.min(255,Math.max(0,(n&0xff)+p))})`
}

// ─── Apple Fitness ring ────────────────────────────────────────────────────────
function Ring({ pct, color, size=44, stroke=4 }: { pct:number; color:string; size?:number; stroke?:number }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}1E`} strokeWidth={stroke}/>
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        initial={{ strokeDasharray:`0 ${circ}` }}
        animate={{ strokeDasharray:`${dash} ${circ}` }}
        transition={{ duration:1.2, ease:[0.22,1,0.36,1], delay:0.2 }}
      />
    </svg>
  )
}

// ─── AI Orb ────────────────────────────────────────────────────────────────────
function Orb({ size=36 }: { size?:number }) {
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <motion.div
        animate={{ scale:[1,1.12,1], rotate:[0,8,-8,0] }}
        transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }}
        style={{ width:size, height:size, borderRadius:"50%", background:`conic-gradient(from 220deg, ${C.pink} 0%, ${C.gold} 40%, ${C.lav} 70%, ${C.pink} 100%)`, boxShadow:`0 0 ${size*0.6}px rgba(255,0,128,0.55)` }}
      />
      <div style={{ position:"absolute", inset:"3px", borderRadius:"50%", background:"rgba(9,9,15,0.5)", backdropFilter:"blur(4px)" }}/>
    </div>
  )
}

function Press({ children, onTap, style={} }: { children:ReactNode; onTap?:()=>void; style?:CSSProperties }) {
  return (
    <motion.div style={{ cursor:"pointer", ...style }} whileTap={{ scale:0.96, opacity:0.88 }} transition={sp.snappy} onClick={onTap}>
      {children}
    </motion.div>
  )
}

function Dot({ color=C.pink, size=6 }:{ color?:string; size?:number }) {
  return (
    <motion.span style={{ display:"inline-block", width:size, height:size, borderRadius:"50%", background:color, flexShrink:0 }} animate={{ opacity:[1,0.28,1] }} transition={{ duration:1.8, repeat:Infinity, ease:"easeInOut" }}/>
  )
}

function SH({ title, sub, onSeeAll }: { title:string; sub?:string; onSeeAll?:()=>void }) {
  return (
    <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:"14px" }}>
      <div>
        <h2 style={{ fontFamily:UI, fontSize:"17px", fontWeight:700, color:C.text, letterSpacing:"-0.025em", margin:0 }}>{title}</h2>
        {sub && <p style={{ fontFamily:UI, fontSize:"11px", color:C.muted, marginTop:"2px" }}>{sub}</p>}
      </div>
      {onSeeAll && (
        <motion.button whileTap={{scale:0.90}} onClick={onSeeAll} style={{ fontFamily:UI, color:C.pink, fontSize:"12px", fontWeight:600, display:"flex", alignItems:"center", gap:"2px" }}>
          See all <ChevronRight size={11}/>
        </motion.button>
      )}
    </div>
  )
}

function FollowBtn({ following, onToggle, size="md" }: { following:boolean; onToggle:()=>void; size?:"sm"|"md"|"lg" }) {
  const configs = {
    sm: { padding:"5px 14px", fontSize:"10px", height:"26px" },
    md: { padding:"8px 20px", fontSize:"12px", height:"32px" },
    lg: { padding:"0", fontSize:"15px", height:"52px" },
  }
  const c = configs[size]
  return (
    <motion.button
      whileTap={{ scale:0.92 }} transition={sp.snappy}
      onClick={e=>{ e.stopPropagation(); onToggle() }}
      style={{
        height:c.height, width:size==="lg"?"100%":"auto",
        padding:size==="lg"?"0 24px":c.padding, borderRadius:"999px",
        fontFamily:UI, fontSize:c.fontSize, fontWeight:700, letterSpacing:"-0.01em",
        background: following ? "rgba(255,255,255,0.07)" : C.pink,
        color: following ? C.sub : "white",
        border: following ? `1px solid ${C.border}` : `1px solid ${C.pink}`,
        boxShadow: following ? "none" : "0 4px 20px rgba(255,0,128,0.35)",
        display:"flex", alignItems:"center", justifyContent:"center", gap:"5px", flexShrink:0,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={following?"f":"u"} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={sp.snappy} style={{display:"flex",alignItems:"center",gap:"5px"}}>
          {following ? <><Check size={11}/> Following</> : "+ Follow"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

function Sheet({ children, onClose, tall=false }: { children:ReactNode; onClose:()=>void; tall?:boolean }) {
  return (
    <div style={{ position:"absolute", inset:0, zIndex:50, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={sp.default} onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.70)", backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)" }}/>
      <motion.div
        initial={{ y:"100%", opacity:0.5 }} animate={{ y:0, opacity:1 }} exit={{ y:"100%", opacity:0 }} transition={sp.sheet}
        style={{ position:"relative", ...glassSheet, borderRadius:"32px 32px 0 0", border:"1px solid rgba(255,255,255,0.10)", borderBottom:"none", maxHeight:tall?"90%":"82%", overflowY:"auto", scrollbarWidth:"none" }}
      >
        <div style={{ display:"flex", justifyContent:"center", paddingTop:"14px", paddingBottom:"6px" }}>
          <div style={{ width:"40px", height:"4px", borderRadius:"2px", background:"rgba(255,255,255,0.18)" }}/>
        </div>
        {children}
      </motion.div>
    </div>
  )
}

interface Competition { id:string; name:string; abbr:string; sport:string; primary:string; accent:string; textCol:string; teams:number; country:string; desc:string }
const COMPETITIONS: Competition[] = [
  { id:"uwcl",  name:"UEFA Women's Champions League", abbr:"UWCL",  sport:"Football",   primary:"#0F3480", accent:"#F5C518", textCol:"#F5C518", teams:32, country:"🌍", desc:"Europe's premier women's club competition featuring 32 of the continent's finest clubs." },
  { id:"wsl",   name:"Women's Super League",           abbr:"WSL",   sport:"Football",   primary:"#5B2380", accent:"#FFFFFF", textCol:"#FFFFFF", teams:12, country:"🏴", desc:"England's top-flight women's league, home to Arsenal, Chelsea, Manchester City and more." },
  { id:"nwsl",  name:"NWSL",                           abbr:"NWSL",  sport:"Football",   primary:"#0D2E5C", accent:"#FF4438", textCol:"#FFFFFF", teams:14, country:"🇺🇸", desc:"The National Women's Soccer League." },
  { id:"ligaf", name:"Liga F",                         abbr:"Liga F",sport:"Football",   primary:"#C8102E", accent:"#FFD100", textCol:"#FFFFFF", teams:16, country:"🇪🇸", desc:"Spain's professional women's football league. Home to FC Barcelona Femení." },
  { id:"d1",    name:"D1 Arkema",                      abbr:"D1",    sport:"Football",   primary:"#1B2B7D", accent:"#FFFFFF", textCol:"#FFFFFF", teams:12, country:"🇫🇷", desc:"France's top women's league, featuring Lyon and PSG Féminines." },
  { id:"wnba",  name:"WNBA",                           abbr:"WNBA",  sport:"Basketball", primary:"#1D428A", accent:"#FF6900", textCol:"#FFFFFF", teams:13, country:"🇺🇸", desc:"The world's premier professional women's basketball league." },
  { id:"wta",   name:"WTA Tour",                       abbr:"WTA",   sport:"Tennis",     primary:"#00827F", accent:"#FFFFFF", textCol:"#FFFFFF", teams:0,  country:"🌍", desc:"The international circuit of women's professional tennis." },
]

function CompBadge({ comp, size=52 }: { comp:Competition; size?:number }) {
  return (
    <div style={{ width:size, height:size, borderRadius:size*0.28, background:`linear-gradient(145deg, ${comp.primary} 0%, ${shadeColor(comp.primary,-20)} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 6px 24px ${comp.primary}50` }}>
      <svg width={size*0.72} height={size*0.36} viewBox={`0 0 ${comp.abbr.length*10} 18`}>
        <text x="50%" y="14" textAnchor="middle" fill={comp.textCol} fontSize="13" fontWeight="700" fontFamily="Figtree,system-ui,sans-serif">{comp.abbr}</text>
      </svg>
    </div>
  )
}

interface Player { id:string; name:string; team:string; teamId:string; country:string; position:string; sport:string; age:number; photo:string; stats:{l:string;v:string;pct:number}[]; bio:string }
const ALL_PLAYERS: Player[] = [
  { id:"putellas",   name:"Alexia Putellas",           team:"FC Barcelona",      teamId:"barca-w",    country:"🇪🇸", position:"Attacking Mid",  sport:"Football",   age:30, photo:"1629977007371-0ba395424741", stats:[{l:"Goals",v:"12",pct:82},{l:"Assists",v:"8",pct:68},{l:"Rating",v:"9.1",pct:91},{l:"Matches",v:"18",pct:72}], bio:"Two-time Ballon d'Or Féminin winner. Putellas defines modern women's football." },
  { id:"kerr",       name:"Sam Kerr",                  team:"Chelsea FCW",       teamId:"chelsea-w",  country:"🇦🇺", position:"Striker",         sport:"Football",   age:30, photo:"1603291697926-7e5822ed1ac5", stats:[{l:"Goals",v:"18",pct:90},{l:"Assists",v:"5",pct:45},{l:"Rating",v:"8.8",pct:88},{l:"Matches",v:"21",pct:84}], bio:"Australia's greatest footballer and one of the most prolific strikers in WSL history." },
  { id:"miedema",    name:"Vivianne Miedema",          team:"Manchester City W", teamId:"mancity-w",  country:"🇳🇱", position:"Striker",         sport:"Football",   age:28, photo:"1535506197904-37e764012458", stats:[{l:"Goals",v:"15",pct:78},{l:"Assists",v:"11",pct:85},{l:"Rating",v:"9.0",pct:90},{l:"Matches",v:"22",pct:88}], bio:"Netherlands' all-time leading scorer. A technical genius." },
  { id:"swiatek",    name:"Iga Świątek",    team:"Poland",            teamId:"",           country:"🇵🇱", position:"WTA World No. 1",  sport:"Tennis",     age:23, photo:"1554068865246-a166bf28903c", stats:[{l:"Titles",v:"21",pct:95},{l:"Slams",v:"4",pct:88},{l:"Win%",v:"89%",pct:89},{l:"Rank",v:"#1",pct:100}], bio:"Dominant WTA No. 1 with four Grand Slam titles. A generational champion." },
  { id:"gauff",      name:"Coco Gauff",                team:"USA",               teamId:"",           country:"🇺🇸", position:"WTA Top 5",        sport:"Tennis",     age:21, photo:"1545809074-59472b3f5ecc",   stats:[{l:"Titles",v:"9",pct:65},{l:"Slams",v:"1",pct:50},{l:"Win%",v:"72%",pct:72},{l:"Rank",v:"#3",pct:92}], bio:"US Open champion and the face of tennis's next generation." },
  { id:"clark",      name:"Caitlin Clark",             team:"Indiana Fever",     teamId:"indiana-fever",country:"🇺🇸", position:"Point Guard",   sport:"Basketball", age:22, photo:"1505666287802-ef5eed57f1b0", stats:[{l:"PPG",v:"20.4",pct:88},{l:"APG",v:"8.4",pct:92},{l:"RPG",v:"5.7",pct:68},{l:"FG%",v:"42%",pct:72}], bio:"Record-breaking WNBA guard who transformed women's basketball." },
  { id:"biles",      name:"Simone Biles",              team:"USA Gymnastics",    teamId:"",           country:"🇺🇸", position:"Gymnastics",      sport:"Gymnastics", age:27, photo:"1726195221456-7e104a23bbff", stats:[{l:"World Golds",v:"23",pct:99},{l:"Oly Golds",v:"7",pct:99},{l:"Medals",v:"37",pct:99},{l:"Score",v:"9.9",pct:99}], bio:"The greatest gymnast in history. 37 World Championship and Olympic medals." },
  { id:"mclaughlin", name:"Sydney McLaughlin-Levrone", team:"USA Athletics",     teamId:"",           country:"🇺🇸", position:"400m Hurdles",    sport:"Athletics",  age:25, photo:"1693825947617-5a75b4ef4f3c", stats:[{l:"World Record",v:"50.65s",pct:100},{l:"Oly Golds",v:"3",pct:90},{l:"WR Set",v:"4×",pct:100},{l:"Worlds",v:"4×",pct:90}], bio:"400m hurdles world record holder who has broken her own mark four times." },
]

interface Team { id:string; name:string; short:string; league:string; leagueId:string; country:string; color:string; founded:string; stadium:string; record:string; players:number; manager:string }
const ALL_TEAMS: Team[] = [
  { id:"barca-w",       name:"FC Barcelona Femení", short:"FCB", league:"Liga F",    leagueId:"ligaf", country:"🇪🇸", color:"#004D98", founded:"1988", stadium:"Estadi Johan Cruyff", record:"22W 2D 1L", players:25, manager:"Jonatan Giráldez" },
  { id:"chelsea-w",     name:"Chelsea FCW",              short:"CHE", league:"WSL",       leagueId:"wsl",   country:"🏴",           color:"#034694", founded:"1992", stadium:"Kingsmeadow",         record:"18W 3D 4L", players:25, manager:"Sonia Bompastor" },
  { id:"arsenal-w",     name:"Arsenal WFC",              short:"ARS", league:"WSL",       leagueId:"wsl",   country:"🏴",           color:"#EF0107", founded:"1987", stadium:"Meadow Park",         record:"16W 4D 5L", players:25, manager:"Jonas Eidevall" },
  { id:"lyon-w",        name:"Olympique Lyonnais F",     short:"OLL", league:"D1 Arkema", leagueId:"d1",    country:"🇫🇷", color:"#CF0F35", founded:"1970", stadium:"Groupama Stadium",    record:"20W 1D 2L", players:26, manager:"Joe Montemurro" },
  { id:"psg-w",         name:"Paris Saint-Germain F",    short:"PSG", league:"D1 Arkema", leagueId:"d1",    country:"🇫🇷", color:"#004170", founded:"1971", stadium:"Parc des Princes",    record:"18W 2D 3L", players:25, manager:"Jocelyn Prêcheur" },
  { id:"mancity-w",     name:"Manchester City W",        short:"MCW", league:"WSL",       leagueId:"wsl",   country:"🏴",           color:"#6CABDD", founded:"1988", stadium:"Joie Stadium",        record:"17W 4D 4L", players:24, manager:"Gareth Taylor" },
  { id:"vegas-aces",    name:"Las Vegas Aces",           short:"LVA", league:"WNBA",      leagueId:"wnba",  country:"🇺🇸", color:"#C3995B", founded:"1997", stadium:"Michelob ULTRA Arena", record:"26W 10L", players:12, manager:"Becky Hammon" },
  { id:"indiana-fever", name:"Indiana Fever",            short:"IND", league:"WNBA",      leagueId:"wnba",  country:"🇺🇸", color:"#E13A3E", founded:"2000", stadium:"Gainbridge Fieldhouse", record:"20W 16L", players:12, manager:"Christie Sides" },
  { id:"portland",      name:"Portland Thorns FC",       short:"PTH", league:"NWSL",      leagueId:"nwsl",  country:"🇺🇸", color:"#004812", founded:"2013", stadium:"Providence Park",     record:"15W 5D 6L", players:25, manager:"Mike Norris" },
]

const LIVE = [
  { id:1, home:"Arsenal W",      away:"Chelsea FCW",   score:"2–1",     time:"67′",   icon:"⚽", sport:"Football",   comp:"WSL",  compId:"wsl"  },
  { id:2, home:"Świątek", away:"Sabalenka",  score:"6–4 3–2", time:"Set 2", icon:"🎾", sport:"Tennis", comp:"WTA",  compId:"wta"  },
  { id:3, home:"Las Vegas Aces", away:"NY Liberty",    score:"78–82",   time:"Q3",    icon:"🏀", sport:"Basketball", comp:"WNBA", compId:"wnba" },
  { id:4, home:"Lyon F",         away:"PSG F",         score:"1–1",     time:"89′",   icon:"⚽", sport:"Football",   comp:"D1",   compId:"d1"   },
]
const BREAKING = [
  { id:1, tag:"Transfer",  sport:"Football",   accent:C.gold, headline:"Putellas signs historic Barça extension",   time:"4 min",  photo:"1629977007371-0ba395424741", article:"FC Barcelona confirmed today that Alexia Putellas has signed a landmark contract extension until 2027." },
  { id:2, tag:"Record",    sport:"Basketball", accent:C.pink, headline:"Clark breaks WNBA all-time assists record",  time:"11 min", photo:"1505666287802-ef5eed57f1b0", article:"Caitlin Clark rewrote history at Gainbridge Fieldhouse, surpassing the all-time WNBA assists record." },
  { id:3, tag:"Milestone", sport:"Gymnastics", accent:C.gold, headline:"Biles claims her 8th World Championship",   time:"38 min", photo:"1726195221456-7e104a23bbff", article:"Simone Biles soared to yet another world championship at Stuttgart." },
  { id:4, tag:"Match",     sport:"Football",   accent:C.pink, headline:"Kerr hat-trick sends Chelsea to UCL final", time:"1 hr",   photo:"1603291697926-7e5822ed1ac5", article:"Sam Kerr produced a masterclass to fire Chelsea FCW into the UEFA Women's Champions League final." },
]
const TRENDING = [
  { rank:1, name:"Alexia Putellas",         sport:"Football",   playerId:"putellas",   delta:"+4", dir:1  },
  { rank:2, name:"Iga Świątek",  sport:"Tennis",     playerId:"swiatek",    delta:"+1", dir:1  },
  { rank:3, name:"Caitlin Clark",           sport:"Basketball", playerId:"clark",      delta:"+6", dir:1  },
  { rank:4, name:"Simone Biles",            sport:"Gymnastics", playerId:"biles",      delta:"—",  dir:0  },
  { rank:5, name:"Sam Kerr",               sport:"Football",   playerId:"kerr",       delta:"+2", dir:1  },
  { rank:6, name:"Sydney McLaughlin",       sport:"Athletics",  playerId:"mclaughlin", delta:"–1", dir:-1 },
]
const COMMUNITY = [
  { id:1, av:"M", user:"Maria S.",    time:"2h", sport:"Football",   likes:1204, replies:67,  body:"Putellas' free kick in the 88th was one of the greatest goals ever seen from any player." },
  { id:2, av:"J", user:"Jennifer K.", time:"4h", sport:"Basketball", likes:2847, replies:134, body:"Caitlin Clark is transforming women's basketball globally. This is the moment." },
]
const NOTIFS = [
  { id:1, icon:"⚽", title:"Arsenal W score!",    body:"Miedema equalises — Arsenal 2–1 Chelsea", time:"Just now", unread:true  },
  { id:2, icon:"🎾", title:"Świątek wins Set 2", body:"She leads 6–4 6–2", time:"3 min", unread:true },
  { id:3, icon:"🏀", title:"Caitlin Clark update", body:"All-time assist record broken tonight", time:"18 min", unread:true },
  { id:4, icon:"⭐", title:"Putellas Ballon d'Or", body:"Voting officially opens for 2025", time:"1 hr", unread:false },
]
const SPORTS = ["All","Football","Tennis","Basketball","Athletics","Gymnastics"]

function PlayerSheet({ player, following, onToggle, onClose }: { player:Player; following:boolean; onToggle:()=>void; onClose:()=>void }) {
  return (
    <Sheet onClose={onClose} tall>
      <div style={{ position:"relative", height:"220px", margin:"0 16px 0", borderRadius:"24px", overflow:"hidden" }}>
        <img src={`https://images.unsplash.com/${player.photo}?w=600&h=480&fit=crop&auto=format`} alt={player.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,10,17,0.95) 0%, rgba(10,10,17,0.10) 60%)" }}/>
        <div style={{ position:"absolute", bottom:"18px", left:"18px", right:"18px", display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:"12px" }}>
          <div>
            <p style={{ fontFamily:UI, fontSize:"10px", fontWeight:600, color:C.sub, letterSpacing:"0.20em", textTransform:"uppercase", marginBottom:"5px" }}>{player.country} · {player.position}</p>
            <h2 style={{ fontFamily:DSP, fontSize:"24px", fontWeight:700, color:C.text, letterSpacing:"-0.01em", lineHeight:1.1 }}>{player.name}</h2>
          </div>
          <FollowBtn following={following} onToggle={onToggle} size="sm"/>
        </div>
      </div>
      <div style={{ padding:"20px 16px" }}>
        <div style={{ display:"flex", gap:"8px", marginBottom:"20px" }}>
          {[{icon:Users,v:player.team},{icon:Calendar,v:`Age ${player.age}`}].map(r=>(
            <div key={r.v} style={{ ...card, borderRadius:"12px", padding:"7px 12px", display:"flex", alignItems:"center", gap:"7px" }}>
              <r.icon size={12} color={C.muted}/><span style={{ fontFamily:UI, fontSize:"11px", color:C.sub }}>{r.v}</span>
            </div>
          ))}
        </div>
        <div style={{ ...card, borderRadius:"24px", padding:"20px", marginBottom:"14px" }}>
          <p style={{ fontFamily:UI, fontSize:"11px", fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:"16px" }}>Performance</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
            {player.stats.map((s,i)=>{
              const colors = [C.pink, C.gold, C.lav, "rgba(52,211,153,1)"]
              const col = colors[i % colors.length]
              return (
                <div key={s.l} style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                  <Ring pct={s.pct} color={col} size={44} stroke={4}/>
                  <div>
                    <p style={{ fontFamily:DSP, fontSize:"20px", fontWeight:700, color:C.text, letterSpacing:"-0.02em", lineHeight:1 }}>{s.v}</p>
                    <p style={{ fontFamily:UI, fontSize:"9px", fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.12em", marginTop:"3px" }}>{s.l}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div style={{ ...card, borderRadius:"20px", padding:"16px", marginBottom:"20px" }}>
          <p style={{ fontFamily:UI, fontSize:"13px", color:C.sub, lineHeight:1.72 }}>{player.bio}</p>
        </div>
        <FollowBtn following={following} onToggle={onToggle} size="lg"/>
        <div style={{ height:"28px" }}/>
      </div>
    </Sheet>
  )
}

function TeamSheet({ team, following, onToggle, onClose }: { team:Team; following:boolean; onToggle:()=>void; onClose:()=>void }) {
  return (
    <Sheet onClose={onClose}>
      <div style={{ padding:"8px 16px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"22px" }}>
          <div style={{ width:"62px", height:"62px", borderRadius:"18px", background:`linear-gradient(145deg, ${team.color} 0%, ${shadeColor(team.color,-28)} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 8px 28px ${team.color}55`, flexShrink:0 }}>
            <span style={{ fontFamily:UI, fontSize:"17px", fontWeight:800, color:"white" }}>{team.short}</span>
          </div>
          <div style={{ flex:1 }}>
            <h2 style={{ fontFamily:DSP, fontSize:"20px", fontWeight:700, color:C.text, letterSpacing:"-0.01em", lineHeight:1.15 }}>{team.name}</h2>
            <p style={{ fontFamily:UI, fontSize:"11px", color:C.sub, marginTop:"3px" }}>{team.country} · {team.league}</p>
          </div>
          <FollowBtn following={following} onToggle={onToggle} size="sm"/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px", marginBottom:"14px" }}>
          {[["Record",team.record],[`${team.players}`,"Players"],["Est.",team.founded]].map(([v,l])=>(
            <div key={l} style={{ ...card, borderRadius:"18px", padding:"14px", textAlign:"center" }}>
              <p style={{ fontFamily:DSP, fontSize:"18px", fontWeight:700, color:C.text, letterSpacing:"-0.02em" }}>{v}</p>
              <p style={{ fontFamily:UI, fontSize:"9px", color:C.muted, textTransform:"uppercase", letterSpacing:"0.12em", marginTop:"4px" }}>{l}</p>
            </div>
          ))}
        </div>
        <div style={{ ...card, borderRadius:"20px", padding:"16px", marginBottom:"20px" }}>
          {[{icon:MapPin,l:"Stadium",v:team.stadium},{icon:Users,l:"Manager",v:team.manager}].map(r=>(
            <div key={r.l} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"6px 0" }}>
              <r.icon size={13} color={C.muted}/><span style={{ fontFamily:UI, fontSize:"11px", color:C.muted, width:"60px" }}>{r.l}</span><span style={{ fontFamily:UI, fontSize:"11px", color:C.sub }}>{r.v}</span>
            </div>
          ))}
        </div>
        <FollowBtn following={following} onToggle={onToggle} size="lg"/>
        <div style={{ height:"28px" }}/>
      </div>
    </Sheet>
  )
}

function ArticleSheet({ item, onClose }: { item:typeof BREAKING[0]; onClose:()=>void }) {
  return (
    <Sheet onClose={onClose} tall>
      <div style={{ position:"relative", height:"200px", margin:"0 16px", borderRadius:"24px", overflow:"hidden" }}>
        <img src={`https://images.unsplash.com/${item.photo}?w=600&h=400&fit=crop&auto=format`} alt={item.headline} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,10,17,0.90) 0%, rgba(10,10,17,0.10) 60%)" }}/>
        <div style={{ position:"absolute", bottom:"14px", left:"14px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", borderRadius:"999px", padding:"3px 10px", background:`${item.accent}22`, border:`1px solid ${item.accent}44` }}>
            <span style={{ fontFamily:UI, color:item.accent, fontSize:"9px", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" }}>{item.tag}</span>
          </div>
        </div>
      </div>
      <div style={{ padding:"20px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"12px" }}>
          <Clock size={11} color={C.dim}/><span style={{ fontFamily:UI, fontSize:"10px", color:C.dim }}>{item.time} ago · {item.sport}</span>
        </div>
        <h2 style={{ fontFamily:DSP, fontSize:"21px", fontWeight:700, color:C.text, lineHeight:1.24, letterSpacing:"-0.01em", marginBottom:"18px" }}>{item.headline}</h2>
        <p style={{ fontFamily:UI, fontSize:"13px", color:C.sub, lineHeight:1.76 }}>{item.article}</p>
        <div style={{ height:"24px" }}/>
      </div>
    </Sheet>
  )
}

function CompSheet({ comp, onClose }: { comp:Competition; onClose:()=>void }) {
  const teams = ALL_TEAMS.filter(t=>t.leagueId===comp.id)
  return (
    <Sheet onClose={onClose} tall>
      <div style={{ padding:"8px 16px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"20px" }}>
          <CompBadge comp={comp} size={56}/>
          <div>
            <h2 style={{ fontFamily:DSP, fontSize:"19px", fontWeight:700, color:C.text, letterSpacing:"-0.01em", lineHeight:1.2 }}>{comp.name}</h2>
            <p style={{ fontFamily:UI, fontSize:"11px", color:C.sub, marginTop:"3px" }}>{comp.country} · {comp.sport}</p>
          </div>
        </div>
        <div style={{ ...card, borderRadius:"20px", padding:"16px", marginBottom:"16px" }}>
          <p style={{ fontFamily:UI, fontSize:"13px", color:C.sub, lineHeight:1.72 }}>{comp.desc}</p>
        </div>
        {teams.length>0 && (
          <>
            <p style={{ fontFamily:UI, fontSize:"11px", fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:"10px" }}>Clubs</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {teams.map(t=>(
                <div key={t.id} style={{ ...card, borderRadius:"16px", padding:"12px 14px", display:"flex", alignItems:"center", gap:"12px" }}>
                  <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:`linear-gradient(135deg,${t.color},${shadeColor(t.color,-28)})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontFamily:UI, fontSize:"11px", fontWeight:800, color:"white" }}>{t.short}</span>
                  </div>
                  <div><p style={{ fontFamily:UI, fontSize:"12px", fontWeight:600, color:C.text }}>{t.name}</p><p style={{ fontFamily:UI, fontSize:"10px", color:C.sub }}>{t.record}</p></div>
                </div>
              ))}
            </div>
          </>
        )}
        <div style={{ height:"28px" }}/>
      </div>
    </Sheet>
  )
}

function MatchSheet({ match, onClose }: { match:typeof LIVE[0]; onClose:()=>void }) {
  return (
    <Sheet onClose={onClose}>
      <div style={{ padding:"0 16px 24px" }}>
        <div style={{ textAlign:"center", padding:"10px 0 20px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"16px" }}>
            <Dot/><span style={{ fontFamily:UI, fontSize:"10px", fontWeight:700, color:C.pink, letterSpacing:"0.14em" }}>LIVE — {match.comp}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"20px" }}>
            {[match.home, match.away].map((side,i)=>(
              <div key={i} style={{ textAlign:"center", flex:1 }}>
                <div style={{ width:"52px", height:"52px", borderRadius:"14px", ...card, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px", fontSize:"24px" }}>{match.icon}</div>
                <p style={{ fontFamily:UI, fontSize:"12px", fontWeight:600, color:C.text }}>{side}</p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily:DSP, fontSize:"38px", fontWeight:700, color:C.text, letterSpacing:"-0.03em", marginTop:"16px" }}>{match.score}</p>
          <p style={{ fontFamily:UI, fontSize:"12px", color:C.pink, fontWeight:600, marginTop:"4px" }}>{match.time}</p>
        </div>
      </div>
    </Sheet>
  )
}

function NotifsPanel({ onClose }: { onClose:()=>void }) {
  return (
    <motion.div
      initial={{ y:"-100%", opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:"-100%", opacity:0 }} transition={sp.sheet}
      style={{ position:"absolute", top:0, left:0, right:0, zIndex:60, ...glassSheet, borderRadius:"0 0 32px 32px", border:"1px solid rgba(255,255,255,0.09)", borderTop:"none", paddingTop:"72px" }}
    >
      <div style={{ padding:"0 16px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"18px" }}>
          <h2 style={{ fontFamily:DSP, fontSize:"22px", fontWeight:700, color:C.text }}>Notifications</h2>
          <motion.button whileTap={{scale:0.86}} onClick={onClose} style={{ width:"30px", height:"30px", borderRadius:"50%", ...card, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <X size={13} color={C.sub}/>
          </motion.button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {NOTIFS.map(n=>(
            <Press key={n.id}>
              <div style={{ borderRadius:"18px", padding:"13px 14px", display:"flex", alignItems:"center", gap:"12px", background:n.unread?`rgba(255,0,128,0.07)`:`rgba(255,255,255,0.03)`, border:`1px solid ${n.unread?`rgba(255,0,128,0.16)`:`rgba(255,255,255,0.06)`}` }}>
                <div style={{ width:"40px", height:"40px", borderRadius:"12px", ...card, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", flexShrink:0 }}>{n.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2px" }}>
                    <p style={{ fontFamily:UI, fontSize:"12px", fontWeight:700, color:C.text }}>{n.title}</p>
                    <span style={{ fontFamily:UI, fontSize:"9px", color:C.muted }}>{n.time}</span>
                  </div>
                  <p style={{ fontFamily:UI, fontSize:"11px", color:C.sub }}>{n.body}</p>
                </div>
                {n.unread && <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:C.pink, flexShrink:0 }}/>}
              </div>
            </Press>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function HomeScreen({ followedPlayers, followedTeams, onOpenPlayer, onOpenTeam, onOpenArticle, onOpenMatch, liked, setLiked, activeSport }: {
  followedPlayers:Set<string>; followedTeams:Set<string>;
  onOpenPlayer:(p:Player)=>void; onOpenTeam:(t:Team)=>void;
  onOpenArticle:(a:typeof BREAKING[0])=>void; onOpenMatch:(m:typeof LIVE[0])=>void;
  liked:Record<number,boolean>; setLiked:React.Dispatch<React.SetStateAction<Record<number,boolean>>>;
  activeSport:string;
}) {
  const [showAll, setShowAll] = useState(false)
  const flt = <T extends {sport?:string}>(arr:T[]) => activeSport==="All" ? arr : arr.filter(x=>x.sport===activeSport)
  const breaking  = flt(BREAKING)
  const liveMat   = flt(LIVE as any) as typeof LIVE
  const trending  = flt(TRENDING as any) as typeof TRENDING
  const community = flt(COMMUNITY as any) as typeof COMMUNITY
  const myPlayers = ALL_PLAYERS.filter(p=>followedPlayers.has(p.id))
  const myTeams   = ALL_TEAMS.filter(t=>followedTeams.has(t.id))
  return (
    <div style={{ padding:"0 16px 24px", display:"flex", flexDirection:"column", gap:"28px" }}>
      <AnimatePresence>
        {(myPlayers.length>0||myTeams.length>0) && (
          <motion.div key="following" initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={sp.gentle} style={{ overflow:"hidden" }}>
            <SH title="Following"/>
            <div style={{ display:"flex", gap:"12px", overflowX:"auto", scrollbarWidth:"none", paddingBottom:"2px" }}>
              {myPlayers.map(p=>(
                <Press key={p.id} onTap={()=>onOpenPlayer(p)} style={{ flexShrink:0, textAlign:"center" as const }}>
                  <div style={{ width:"58px", height:"58px", borderRadius:"50%", overflow:"hidden", border:`2.5px solid ${C.pink}`, marginBottom:"7px", boxShadow:`0 0 20px rgba(255,0,128,0.35)` }}>
                    <img src={`https://images.unsplash.com/${p.photo}?w=120&h=120&fit=crop&auto=format`} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                  </div>
                  <p style={{ fontFamily:UI, fontSize:"9px", fontWeight:600, color:C.sub, whiteSpace:"nowrap" }}>{p.name.split(" ")[0]}</p>
                </Press>
              ))}
              {myTeams.map(t=>(
                <Press key={t.id} onTap={()=>onOpenTeam(t)} style={{ flexShrink:0, textAlign:"center" as const }}>
                  <div style={{ width:"58px", height:"58px", borderRadius:"16px", background:`linear-gradient(135deg, ${t.color}, ${shadeColor(t.color,-28)})`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"7px", boxShadow:`0 0 20px ${t.color}44` }}>
                    <span style={{ fontFamily:UI, fontSize:"14px", fontWeight:800, color:"white" }}>{t.short}</span>
                  </div>
                  <p style={{ fontFamily:UI, fontSize:"9px", fontWeight:600, color:C.sub, whiteSpace:"nowrap" }}>{t.short}</p>
                </Press>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Press onTap={()=>onOpenArticle(BREAKING[3])}>
        <div style={{ position:"relative", borderRadius:"32px", overflow:"hidden", height:"320px" }}>
          <img src="https://images.unsplash.com/photo-1603291697926-7e5822ed1ac5?w=800&h=700&fit=crop&auto=format" alt="Women's football" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(9,9,15,0.96) 0%, rgba(9,9,15,0.38) 50%, rgba(9,9,15,0.06) 100%)" }}/>
          <div style={{ position:"absolute", top:"18px", left:"18px", display:"flex", alignItems:"center", gap:"7px", borderRadius:"999px", padding:"5px 12px", background:"rgba(255,0,128,0.20)", border:"1px solid rgba(255,0,128,0.38)", backdropFilter:"blur(12px)" }}>
            <Dot size={6}/><span style={{ fontFamily:UI, fontSize:"9px", fontWeight:700, color:"white", letterSpacing:"0.12em" }}>LIVE</span>
          </div>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"22px" }}>
            <p style={{ fontFamily:UI, fontSize:"10px", fontWeight:700, color:C.pink, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:"8px" }}>Featured</p>
            <h1 style={{ fontFamily:DSP, fontSize:"24px", fontWeight:700, color:"white", lineHeight:1.2, marginBottom:"12px" }}>Kerr hat-trick sends Chelsea into UCL final</h1>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <Clock size={10} color="rgba(255,255,255,0.38)"/>
              <span style={{ fontFamily:UI, fontSize:"11px", color:"rgba(255,255,255,0.44)" }}>1 hr ago · Football</span>
            </div>
          </div>
        </div>
      </Press>
      {liveMat.length>0 && (
        <div>
          <SH title="Live Now" sub={`${liveMat.length} matches in progress`}/>
          <div style={{ display:"flex", gap:"10px", overflowX:"auto", scrollbarWidth:"none", marginRight:"-16px", paddingRight:"16px" }}>
            {liveMat.map(m=>(
              <Press key={m.id} onTap={()=>onOpenMatch(m)} style={{ flexShrink:0 }}>
                <div style={{ ...cardPink, borderRadius:"24px", padding:"16px 18px", minWidth:"175px" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
                    <span style={{ fontSize:"18px" }}>{m.icon}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                      <Dot size={5}/><span style={{ fontFamily:UI, fontSize:"9px", fontWeight:700, color:C.pink }}>{m.time}</span>
                    </div>
                  </div>
                  <p style={{ fontFamily:UI, fontSize:"11px", color:C.sub, marginBottom:"3px" }}>{m.home}</p>
                  <p style={{ fontFamily:UI, fontSize:"11px", color:C.sub, marginBottom:"12px" }}>{m.away}</p>
                  <p style={{ fontFamily:DSP, fontSize:"24px", fontWeight:700, color:C.text, letterSpacing:"-0.02em", lineHeight:1 }}>{m.score}</p>
                  <p style={{ fontFamily:UI, fontSize:"9px", fontWeight:700, color:C.dim, letterSpacing:"0.10em", textTransform:"uppercase", marginTop:"6px" }}>{m.comp}</p>
                </div>
              </Press>
            ))}
          </div>
        </div>
      )}
      {breaking.length>0 && (
        <div>
          <SH title="Breaking"/>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {breaking.map(item=>(
              <Press key={item.id} onTap={()=>onOpenArticle(item)}>
                <div style={{ ...card, borderRadius:"24px", overflow:"hidden", display:"flex", height:"108px" }}>
                  <div style={{ width:"110px", height:"108px", flexShrink:0 }}>
                    <img src={`https://images.unsplash.com/${item.photo}?w=260&h=220&fit=crop&auto=format`} alt={item.headline} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                  </div>
                  <div style={{ flex:1, padding:"14px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ display:"inline-flex", borderRadius:"999px", padding:"2px 8px", background:`${item.accent}18`, border:`1px solid ${item.accent}38`, marginBottom:"6px" }}>
                        <span style={{ fontFamily:UI, color:item.accent, fontSize:"8px", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" }}>{item.tag}</span>
                      </div>
                      <p style={{ fontFamily:UI, fontSize:"12px", fontWeight:600, color:C.text, lineHeight:1.38 }}>{item.headline}</p>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                      <Clock size={9} color={C.dim}/><span style={{ fontFamily:UI, fontSize:"9px", color:C.dim }}>{item.time} ago</span>
                    </div>
                  </div>
                </div>
              </Press>
            ))}
          </div>
        </div>
      )}
      {trending.length>0 && (
        <div>
          <SH title="Trending" onSeeAll={()=>setShowAll(v=>!v)}/>
          <div style={{ ...card, borderRadius:"24px", overflow:"hidden" }}>
            <AnimatePresence initial={false}>
              {(showAll ? trending : trending.slice(0,4)).map((a,i,arr)=>{
                const p = ALL_PLAYERS.find(x=>x.id===a.playerId)
                const dc = a.dir>0?"#4ade80":a.dir<0?"#f87171":C.dim
                return (
                  <motion.div key={a.rank} layout transition={sp.default}>
                    <Press onTap={()=>p && onOpenPlayer(p)}>
                      <div style={{ display:"flex", alignItems:"center", padding:"13px 18px", gap:"14px" }}>
                        <span style={{ fontFamily:DSP, fontSize:"28px", fontWeight:700, color:a.rank===1?C.gold:a.rank<=3?C.text:C.dim, letterSpacing:"-0.03em", width:"36px", lineHeight:1, flexShrink:0 }}>{a.rank}</span>
                        <div style={{ flex:1 }}>
                          <p style={{ fontFamily:UI, fontSize:"13px", fontWeight:600, color:C.text }}>{a.name}</p>
                          <p style={{ fontFamily:UI, fontSize:"10px", color:C.muted, marginTop:"1px" }}>{a.sport}</p>
                        </div>
                        <span style={{ fontFamily:MONO, fontSize:"12px", fontWeight:500, color:dc }}>{a.delta}</span>
                      </div>
                    </Press>
                    {i<arr.length-1 && <div style={{ height:"1px", background:C.border, margin:"0 18px" }}/>}
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {trending.length>4 && (
              <Press onTap={()=>setShowAll(v=>!v)}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"5px", padding:"13px 18px", borderTop:`1px solid ${C.border}` }}>
                  <span style={{ fontFamily:UI, fontSize:"12px", fontWeight:600, color:C.pink }}>{showAll?"Show less":"Show all"}</span>
                  <motion.span animate={{rotate:showAll?180:0}} transition={sp.default}><ChevronUp size={13} color={C.pink}/></motion.span>
                </div>
              </Press>
            )}
          </div>
        </div>
      )}
      <div style={{ ...cardGold, borderRadius:"28px", padding:"20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"14px" }}>
          <Orb size={42}/>
          <div>
            <p style={{ fontFamily:UI, fontSize:"9px", fontWeight:700, color:C.gold, letterSpacing:"0.22em", textTransform:"uppercase" }}>Fanissima AI</p>
            <p style={{ fontFamily:UI, fontSize:"12px", color:C.sub, marginTop:"2px" }}>Stat of the day</p>
          </div>
        </div>
        <p style={{ fontFamily:DSP, fontSize:"16px", fontStyle:"italic", color:C.text, lineHeight:1.68 }}>"Putellas has created a chance every 23 minutes in UCL group play — the highest rate of any player in the competition."</p>
      </div>
      {community.length>0 && (
        <div>
          <SH title="Community"/>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {community.map(post=>(
              <div key={post.id} style={{ ...card, borderRadius:"24px", padding:"18px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"11px", marginBottom:"13px" }}>
                  <div style={{ width:"34px", height:"34px", borderRadius:"50%", flexShrink:0, background:"linear-gradient(135deg,rgba(255,0,128,0.52),rgba(167,139,250,0.52))", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:UI, fontSize:"13px", fontWeight:700, color:"white" }}>{post.av}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:UI, fontSize:"12px", fontWeight:700, color:C.text }}>{post.user}</p>
                    <p style={{ fontFamily:UI, fontSize:"10px", color:C.muted }}>{post.time} · {post.sport}</p>
                  </div>
                </div>
                <p style={{ fontFamily:UI, fontSize:"13px", color:C.sub, lineHeight:1.70, marginBottom:"14px" }}>{post.body}</p>
                <div style={{ display:"flex", alignItems:"center", gap:"22px", paddingTop:"13px", borderTop:`1px solid ${C.border}` }}>
                  <motion.button whileTap={{scale:0.82}} transition={sp.snappy} onClick={()=>setLiked(p=>({...p,[post.id]:!p[post.id]}))} style={{ display:"flex", alignItems:"center", gap:"6px", fontFamily:UI, color:liked[post.id]?C.pink:C.muted, fontSize:"11px", fontWeight:600 }}>
                    <motion.span animate={{scale:liked[post.id]?[1,1.45,1]:1}} transition={sp.bounce}><Heart size={14} fill={liked[post.id]?C.pink:"none"}/></motion.span>
                    {liked[post.id]?post.likes+1:post.likes}
                  </motion.button>
                  <motion.button whileTap={{scale:0.86}} style={{ display:"flex", alignItems:"center", gap:"6px", fontFamily:UI, color:C.muted, fontSize:"11px", fontWeight:600 }}><MessageCircle size={14}/>{post.replies}</motion.button>
                  <motion.button whileTap={{scale:0.86}} style={{ display:"flex", alignItems:"center", gap:"6px", fontFamily:UI, color:C.muted, marginLeft:"auto" }}><Share2 size={14}/></motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DiscoverScreen({ followedPlayers, followedTeams, onTogglePlayer, onToggleTeam, onOpenPlayer, onOpenTeam, onOpenComp }: {
  followedPlayers:Set<string>; followedTeams:Set<string>;
  onTogglePlayer:(id:string)=>void; onToggleTeam:(id:string)=>void;
  onOpenPlayer:(p:Player)=>void; onOpenTeam:(t:Team)=>void; onOpenComp:(c:Competition)=>void;
}) {
  const [q, setQ] = useState("")
  const [tab, setTab] = useState<"players"|"teams"|"competitions">("players")
  const fps = useMemo(()=>ALL_PLAYERS.filter(p=>!q||[p.name,p.team,p.sport].some(v=>v.toLowerCase().includes(q.toLowerCase()))),[q])
  const fts = useMemo(()=>ALL_TEAMS.filter(t=>!q||[t.name,t.league].some(v=>v.toLowerCase().includes(q.toLowerCase()))),[q])
  const fcs = useMemo(()=>COMPETITIONS.filter(c=>!q||[c.name,c.sport].some(v=>v.toLowerCase().includes(q.toLowerCase()))),[q])
  return (
    <div style={{ padding:"0 16px" }}>
      <div style={{ ...glassNav, borderRadius:"18px", display:"flex", alignItems:"center", gap:"10px", padding:"12px 16px", marginBottom:"16px" }}>
        <Search size={15} color={C.muted}/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search players, teams, competitions…" style={{ flex:1, background:"none", border:"none", outline:"none", fontFamily:UI, fontSize:"13px", color:C.text }}/>
        <AnimatePresence>
          {q && <motion.button key="clr" initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}} transition={sp.snappy} onClick={()=>setQ("")}><X size={14} color={C.muted}/></motion.button>}
        </AnimatePresence>
      </div>
      <div style={{ ...card, borderRadius:"16px", padding:"4px", display:"flex", marginBottom:"20px" }}>
        {(["players","teams","competitions"] as const).map(t=>(
          <motion.button key={t} whileTap={{scale:0.95}} onClick={()=>setTab(t)} style={{ flex:1, padding:"9px 0", borderRadius:"12px", fontFamily:UI, fontSize:"11px", fontWeight:700, textTransform:"capitalize", background:tab===t?C.pink:"transparent", color:tab===t?"white":C.sub, border:"none", position:"relative" }}>
            {tab===t && <motion.div layoutId="seg" style={{ position:"absolute", inset:0, background:C.pink, borderRadius:"12px", zIndex:-1, boxShadow:"0 4px 16px rgba(255,0,128,0.30)" }} transition={sp.bounce}/>}
            {t}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {tab==="players" && (
          <motion.div key="players" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={sp.default} style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {fps.map(p=>(
              <Press key={p.id} onTap={()=>onOpenPlayer(p)}>
                <div style={{ ...card, borderRadius:"20px", padding:"14px 16px", display:"flex", alignItems:"center", gap:"13px" }}>
                  <div style={{ width:"46px", height:"46px", borderRadius:"50%", overflow:"hidden", flexShrink:0, border:`1.5px solid ${C.border}` }}>
                    <img src={`https://images.unsplash.com/${p.photo}?w=100&h=100&fit=crop&auto=format`} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontFamily:UI, fontSize:"13px", fontWeight:700, color:C.text }}>{p.name}</p>
                    <p style={{ fontFamily:UI, fontSize:"10px", color:C.sub, marginTop:"1px" }}>{p.country} · {p.team}</p>
                    <div style={{ display:"flex", gap:"12px", marginTop:"5px" }}>
                      {p.stats.slice(0,2).map(s=>(
                        <div key={s.l} style={{ display:"flex", alignItems:"center", gap:"3px" }}>
                          <span style={{ fontFamily:MONO, fontSize:"11px", fontWeight:500, color:C.pink }}>{s.v}</span>
                          <span style={{ fontFamily:UI, fontSize:"9px", color:C.muted }}>{s.l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <FollowBtn following={followedPlayers.has(p.id)} onToggle={()=>onTogglePlayer(p.id)} size="sm"/>
                </div>
              </Press>
            ))}
          </motion.div>
        )}
        {tab==="teams" && (
          <motion.div key="teams" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={sp.default} style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {fts.map(t=>(
              <Press key={t.id} onTap={()=>onOpenTeam(t)}>
                <div style={{ ...card, borderRadius:"20px", padding:"14px 16px", display:"flex", alignItems:"center", gap:"13px" }}>
                  <div style={{ width:"46px", height:"46px", borderRadius:"14px", flexShrink:0, background:`linear-gradient(145deg,${t.color},${shadeColor(t.color,-28)})`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 18px ${t.color}44` }}>
                    <span style={{ fontFamily:UI, fontSize:"12px", fontWeight:800, color:"white" }}>{t.short}</span>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:UI, fontSize:"13px", fontWeight:700, color:C.text }}>{t.name}</p>
                    <p style={{ fontFamily:UI, fontSize:"10px", color:C.sub, marginTop:"1px" }}>{t.country} · {t.league}</p>
                    <p style={{ fontFamily:MONO, fontSize:"10px", color:C.muted, marginTop:"2px" }}>{t.record}</p>
                  </div>
                  <FollowBtn following={followedTeams.has(t.id)} onToggle={()=>onToggleTeam(t.id)} size="sm"/>
                </div>
              </Press>
            ))}
          </motion.div>
        )}
        {tab==="competitions" && (
          <motion.div key="comps" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={sp.default} style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {fcs.map(c=>(
              <Press key={c.id} onTap={()=>onOpenComp(c)}>
                <div style={{ ...card, borderRadius:"20px", padding:"14px 16px", display:"flex", alignItems:"center", gap:"14px" }}>
                  <CompBadge comp={c} size={50}/>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:UI, fontSize:"13px", fontWeight:700, color:C.text }}>{c.name}</p>
                    <p style={{ fontFamily:UI, fontSize:"10px", color:C.sub, marginTop:"2px" }}>{c.country} · {c.sport}</p>
                    {c.teams>0 && <p style={{ fontFamily:UI, fontSize:"10px", color:C.muted, marginTop:"1px" }}>{c.teams} teams</p>}
                  </div>
                  <ChevronRight size={14} color={C.dim}/>
                </div>
              </Press>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ height:"24px" }}/>
    </div>
  )
}

function LiveScreen({ onOpenMatch, onOpenComp }: { onOpenMatch:(m:typeof LIVE[0])=>void; onOpenComp:(c:Competition)=>void }) {
  const groups = [
    { comp:COMPETITIONS[0], matches:[LIVE[0],{...LIVE[3],id:5,comp:"UWCL",compId:"uwcl"}] },
    { comp:COMPETITIONS[5], matches:[LIVE[2],{id:6,home:"Indiana Fever",away:"Chicago Sky",score:"64–71",time:"Q4",icon:"🏀",sport:"Basketball",comp:"WNBA",compId:"wnba"}] },
    { comp:COMPETITIONS[6], matches:[LIVE[1],{id:7,home:"Gauff",away:"Jabeur",score:"7–5 2–1",time:"Set 2",icon:"🎾",sport:"Tennis",comp:"WTA",compId:"wta"}] },
  ]
  return (
    <div style={{ padding:"0 16px 24px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"22px" }}>
        <Dot/><span style={{ fontFamily:UI, fontSize:"14px", fontWeight:700, color:C.text }}>7 matches live now</span>
      </div>
      {groups.map(g=>(
        <div key={g.comp.id} style={{ marginBottom:"26px" }}>
          <Press onTap={()=>onOpenComp(g.comp)}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"12px" }}>
              <CompBadge comp={g.comp} size={38}/>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:UI, fontSize:"13px", fontWeight:700, color:C.text }}>{g.comp.name}</p>
                <p style={{ fontFamily:UI, fontSize:"9px", color:C.sub }}>{g.comp.sport} · {g.comp.country}</p>
              </div>
              <ChevronRight size={13} color={C.dim}/>
            </div>
          </Press>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {g.matches.map((m,i)=>(
              <Press key={i} onTap={()=>onOpenMatch(m as any)}>
                <div style={{ ...card, borderRadius:"20px", padding:"14px 16px", display:"flex", alignItems:"center", gap:"10px", borderLeft:`2.5px solid ${g.comp.primary}` }}>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:UI, fontSize:"11px", fontWeight:500, color:C.sub, marginBottom:"3px" }}>{m.home}</p>
                    <p style={{ fontFamily:UI, fontSize:"11px", fontWeight:500, color:C.sub }}>{m.away}</p>
                  </div>
                  <p style={{ fontFamily:DSP, fontSize:"20px", fontWeight:700, color:C.text }}>{m.score}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:"5px", background:"rgba(255,0,128,0.10)", border:"1px solid rgba(255,0,128,0.22)", borderRadius:"10px", padding:"4px 9px" }}>
                    <Dot size={5}/><span style={{ fontFamily:UI, color:C.pink, fontSize:"10px", fontWeight:700 }}>{m.time}</span>
                  </div>
                </div>
              </Press>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MeScreen({ followedPlayers, followedTeams, onOpenPlayer, onOpenTeam, onTogglePlayer, onToggleTeam }: {
  followedPlayers:Set<string>; followedTeams:Set<string>;
  onOpenPlayer:(p:Player)=>void; onOpenTeam:(t:Team)=>void;
  onTogglePlayer:(id:string)=>void; onToggleTeam:(id:string)=>void;
}) {
  const myPlayers = ALL_PLAYERS.filter(p=>followedPlayers.has(p.id))
  const myTeams   = ALL_TEAMS.filter(t=>followedTeams.has(t.id))
  return (
    <div style={{ padding:"0 16px 24px", display:"flex", flexDirection:"column", gap:"24px" }}>
      <div style={{ ...card, borderRadius:"28px", padding:"22px", display:"flex", alignItems:"center", gap:"16px" }}>
        <div style={{ width:"60px", height:"60px", borderRadius:"50%", background:"linear-gradient(135deg,#FF0080,#A78BFA)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:UI, fontSize:"22px", fontWeight:700, color:"white", boxShadow:"0 6px 28px rgba(255,0,128,0.40)", flexShrink:0 }}>A</div>
        <div style={{ flex:1 }}>
          <h2 style={{ fontFamily:DSP, fontSize:"20px", fontWeight:700, color:C.text }}>Your Profile</h2>
          <p style={{ fontFamily:UI, fontSize:"11px", color:C.sub, marginTop:"3px" }}>{followedPlayers.size} players · {followedTeams.size} teams followed</p>
        </div>
      </div>
      {(followedPlayers.size+followedTeams.size)>0 && (
        <div style={{ ...card, borderRadius:"24px", padding:"20px" }}>
          <p style={{ fontFamily:UI, fontSize:"11px", fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:"16px" }}>Activity</p>
          <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
            <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Ring pct={Math.min(100,(followedPlayers.size/ALL_PLAYERS.length)*100*3)} color={C.pink} size={72} stroke={6}/>
              <div style={{ position:"absolute", textAlign:"center" }}>
                <p style={{ fontFamily:DSP, fontSize:"20px", fontWeight:700, color:C.text, lineHeight:1 }}>{followedPlayers.size}</p>
              </div>
            </div>
            <div>
              <p style={{ fontFamily:UI, fontSize:"13px", fontWeight:700, color:C.text }}>Players followed</p>
              <p style={{ fontFamily:UI, fontSize:"11px", color:C.sub, marginTop:"2px" }}>{ALL_PLAYERS.length} available</p>
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {myPlayers.length>0 && (
          <motion.div key="fp" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={sp.gentle}>
            <SH title="Followed Players"/>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {myPlayers.map(p=>(
                <Press key={p.id} onTap={()=>onOpenPlayer(p)}>
                  <div style={{ ...card, borderRadius:"20px", padding:"13px 16px", display:"flex", alignItems:"center", gap:"12px" }}>
                    <div style={{ width:"40px", height:"40px", borderRadius:"50%", overflow:"hidden", flexShrink:0 }}>
                      <img src={`https://images.unsplash.com/${p.photo}?w=80&h=80&fit=crop&auto=format`} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontFamily:UI, fontSize:"12px", fontWeight:700, color:C.text }}>{p.name}</p>
                      <p style={{ fontFamily:UI, fontSize:"10px", color:C.sub }}>{p.sport} · {p.team}</p>
                    </div>
                    <motion.button whileTap={{scale:0.90}} onClick={e=>{e.stopPropagation();onTogglePlayer(p.id)}} style={{ fontFamily:UI, fontSize:"10px", fontWeight:600, color:C.muted, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"5px 12px", background:"transparent" }}>Unfollow</motion.button>
                  </div>
                </Press>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {myTeams.length>0 && (
          <motion.div key="ft" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={sp.gentle}>
            <SH title="Followed Teams"/>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {myTeams.map(t=>(
                <Press key={t.id} onTap={()=>onOpenTeam(t)}>
                  <div style={{ ...card, borderRadius:"20px", padding:"13px 16px", display:"flex", alignItems:"center", gap:"12px" }}>
                    <div style={{ width:"40px", height:"40px", borderRadius:"12px", flexShrink:0, background:`linear-gradient(145deg,${t.color},${shadeColor(t.color,-28)})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontFamily:UI, fontSize:"12px", fontWeight:800, color:"white" }}>{t.short}</span>
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontFamily:UI, fontSize:"12px", fontWeight:700, color:C.text }}>{t.name}</p>
                      <p style={{ fontFamily:UI, fontSize:"10px", color:C.sub }}>{t.league} · {t.record}</p>
                    </div>
                    <motion.button whileTap={{scale:0.90}} onClick={e=>{e.stopPropagation();onToggleTeam(t.id)}} style={{ fontFamily:UI, fontSize:"10px", fontWeight:600, color:C.muted, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"5px 12px", background:"transparent" }}>Unfollow</motion.button>
                  </div>
                </Press>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {myPlayers.length===0 && myTeams.length===0 && (
        <div style={{ textAlign:"center", padding:"48px 0" }}>
          <p style={{ fontFamily:DSP, fontSize:"48px", fontStyle:"italic", fontWeight:400, color:C.dim, marginBottom:"14px" }}>Nothing yet</p>
          <p style={{ fontFamily:UI, fontSize:"13px", color:C.muted }}>Follow players and teams in Discover to build your feed.</p>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [activeTab,       setActiveTab]       = useState("home")
  const [activeSport,     setActiveSport]     = useState("All")
  const [followedPlayers, setFollowedPlayers] = useState<Set<string>>(new Set())
  const [followedTeams,   setFollowedTeams]   = useState<Set<string>>(new Set())
  const [liked,           setLiked]           = useState<Record<number,boolean>>({})
  const [selectedPlayer,  setSelectedPlayer]  = useState<Player|null>(null)
  const [selectedTeam,    setSelectedTeam]    = useState<Team|null>(null)
  const [selectedArticle, setSelectedArticle] = useState<typeof BREAKING[0]|null>(null)
  const [selectedComp,    setSelectedComp]    = useState<Competition|null>(null)
  const [selectedMatch,   setSelectedMatch]   = useState<typeof LIVE[0]|null>(null)
  const [showNotifs,      setShowNotifs]      = useState(false)

  const togglePlayer = useCallback((id:string)=>setFollowedPlayers(s=>{ const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n }),[])
  const toggleTeam   = useCallback((id:string)=>setFollowedTeams(s=>{ const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n }),[])
  const closeAll = () => { setSelectedPlayer(null); setSelectedTeam(null); setSelectedArticle(null); setSelectedComp(null); setSelectedMatch(null) }

  const tabs = [
    { id:"home",     icon:Home,   label:"Home"    },
    { id:"discover", icon:Search, label:"Explore" },
    { id:"live",     icon:Play,   label:"Live"    },
    { id:"me",       icon:User,   label:"Me"      },
  ]
  const unread = NOTIFS.filter(n=>n.unread).length

  return (
    <div style={{ minHeight:"100vh", background:"#060610", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 16px", fontFamily:UI }}>
      <div style={{ position:"relative", width:"100%", maxWidth:"393px", background:C.bg, borderRadius:"54px", overflow:"hidden", minHeight:"852px", boxShadow:"0 0 0 1px rgba(255,255,255,0.06), 0 80px 200px rgba(0,0,0,0.96)" }}>
        <div style={{ overflowY:"auto", maxHeight:"852px", scrollbarWidth:"none" }}>
          <div style={{ display:"flex", justifyContent:"center", paddingTop:"14px" }}>
            <div style={{ width:"118px", height:"34px", background:"#000", borderRadius:"20px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
              <Dot size={6}/><span style={{ fontFamily:UI, fontSize:"9px", fontWeight:700, color:"rgba(255,255,255,0.50)", letterSpacing:"0.10em" }}>4 LIVE</span>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 32px 0" }}>
            <span style={{ fontFamily:MONO, fontSize:"15px", fontWeight:500, color:C.text }}>9:41</span>
            <div style={{ display:"flex", alignItems:"center", gap:"5px", opacity:0.76 }}>
              <svg width="16" height="11" viewBox="0 0 16 11" fill={C.text}><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="4.5" width="3" height="6.5" rx="0.5"/><rect x="9" y="2" width="3" height="9" rx="0.5"/><rect x="13.5" y="0" width="2.5" height="11" rx="0.5" opacity="0.3"/></svg>
              <svg width="15" height="11" viewBox="0 0 15 11" fill={C.text}><circle cx="7.5" cy="9.5" r="1.5"/><path d="M3.5 5.5C5 4 6.8 3 7.5 3S10 4 11.5 5.5L13 4C11 2 9.4 1 7.5 1S4 2 2 4Z"/></svg>
              <div style={{ width:"23px", height:"12px", position:"relative" }}>
                <div style={{ position:"absolute", inset:0, border:"1px solid rgba(255,255,255,0.44)", borderRadius:"3.5px" }}/>
                <div style={{ position:"absolute", top:"2px", left:"2px", bottom:"2px", right:"6px", background:C.text, borderRadius:"1.5px" }}/>
                <div style={{ position:"absolute", right:"-3px", top:"50%", transform:"translateY(-50%)", width:"2.5px", height:"5px", background:"rgba(255,255,255,0.38)", borderRadius:"0 2px 2px 0" }}/>
              </div>
            </div>
          </div>
          <div style={{ padding:"10px 16px 0" }}>
            <div style={{ ...glassNav, borderRadius:"22px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 18px" }}>
              <div style={{ fontFamily:DSP, fontSize:"20px", fontWeight:700, color:C.text, letterSpacing:"-0.02em", fontStyle:"italic" }}>Fanissima</div>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <motion.button whileTap={{scale:0.84}} onClick={()=>setShowNotifs(v=>!v)} style={{ width:"34px", height:"34px", borderRadius:"50%", ...card, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                  <Bell size={14} color={showNotifs?C.pink:C.sub}/>
                  <AnimatePresence>
                    {unread>0 && !showNotifs && (
                      <motion.span key="b" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} transition={sp.bounce} style={{ position:"absolute", top:"6px", right:"6px", width:"7px", height:"7px", background:C.pink, borderRadius:"50%", border:`1.5px solid ${C.bg}` }}/>
                    )}
                  </AnimatePresence>
                </motion.button>
                <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:"linear-gradient(135deg,#FF0080,#A78BFA)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:UI, fontSize:"12px", fontWeight:700, color:"white", boxShadow:"0 2px 16px rgba(255,0,128,0.40)" }}>A</div>
              </div>
            </div>
          </div>
          <div style={{ padding:"10px 28px 16px" }}>
            <p style={{ fontFamily:UI, fontSize:"9.5px", fontWeight:600, color:C.dim, letterSpacing:"0.24em", textTransform:"uppercase" }}>The global home of women's sport</p>
          </div>
          <AnimatePresence>
            {activeTab==="home" && (
              <motion.div key="chips" initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={sp.default} style={{ overflow:"hidden" }}>
                <div style={{ display:"flex", gap:"6px", padding:"0 16px 18px", overflowX:"auto", scrollbarWidth:"none" }}>
                  {SPORTS.map(s=>(
                    <motion.button key={s} whileTap={{scale:0.92}} onClick={()=>setActiveSport(s)} style={{ flexShrink:0, padding:"6px 16px", borderRadius:"999px", fontFamily:UI, fontSize:"11px", fontWeight:600, background:activeSport===s?C.pink:"rgba(255,255,255,0.06)", color:activeSport===s?"white":C.sub, border:activeSport===s?`1px solid ${C.pink}`:`1px solid rgba(255,255,255,0.07)`, boxShadow:activeSport===s?`0 4px 18px rgba(255,0,128,0.30)`:"none" }}>
                      {s}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {activeTab==="home" && (
              <motion.div key="home" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={sp.default}>
                <HomeScreen followedPlayers={followedPlayers} followedTeams={followedTeams} onOpenPlayer={setSelectedPlayer} onOpenTeam={setSelectedTeam} onOpenArticle={setSelectedArticle} onOpenMatch={setSelectedMatch} liked={liked} setLiked={setLiked} activeSport={activeSport}/>
              </motion.div>
            )}
            {activeTab==="discover" && (
              <motion.div key="discover" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={sp.default}>
                <DiscoverScreen followedPlayers={followedPlayers} followedTeams={followedTeams} onTogglePlayer={togglePlayer} onToggleTeam={toggleTeam} onOpenPlayer={setSelectedPlayer} onOpenTeam={setSelectedTeam} onOpenComp={setSelectedComp}/>
              </motion.div>
            )}
            {activeTab==="live" && (
              <motion.div key="live" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={sp.default}>
                <LiveScreen onOpenMatch={setSelectedMatch} onOpenComp={setSelectedComp}/>
              </motion.div>
            )}
            {activeTab==="me" && (
              <motion.div key="me" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={sp.default}>
                <MeScreen followedPlayers={followedPlayers} followedTeams={followedTeams} onOpenPlayer={setSelectedPlayer} onOpenTeam={setSelectedTeam} onTogglePlayer={togglePlayer} onToggleTeam={toggleTeam}/>
              </motion.div>
            )}
          </AnimatePresence>
          <div style={{ height:"110px" }}/>
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 16px 36px", paddingTop:"60px", background:`linear-gradient(to top, ${C.bg} 52%, transparent)`, zIndex:20, pointerEvents:"none" }}>
          <div style={{ ...glassTab, borderRadius:"32px", display:"flex", alignItems:"center", justifyContent:"space-around", padding:"8px 6px", pointerEvents:"all" }}>
            {tabs.map(t=>{
              const on = activeTab===t.id
              return (
                <motion.button key={t.id} whileTap={{scale:0.86}} onClick={()=>setActiveTab(t.id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", padding:"7px 18px", borderRadius:"24px", position:"relative" }}>
                  {on && <motion.div layoutId="tab-pill" style={{ position:"absolute", inset:0, borderRadius:"24px", background:"rgba(255,255,255,0.10)", border:"1px solid rgba(255,255,255,0.16)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)" }} transition={sp.bounce}/>}
                  <motion.div animate={{ scale:on?1.08:1, y:on?-1:0 }} transition={sp.bounce}>
                    <t.icon size={22} strokeWidth={on?2.0:1.5} color={on?C.pink:`rgba(244,243,255,0.32)`}/>
                  </motion.div>
                  <span style={{ fontFamily:UI, fontSize:"10px", fontWeight:on?700:400, color:on?C.pink:`rgba(244,243,255,0.32)` }}>{t.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
        <AnimatePresence>
          {showNotifs && (
            <div style={{ position:"absolute", inset:0, zIndex:55 }}>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowNotifs(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.50)" }}/>
              <NotifsPanel onClose={()=>setShowNotifs(false)}/>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {selectedPlayer && <PlayerSheet key="ps" player={selectedPlayer} following={followedPlayers.has(selectedPlayer.id)} onToggle={()=>togglePlayer(selectedPlayer.id)} onClose={closeAll}/>}
          {!selectedPlayer && selectedTeam && <TeamSheet key="ts" team={selectedTeam} following={followedTeams.has(selectedTeam.id)} onToggle={()=>toggleTeam(selectedTeam.id)} onClose={closeAll}/>}
          {!selectedPlayer && !selectedTeam && selectedArticle && <ArticleSheet key="as" item={selectedArticle} onClose={closeAll}/>}
          {!selectedPlayer && !selectedTeam && !selectedArticle && selectedComp && <CompSheet key="cs" comp={selectedComp} onClose={closeAll}/>}
          {!selectedPlayer && !selectedTeam && !selectedArticle && !selectedComp && selectedMatch && <MatchSheet key="ms" match={selectedMatch} onClose={closeAll}/>}
        </AnimatePresence>
      </div>
    </div>
  )
}
