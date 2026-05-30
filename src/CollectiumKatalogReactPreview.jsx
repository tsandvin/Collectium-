import React, { createContext, useContext, useMemo, useState } from "react";
import {
  Archive,
  ChevronDown,
  ChevronUp,
  Database,
  Filter,
  Gavel,
  Heart,
  History,
  LayoutGrid,
  List,
  PanelLeft,
  Search,
  ShoppingBag,
  Star,
  TrendingUp,
  UserRound,
} from "lucide-react";

const skin = {
  page: "#e7f2ff",
  panel: "rgba(255,255,255,0.96)",
  panel2: "#f5faff",
  border: "rgba(83,145,214,.42)",
  borderStrong: "rgba(37,106,196,.75)",
  text: "#061323",
  muted: "#60748c",
  weak: "#91a4bb",
  accent: "#1f6fb2",
  accentSoft: "#e4f1ff",
  red: "#e33e68",
  orange: "#e49316",
  purple: "#6a4bd1",
  green: "#267d55",
  shadow: "0 24px 70px rgba(37,106,196,.16), 0 8px 24px rgba(12,39,78,.10)",
  shadowSoft: "0 12px 28px rgba(37,106,196,.10)",
};

const defaultSignature = {
  text: "Collectium",
  fontFamily: "Georgia, serif",
  fontSize: 8,
  fontWeight: 500,
  italic: true,
  color: "rgba(143,185,221,.72)",
  beforeLine: 120,
  afterLine: 0,
  lineHeight: 1,
  lineGap: 8,
  opacity: 1,
  letterSpacing: 0,
  position: "bottomRight",
  offsetX: 0,
  offsetY: 0,
  shadow: false,
  shadowX: 0,
  shadowY: 1,
  shadowBlur: 2,
  shadowColor: "rgba(6,19,35,.22)",
  animation: "none",
  duration: 2600,
};

const SignatureContext = createContext(defaultSignature);

const filters = [
  { key: "source", label: "Kilde", note: "kildegrunnlag", values: [["Norske sedler", "1 636"], ["Norsk mynt", "412"], ["Reklameobjekter", "86"], ["Alle kilder", "2 134"]] },
  { key: "object_group", label: "Objekttype", note: "gruppe", values: [["Seddel", "1 636"], ["Mynt", "412"], ["Skilt", "86"], ["Alle typer", "2 134"]] },
  { key: "country", label: "Land", note: "omrade", values: [["Norge", "1 636"], ["Sverige", "188"], ["Danmark", "142"], ["Alle land", "2 134"]] },
  { key: "producer", label: "Produsent", note: "utsteder", values: [["Norges Bank", "820"], ["Riksbanken", "188"], ["Danmarks Nationalbank", "142"], ["Alle produsenter", "2 134"]] },
  { key: "edition", label: "Utgave / serie", note: "katalogserie", values: [["1917-serien", "28"], ["1. utgave", "184"], ["Krigsutgave", "61"], ["7. utgave", "42"]] },
  { key: "year", label: "Ar / periode", note: "publisering", values: [["1917", "28"], ["1940-1945", "61"], ["1877", "14"], ["1905-1957", "418"]] },
  { key: "denomination", label: "Valor", note: "nominal", values: [["1 krone", "28"], ["2 kroner", "18"], ["5 kroner", "112"], ["100 kroner", "430"]] },
  { key: "variant", label: "Variant", note: "detalj", values: [["Alle varianter", "28"], ["Blank", "1"], ["A", "1"], ["B", "1"]] },
  { key: "ruler", label: "Konge / regent", note: "historie", values: [["Haakon VII", "418"], ["Olav V", "284"], ["Harald V", "122"], ["Oscar II", "88"]] },
  { key: "market", label: "Marked", note: "tilgjengelighet", values: [["Alle marked", "1 636"], ["Auksjon", "0"], ["Nettbutikk", "0"], ["I min samling", "1"]] },
  { key: "trend", label: "Trend / verdi", note: "finans", values: [["Ikke vurdert", "1 636"], ["Opp", "24"], ["Ned", "8"], ["Stabil", "122"]] },
];

const rows = [
  { id: "NO-BN-1917-BLANK", title: "1 krone - 1917 - Blank", issue: "Norge", year: "1917", denomination: "1 krone", variant: "Blank", rarity: "S", quality: "0/01", ruler: "Haakon VII", producer: "Norges Bank", material: "Sikkerhetspapir", seriesPeriod: "1917-serien", timePeriod: "Forste verdenskrig", value: "1 475 kr", trend: "+18 %", hearts: 0, stars: 0, auctionCount: 0, shopCount: 0, collectionCount: 1, tone: "green" },
  { id: "NO-BN-1917-A", title: "1 krone - 1917 - A", issue: "Norge", year: "1917", denomination: "1 krone", variant: "A", rarity: "S", quality: "Ikke vurdert", ruler: "Haakon VII", producer: "Norges Bank", material: "Sikkerhetspapir", seriesPeriod: "1917-serien", timePeriod: "Forste verdenskrig", value: "0 kr", trend: "0 %", hearts: 0, stars: 0, auctionCount: 0, shopCount: 0, collectionCount: 0, tone: "blue" },
  { id: "NO-BN-1917-B", title: "1 krone - 1917 - B", issue: "Norge", year: "1917", denomination: "1 krone", variant: "B", rarity: "S", quality: "Ikke vurdert", ruler: "Haakon VII", producer: "Norges Bank", material: "Sikkerhetspapir", seriesPeriod: "1917-serien", timePeriod: "Forste verdenskrig", value: "0 kr", trend: "0 %", hearts: 0, stars: 0, auctionCount: 0, shopCount: 0, collectionCount: 0, tone: "red" },
];

const segments = [
  { id: "samler", label: "Samler", icon: UserRound, sub: "Samlerdata" },
  { id: "historie", label: "Historie", icon: History, sub: "Relasjoner" },
  { id: "finans", label: "Finans", icon: TrendingUp, sub: "Verdi og trend" },
];

const viewOptions = [
  { id: "horizontal", label: "Horisontal", icon: PanelLeft },
  { id: "standing", label: "Staende", icon: LayoutGrid },
  { id: "list", label: "Liste", icon: List },
];

function signatureAnchor(position) {
  if (position === "bottomLeft") return { left: 18, bottom: 12 };
  if (position === "topRight") return { right: 18, top: 12 };
  if (position === "topLeft") return { left: 18, top: 12 };
  if (position === "centerRight") return { right: 18, top: "50%" };
  return { right: 18, bottom: 12 };
}

function signatureAnimation(name, duration) {
  if (name === "float") return `collectiumSignatureFloat ${duration}ms ease-in-out infinite`;
  if (name === "pulse") return `collectiumSignaturePulse ${duration}ms ease-in-out infinite`;
  if (name === "slideOut") return `collectiumSignatureSlideOut ${duration}ms ease-in-out infinite`;
  return "none";
}

function Signature() {
  const settings = useContext(SignatureContext);
  const textShadow = settings.shadow
    ? `${settings.shadowX}px ${settings.shadowY}px ${settings.shadowBlur}px ${settings.shadowColor}`
    : "none";

  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        ...signatureAnchor(settings.position),
        transform: `translate(${settings.offsetX}px, ${settings.offsetY}px)`,
        display: "inline-flex",
        alignItems: "center",
        gap: settings.lineGap,
        pointerEvents: "none",
        opacity: settings.opacity,
        color: settings.color,
        fontFamily: settings.fontFamily,
        fontSize: settings.fontSize,
        fontWeight: settings.fontWeight,
        fontStyle: settings.italic ? "italic" : "normal",
        letterSpacing: settings.letterSpacing,
        textShadow,
        whiteSpace: "nowrap",
        zIndex: 2,
        animation: signatureAnimation(settings.animation, settings.duration),
      }}
    >
      {settings.beforeLine > 0 && <span style={{ width: settings.beforeLine, height: settings.lineHeight, background: settings.color, opacity: 0.82 }} />}
      <span>{settings.text}</span>
      {settings.afterLine > 0 && <span style={{ width: settings.afterLine, height: settings.lineHeight, background: settings.color, opacity: 0.82 }} />}
    </span>
  );
}

function Panel({ children, style = {} }) {
  return (
    <section style={{ position: "relative", overflow: "visible", borderRadius: 22, border: `1px solid ${skin.border}`, background: skin.panel, boxShadow: skin.shadow, ...style }}>
      {children}
      <Signature />
    </section>
  );
}

function Control({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 5, minWidth: 0 }}>
      <span style={{ color: skin.muted, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</span>
      {children}
    </label>
  );
}

function inputStyle() {
  return {
    width: "100%",
    minWidth: 0,
    height: 34,
    borderRadius: 12,
    border: `1px solid ${skin.border}`,
    background: "white",
    color: skin.text,
    padding: "0 9px",
    outline: "none",
    fontWeight: 750,
  };
}

function SignatureDesigner({ signature, setSignature }) {
  function patch(key, value) {
    setSignature((current) => ({ ...current, [key]: value }));
  }

  return (
    <Panel style={{ padding: 14, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
        <div>
          <div style={{ color: skin.accent, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".16em" }}>Signaturdesign</div>
          <div style={{ marginTop: 4, color: skin.muted, fontSize: 12 }}>Endrer alle informasjonsbokser direkte: innhold, skrift, streker, farge, skygge, plassering og animasjon ut av feltet.</div>
        </div>
        <button type="button" onClick={() => setSignature(defaultSignature)} style={pillButton(false)}>Tilbakestill</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
        <Control label="Innhold">
          <input value={signature.text} onChange={(event) => patch("text", event.target.value)} style={inputStyle()} />
        </Control>
        <Control label="Skrift">
          <select value={signature.fontFamily} onChange={(event) => patch("fontFamily", event.target.value)} style={inputStyle()}>
            <option value="Georgia, serif">Georgia</option>
            <option value="Inter, ui-sans-serif, system-ui">Inter</option>
            <option value="Times New Roman, serif">Times</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Courier New, monospace">Monospace</option>
          </select>
        </Control>
        <Control label="Farge">
          <input type="color" value={signature.color.startsWith("#") ? signature.color : "#8fb9dd"} onChange={(event) => patch("color", event.target.value)} style={{ ...inputStyle(), padding: 4 }} />
        </Control>
        <Control label="Plassering">
          <select value={signature.position} onChange={(event) => patch("position", event.target.value)} style={inputStyle()}>
            <option value="bottomRight">Nede hoyre</option>
            <option value="bottomLeft">Nede venstre</option>
            <option value="topRight">Oppe hoyre</option>
            <option value="topLeft">Oppe venstre</option>
            <option value="centerRight">Midt hoyre</option>
          </select>
        </Control>
        <Control label="Animasjon">
          <select value={signature.animation} onChange={(event) => patch("animation", event.target.value)} style={inputStyle()}>
            <option value="none">Ingen</option>
            <option value="float">Flyt</option>
            <option value="pulse">Puls</option>
            <option value="slideOut">Ut av felt</option>
          </select>
        </Control>
        <Control label="Kursiv">
          <button type="button" onClick={() => patch("italic", !signature.italic)} style={pillButton(signature.italic)}>{signature.italic ? "Pa" : "Av"}</button>
        </Control>
        <Control label="Skygge">
          <button type="button" onClick={() => patch("shadow", !signature.shadow)} style={pillButton(signature.shadow)}>{signature.shadow ? "Pa" : "Av"}</button>
        </Control>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginTop: 12 }}>
        <RangeControl label="Skriftstorrelse" value={signature.fontSize} min={6} max={22} unit="px" onChange={(value) => patch("fontSize", value)} />
        <RangeControl label="Tykkelse" value={signature.fontWeight} min={100} max={900} step={100} onChange={(value) => patch("fontWeight", value)} />
        <RangeControl label="For-strek" value={signature.beforeLine} min={0} max={280} unit="px" onChange={(value) => patch("beforeLine", value)} />
        <RangeControl label="Etter-strek" value={signature.afterLine} min={0} max={220} unit="px" onChange={(value) => patch("afterLine", value)} />
        <RangeControl label="Strektykkelse" value={signature.lineHeight} min={1} max={6} unit="px" onChange={(value) => patch("lineHeight", value)} />
        <RangeControl label="Avstand" value={signature.lineGap} min={0} max={28} unit="px" onChange={(value) => patch("lineGap", value)} />
        <RangeControl label="Ut av felt X" value={signature.offsetX} min={-160} max={220} unit="px" onChange={(value) => patch("offsetX", value)} />
        <RangeControl label="Ut av felt Y" value={signature.offsetY} min={-80} max={80} unit="px" onChange={(value) => patch("offsetY", value)} />
        <RangeControl label="Opacity" value={signature.opacity} min={0.1} max={1} step={0.05} onChange={(value) => patch("opacity", value)} />
        <RangeControl label="Bokstavavstand" value={signature.letterSpacing} min={-1} max={6} step={0.25} unit="px" onChange={(value) => patch("letterSpacing", value)} />
        <RangeControl label="Skygge blur" value={signature.shadowBlur} min={0} max={18} unit="px" onChange={(value) => patch("shadowBlur", value)} />
        <RangeControl label="Hastighet" value={signature.duration} min={800} max={6000} step={100} unit="ms" onChange={(value) => patch("duration", value)} />
      </div>
    </Panel>
  );
}

function RangeControl({ label, value, min, max, step = 1, unit = "", onChange }) {
  return (
    <label style={{ display: "grid", gap: 4 }}>
      <span style={{ display: "flex", justifyContent: "space-between", gap: 8, color: skin.muted, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".08em" }}>
        <span>{label}</span>
        <b style={{ color: skin.text }}>{value}{unit}</b>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Banknote({ tone = "green", compact = false }) {
  const palettes = {
    green: ["#e8efe0", "#6d7d63", "#2f4939"],
    blue: ["#e4eef9", "#718fb2", "#243b5a"],
    red: ["#f5e1df", "#b6756f", "#5c2f33"],
  };
  const p = palettes[tone] || palettes.green;
  return (
    <div style={{ display: "grid", placeItems: "center", height: compact ? 48 : 160, minWidth: compact ? 82 : 210 }}>
      <div style={{ position: "relative", width: compact ? 72 : 214, height: compact ? 38 : 118, borderRadius: 8, border: "1px solid rgba(77,98,116,.35)", overflow: "hidden", background: `linear-gradient(135deg, ${p[0]}, #fff 42%, ${p[1]})`, boxShadow: skin.shadowSoft }}>
        <div style={{ position: "absolute", left: 10, top: 8, width: compact ? 22 : 34, height: compact ? 22 : 34, borderRadius: 999, border: `1px solid ${p[2]}`, display: "grid", placeItems: "center", fontWeight: 900, color: p[2] }}>1</div>
        <div style={{ position: "absolute", left: compact ? 36 : 58, top: compact ? 10 : 18, fontFamily: "serif", fontSize: compact ? 9 : 13, fontWeight: 900, color: p[2] }}>NORGES BANK</div>
        <div style={{ position: "absolute", right: 12, top: 9, fontSize: compact ? 9 : 12, fontWeight: 900, color: p[2] }}>1917</div>
        <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, height: 1, background: p[2], opacity: 0.45 }} />
      </div>
    </div>
  );
}

function TimelinePeriodRow({ timelineMode, setTimelineMode, setFilterIndexes }) {
  const modes = [
    { id: "ruler", label: "Kongeperiode", title: "Haakon VII", period: "1905-1957", description: "Filtrerer katalogen etter regentperiode.", filterPatch: { ruler: 0, year: 3 } },
    { id: "signature", label: "Signaturperiode", title: "Signatur / person", period: "1917-serien", description: "Filtrerer etter signatur-, person- og utstederperiode.", filterPatch: { edition: 0, producer: 0 } },
    { id: "motif", label: "Person/motiv-periode", title: "Motiv og historisk person", period: "Forste verdenskrig", description: "Filtrerer etter motiv, person, hendelse og historisk periode.", filterPatch: { year: 1, ruler: 0 } },
  ];

  function activate(mode) {
    setTimelineMode(mode.id);
    setFilterIndexes((current) => ({ ...current, ...mode.filterPatch }));
  }

  return (
    <Panel style={{ padding: 14, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".16em", color: skin.accent }}>Tidslinje</div>
          <div style={{ marginTop: 4, fontSize: 12, color: skin.muted }}>Velg periodegrunnlag. Bryteren endrer hele filteret til valgt periode.</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {modes.map((mode) => (
            <button key={mode.id} onClick={() => activate(mode)} style={pillButton(timelineMode === mode.id)}>{mode.label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
        {modes.map((mode) => (
          <button key={mode.id} onClick={() => activate(mode)} style={{ textAlign: "left", borderRadius: 18, border: `1px solid ${timelineMode === mode.id ? skin.borderStrong : skin.border}`, background: timelineMode === mode.id ? skin.accentSoft : skin.panel2, padding: 14, boxShadow: timelineMode === mode.id ? skin.shadowSoft : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 900, color: skin.accent, textTransform: "uppercase", letterSpacing: ".14em" }}>{mode.label}</div>
                <div style={{ marginTop: 6, fontSize: 15, fontWeight: 900 }}>{mode.title}</div>
              </div>
              <span style={{ borderRadius: 999, padding: "5px 8px", background: skin.panel, color: skin.accent, fontSize: 10, fontWeight: 900, height: 24 }}>{mode.period}</span>
            </div>
            <div style={{ marginTop: 10, color: skin.muted, fontSize: 12, lineHeight: 1.35 }}>{mode.description}</div>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function FilterSystem({ filterIndexes, setFilterIndexes }) {
  return (
    <Panel style={{ padding: 14, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: skin.accent, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".16em" }}><Filter size={15} /> Katalogfilter</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
        {filters.map((filter) => {
          const index = filterIndexes[filter.key] || 0;
          const active = filter.values[index] || filter.values[0];
          return (
            <div key={filter.key} style={{ display: "grid", gridTemplateColumns: "116px 1fr 58px", gap: 8, alignItems: "center", padding: 10, borderRadius: 16, border: `1px solid ${skin.border}`, background: skin.panel2 }}>
              <label>
                <div style={{ fontSize: 9, fontWeight: 900, color: skin.accent, textTransform: "uppercase", letterSpacing: ".12em" }}>{filter.label}</div>
                <div style={{ fontSize: 10, color: skin.weak }}>{filter.note}</div>
              </label>
              <select value={index} onChange={(event) => setFilterIndexes((current) => ({ ...current, [filter.key]: Number(event.target.value) }))} style={{ height: 34, borderRadius: 12, border: `1px solid ${skin.borderStrong}`, background: "white", padding: "0 8px", fontWeight: 800, minWidth: 0 }}>
                {filter.values.map(([name, count], optionIndex) => <option key={name} value={optionIndex}>{name} - {count}</option>)}
              </select>
              <div style={{ height: 34, borderRadius: 12, display: "grid", placeItems: "center", background: skin.accentSoft, color: skin.accent, fontSize: 11, fontWeight: 900 }}>{active[1]}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function pillButton(active) {
  return {
    minHeight: 34,
    borderRadius: 999,
    border: `1px solid ${active ? skin.borderStrong : skin.border}`,
    background: active ? skin.accent : skin.panel2,
    color: active ? "white" : skin.text,
    padding: "0 12px",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  };
}

function SegmentRail({ segment, setSegment }) {
  return (
    <Panel style={{ padding: 14, alignSelf: "start" }}>
      <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".16em", color: skin.accent, marginBottom: 10 }}>Segment</div>
      <div style={{ display: "grid", gap: 8 }}>
        {segments.map(({ id, label, icon: Icon, sub }) => (
          <button key={id} onClick={() => setSegment(id)} style={{ border: 0, borderRadius: 16, padding: 12, textAlign: "left", background: segment === id ? skin.accent : skin.panel2, color: segment === id ? "white" : skin.text, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 900 }}><Icon size={15} /> {label}</div>
            <div style={{ marginTop: 3, fontSize: 11, opacity: 0.75 }}>{sub}</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 18, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".16em", color: skin.accent }}>Marked</div>
      {[{ label: "Auksjon", icon: Gavel, count: 0 }, { label: "Nettbutikk", icon: ShoppingBag, count: 0 }, { label: "Samling", icon: Archive, count: 1 }].map(({ label, icon: Icon, count }) => (
        <div key={label} style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 10px", borderRadius: 14, background: skin.panel2, fontSize: 12, fontWeight: 800 }}><span style={{ display: "flex", alignItems: "center", gap: 7 }}><Icon size={14} />{label}</span><span style={{ color: skin.muted }}>{count}</span></div>
      ))}
    </Panel>
  );
}

function Toolbar({ view, setView, query, setQuery, sortDirection, setSortDirection }) {
  return (
    <Panel style={{ padding: 10, marginBottom: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "auto minmax(240px, 1fr) auto", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {viewOptions.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setView(id)} style={pillButton(view === id)}><Icon size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />{label}</button>)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${skin.border}`, background: skin.panel2, borderRadius: 999, padding: "8px 12px" }}>
          <Search size={16} color={skin.muted} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Sok i sokeresultatet..." style={{ flex: 1, border: 0, outline: 0, background: "transparent", minWidth: 120 }} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setSortDirection("asc")} style={pillButton(sortDirection === "asc")}>A-Z</button>
          <button onClick={() => setSortDirection("desc")} style={pillButton(sortDirection === "desc")}>Z-A</button>
        </div>
      </div>
    </Panel>
  );
}

function fieldsFor(row, segment) {
  const base = [["Arstall", row.year], ["Valor", row.denomination], ["Variant", row.variant], ["Sjeldenhet", row.rarity], ["Kvalitet", row.quality], ["Regent", row.ruler]];
  if (segment === "finans") return [["Estimert pris", row.value], ["Trend", row.trend], ["Auksjon", row.auctionCount], ["Nettbutikk", row.shopCount], ["Samling", row.collectionCount], ["Status", row.quality]];
  if (segment === "samler") return [["I samling", row.collectionCount ? "Ja" : "Nei"], ["Kvalitet", row.quality], ["Favoritt", row.stars], ["Hjerte", row.hearts], ["Verdi", row.value], ["Trend", row.trend]];
  return [...base, ["Produsent", row.producer], ["Materiale", row.material], ["Serie", row.seriesPeriod], ["Historisk periode", row.timePeriod]];
}

function DetailGrid({ row, segment }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>{fieldsFor(row, segment).map(([label, value]) => <div key={label} style={{ padding: 9, borderRadius: 12, background: skin.panel2, border: `1px solid ${skin.border}` }}><div style={{ color: skin.muted, fontSize: 10, fontWeight: 800 }}>{label}</div><div style={{ marginTop: 2, fontSize: 13, fontWeight: 900 }}>{value}</div></div>)}</div>;
}

function HorizontalCard({ row, segment }) {
  const [expanded, setExpanded] = useState(row.collectionCount > 0);
  return (
    <Panel style={{ padding: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "230px minmax(320px, 1fr) 150px", gap: 14, alignItems: "stretch" }}>
        <div style={{ borderRadius: 16, border: `1px solid ${skin.border}`, background: skin.panel2, padding: 10 }}><Banknote tone={row.tone} /></div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontSize: 22, lineHeight: 1.1 }}>{row.title}</h2>
            <span style={{ width: 26, height: 26, borderRadius: 999, display: "grid", placeItems: "center", background: skin.accent, color: "white", fontSize: 11, fontWeight: 900 }}>{row.rarity}</span>
          </div>
          <p style={{ color: skin.muted, fontSize: 13, margin: "8px 0 14px" }}>{row.issue} | {row.ruler} | {row.seriesPeriod}</p>
          <DetailGrid row={row} segment={segment} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 7 }}><span style={smallBadge(skin.red)}><Heart size={13} /> {row.hearts}</span><span style={smallBadge(skin.orange)}><Star size={13} /> {row.stars}</span></div>
          <div style={{ marginTop: "auto", borderRadius: 16, border: `1px solid ${skin.border}`, background: skin.panel2, padding: 12, textAlign: "right" }}><div style={{ fontSize: 20, fontWeight: 900 }}>{row.value}</div><div style={{ color: skin.muted, fontSize: 11 }}>Estimert pris</div><div style={{ marginTop: 8, color: row.trend.startsWith("+") ? skin.green : skin.muted, fontWeight: 900 }}>{row.trend}</div></div>
          <button onClick={() => setExpanded(!expanded)} style={{ ...pillButton(false), justifyContent: "center" }}>{expanded ? "Skjul" : "Vis"} detaljer {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}</button>
        </div>
      </div>
      {expanded && <div style={{ marginTop: 12, borderTop: `1px solid ${skin.border}`, paddingTop: 12 }}><DetailGrid row={row} segment="historie" /></div>}
    </Panel>
  );
}

function StandingCard({ row, segment }) {
  return <Panel style={{ padding: 12, minHeight: 520 }}><Banknote tone={row.tone} /><h3 style={{ textAlign: "center", margin: "10px 0 4px", fontSize: 18 }}>{row.title}</h3><p style={{ textAlign: "center", color: skin.muted, margin: "0 0 12px", fontSize: 12 }}>{row.ruler} | {row.seriesPeriod}</p><DetailGrid row={row} segment={segment} /><div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: skin.panel2, border: `1px solid ${skin.border}` }}><strong>{row.value}</strong><div style={{ color: skin.muted, fontSize: 11 }}>Estimert verdi</div></div></Panel>;
}

function ListRow({ row, expanded, onToggle, segment }) {
  return <article style={{ overflow: "visible", borderRadius: 16, border: `1px solid ${skin.border}`, background: skin.panel, boxShadow: skin.shadowSoft, position: "relative" }}><Signature /><button onClick={onToggle} style={{ width: "100%", display: "grid", gridTemplateColumns: "82px 1.4fr .6fr .5fr .35fr 140px 24px", gap: 12, alignItems: "center", padding: "8px 12px", border: 0, background: "transparent", textAlign: "left", cursor: "pointer" }}><Banknote tone={row.tone} compact /><strong>{row.title}</strong><span>{row.issue}</span><span>{row.variant}</span><strong>{row.rarity}</strong><span style={{ textAlign: "right", fontWeight: 900 }}>{row.value}</span>{expanded ? <ChevronUp size={16} color={skin.accent} /> : <ChevronDown size={16} color={skin.accent} />}</button>{expanded && <div style={{ borderTop: `1px solid ${skin.border}`, padding: 12, background: "rgba(245,250,255,.76)" }}><DetailGrid row={row} segment={segment} /></div>}</article>;
}

function smallBadge(color) {
  return { display: "inline-flex", alignItems: "center", gap: 4, minHeight: 28, borderRadius: 999, border: `1px solid ${skin.border}`, background: skin.panel2, padding: "0 8px", color, fontSize: 12, fontWeight: 800 };
}

export default function CollectiumKatalogReactPreview() {
  const [timelineMode, setTimelineMode] = useState("ruler");
  const [view, setView] = useState("horizontal");
  const [segment, setSegment] = useState("historie");
  const [query, setQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [expanded, setExpanded] = useState(rows[0].id);
  const [signature, setSignature] = useState(defaultSignature);
  const [filterIndexes, setFilterIndexes] = useState(() => Object.fromEntries(filters.map((filter) => [filter.key, 0])));

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? rows.filter((row) => [row.title, row.issue, row.variant, row.ruler, row.material].join(" ").toLowerCase().includes(q)) : rows;
    return [...list].sort((a, b) => a.title.localeCompare(b.title) * (sortDirection === "asc" ? 1 : -1));
  }, [query, sortDirection]);

  return (
    <SignatureContext.Provider value={signature}>
      <style>{`
        @keyframes collectiumSignatureFloat {
          0%, 100% { transform: translate(var(--sig-x, 0), var(--sig-y, 0)); }
          50% { transform: translate(calc(var(--sig-x, 0) + 0px), calc(var(--sig-y, 0) - 4px)); }
        }
        @keyframes collectiumSignaturePulse {
          0%, 100% { filter: opacity(.55); }
          50% { filter: opacity(1); }
        }
        @keyframes collectiumSignatureSlideOut {
          0%, 100% { margin-right: 0; }
          50% { margin-right: -26px; }
        }
      `}</style>
      <div style={{ minHeight: "100vh", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif", color: skin.text, background: `radial-gradient(circle at 25% 0%, #f8fcff, ${skin.page} 44%, #dbeeff)` }}>
        <div style={{ display: "grid", gridTemplateColumns: "78px 1fr", minHeight: "100vh" }}>
          <aside style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 12, background: "linear-gradient(180deg, #10243d, #173456)", boxShadow: "18px 0 44px rgba(16,36,61,.22)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 16, display: "grid", placeItems: "center", color: "white", border: "1px solid rgba(255,255,255,.22)", fontWeight: 900 }}>C</div>
            {[Database, LayoutGrid, Heart, Gavel, ShoppingBag].map((Icon, index) => <button key={index} style={{ width: 44, height: 44, border: 0, borderRadius: 16, display: "grid", placeItems: "center", color: "rgba(255,255,255,.82)", background: "transparent" }}><Icon size={22} /></button>)}
          </aside>
          <main style={{ padding: 24 }}>
            <header style={{ borderBottom: `1px solid ${skin.border}`, paddingBottom: 18, marginBottom: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: skin.accent, textTransform: "uppercase", letterSpacing: ".22em" }}>Katalog / {segment}</div>
              <h1 style={{ fontSize: 42, lineHeight: 1, margin: "8px 0 0" }}>1636 treff</h1>
              <p style={{ marginTop: 10, color: skin.muted, maxWidth: 820 }}>React-forhandsvisning med tidslinje, filter, segment, visningsknapper, sok, katalogkort og redigerbar Collectium-signatur.</p>
            </header>
            <SignatureDesigner signature={signature} setSignature={setSignature} />
            <TimelinePeriodRow timelineMode={timelineMode} setTimelineMode={setTimelineMode} setFilterIndexes={setFilterIndexes} />
            <FilterSystem filterIndexes={filterIndexes} setFilterIndexes={setFilterIndexes} />
            <section style={{ display: "grid", gridTemplateColumns: "270px 1fr", gap: 16 }}>
              <SegmentRail segment={segment} setSegment={setSegment} />
              <div>
                <Toolbar view={view} setView={setView} query={query} setQuery={setQuery} sortDirection={sortDirection} setSortDirection={setSortDirection} />
                {view === "horizontal" && <div style={{ display: "grid", gap: 16 }}>{filteredRows.map((row) => <HorizontalCard key={row.id} row={row} segment={segment} />)}</div>}
                {view === "standing" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>{filteredRows.map((row) => <StandingCard key={row.id} row={row} segment={segment} />)}</div>}
                {view === "list" && <div style={{ display: "grid", gap: 10 }}>{filteredRows.map((row) => <ListRow key={row.id} row={row} expanded={expanded === row.id} onToggle={() => setExpanded(expanded === row.id ? "" : row.id)} segment={segment} />)}</div>}
              </div>
            </section>
          </main>
        </div>
      </div>
    </SignatureContext.Provider>
  );
}
