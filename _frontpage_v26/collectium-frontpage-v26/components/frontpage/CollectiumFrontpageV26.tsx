"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CollectiumFrontpageV26
 *
 * Definering / formål:
 * Komplett offentlig forside for Collectium med seriøs landing, levende objektkort,
 * medlemskap, aktivitet, relasjonsdata, finansdata, auksjon, deling, forhandlerfelt
 * og samlings-/medlems-CTA.
 *
 * Bruksområde:
 * Importeres av app/page.tsx som offentlig forside. Komponenten er visuell/client-side
 * og bruker presentasjonsdata frem til produksjonskoblinger er klare.
 *
 * Berørte sider / routes:
 * - /
 * - /katalog
 * - /medlemskap
 * - /registrering
 * - /login
 * - /forhandler
 * - /auksjon
 *
 * Berørte DB-brytere / feature_keys:
 * - landing.view
 * - landing.register
 * - landing.login
 * - landing.membership
 * - landing.featured_objects
 * - catalog.view
 * - catalog.object.open
 * - collection.wishlist.toggle
 * - collection.favorite.toggle
 * - collection.item.add
 *
 * Versjon:
 * CT-FRONTPAGE-0026 / CHANGE-2026-06-04-0003
 */

import { useEffect, useMemo, useState } from "react";
import styles from "./CollectiumFrontpageV26.module.css";

type SegmentKey = "samler" | "historie" | "finans" | "auksjon";
type ObjectGroupKey = "sedler" | "mynter";
type VisualKey = "noteBlue" | "noteGold" | "noteGreen" | "coinOscar" | "coinKarl";

type FeaturedObject = {
  key: string;
  group: ObjectGroupKey;
  visual: VisualKey;
  typeLabel: string;
  title: string;
  meta: string;
  catalog: string;
  value: string;
  state: string;
  specs: Array<[string, string]>;
  text: Record<SegmentKey, string>;
};

const featuredObjects: FeaturedObject[] = [
  {
    key: "note-10-1949-a",
    group: "sedler",
    visual: "noteBlue",
    typeLabel: "SEDLER",
    title: "10 kroner 1949 A",
    meta: "Norges Bank · Haakon VII · Norske sedler",
    catalog: "NSNR 23a",
    value: "15 000 kr",
    state: "Samling",
    specs: [
      ["Kilde", "Norske sedler"],
      ["Objekttype", "Seddel"],
      ["Relasjon", "Haakon VII"],
      ["Status", "Katalogobjekt"],
    ],
    text: {
      samler:
        "Legg objektet i Min samling, marker med hjerte eller stjerne, registrer kjøpspris, kvalitet, notater og dokumentasjon.",
      historie:
        "Se koblinger til utgave, periode, signaturer, regent, materiale og andre objekter fra samme historiske sammenheng.",
      finans:
        "Vis verdi, trend og utvikling når grunnlaget finnes. Manglende verdi skal vises som ikke vurdert.",
      auksjon:
        "Objektet kan senere kobles til auksjon med utrop, budstatus, resultat og prisobservasjon.",
    },
  },
  {
    key: "note-100-1877",
    group: "sedler",
    visual: "noteGold",
    typeLabel: "SEDLER",
    title: "100 kroner 1877",
    meta: "Historisk utgave · signaturer · relasjoner",
    catalog: "Historisk objekt",
    value: "Ikke vurdert",
    state: "Historie",
    specs: [
      ["Kilde", "Norske sedler"],
      ["Objekttype", "Seddel"],
      ["Relasjon", "Historisk utgave"],
      ["Visning", "Samler · Historie · Finans"],
    ],
    text: {
      samler:
        "Et eldre objekt kan brukes til oversikt over sjeldenhet, kvalitet, private notater, deling og samlerstatus.",
      historie:
        "Objektet kan knyttes til utgave, produsent, periode, personer, signaturer og relaterte objekter.",
      finans:
        "Finansvisningen kan vise estimert verdi, trend og prisobservasjoner når objektet har nok markedsgrunnlag.",
      auksjon:
        "Ved salg kan objektet presenteres med historikk, kvalitet, utrop, forventet intervall og auksjonsresultat.",
    },
  },
  {
    key: "note-1-1917-a",
    group: "sedler",
    visual: "noteGreen",
    typeLabel: "SEDLER",
    title: "1 krone 1917 · Litra A",
    meta: "Valør · årstall · litra · serie · variant",
    catalog: "Variant og litra",
    value: "Estimeres",
    state: "Oversikt",
    specs: [
      ["Valør", "1 krone"],
      ["Årstall", "1917"],
      ["Litra", "A"],
      ["Serie", "Valørutgave / serie"],
    ],
    text: {
      samler:
        "Denne typen objekt viser hvorfor samleren trenger struktur på valør, årstall, litra, serie og variant.",
      historie:
        "Brukeren kan gå videre til samme serie, samme litra, samme signatur eller relaterte varianter.",
      finans:
        "Finansfeltet kan sammenligne verdi mellom varianter og kvaliteter når observasjoner finnes.",
      auksjon:
        "Ved auksjon kan variant, kvalitet og dokumentasjon være avgjørende for utrop og resultat.",
    },
  },
  {
    key: "coin-oscar",
    group: "mynter",
    visual: "coinOscar",
    typeLabel: "MYNTER",
    title: "Mynt · Oscar II-perioden",
    meta: "Regent · metall · år · relasjoner",
    catalog: "Regentperiode",
    value: "Marked følger",
    state: "Relasjon",
    specs: [
      ["Objekttype", "Mynt"],
      ["Regent", "Oscar II"],
      ["Relasjon", "Periode og materiale"],
      ["Segment", "Historie"],
    ],
    text: {
      samler:
        "Mynter kan organiseres med hjerte, stjerne, samling, kjøpspris, kvalitet og egne notater.",
      historie:
        "Oscar II-perioden kan brukes som relasjonspunkt mellom mynter, sedler, regent og historisk kontekst.",
      finans:
        "Finansdelen kan koble objektet mot materiale, kvalitet, trend og prisobservasjoner over tid.",
      auksjon:
        "For auksjon kan metall, kvalitet, regent og sjeldenhet være sentrale presentasjonsfelt.",
    },
  },
  {
    key: "coin-karl-johan",
    group: "mynter",
    visual: "coinKarl",
    typeLabel: "MYNTER",
    title: "Mynt · Karl Johan-perioden",
    meta: "Konge · periode · objektgruppe · relasjoner",
    catalog: "Historisk relasjon",
    value: "Ikke vurdert",
    state: "Historie",
    specs: [
      ["Objekttype", "Mynt"],
      ["Regent", "Karl Johan"],
      ["Relasjon", "Historisk periode"],
      ["Status", "Katalogobjekt"],
    ],
    text: {
      samler:
        "Samleren kan holde objektet privat, dele det anonymt eller vise det gjennom egen profil.",
      historie:
        "Karl Johan kan kobles til periode, land, objektgruppe, utgave og relaterte objekter.",
      finans:
        "Finansfeltet kan vise utvikling for objekt eller objektgruppe når reelle observasjoner finnes.",
      auksjon:
        "Ved auksjon kan relasjonen til periode og regent løfte presentasjonen og forståelsen av objektet.",
    },
  },
];

const segmentLabels: Record<SegmentKey, string> = {
  samler: "Samler",
  historie: "Historie",
  finans: "Finans",
  auksjon: "Auksjon",
};

const featureCards = [
  {
    title: "Relasjonsbasert katalog",
    text: "Objekter kobles til valør, årstall, litra, utgave, variant, signaturer, regenter, historiske perioder, materiale, kvalitet og relaterte objekter.",
  },
  {
    title: "Oppdatert marked",
    text: "Marked, prisobservasjoner, trend, auksjonsresultater og utvikling vises når grunnlaget er godt nok. Manglende verdi vises som ikke vurdert.",
  },
  {
    title: "Sikker samling",
    text: "Bygg oversikt over egne objekter, hjerter, stjerner, kjøpspris, kvalitet, notater, dokumentasjon, transaksjoner og deling.",
  },
  {
    title: "Auksjon",
    text: "Objekter kan kobles til utrop, bud, status, resultat, prisobservasjoner og oppgjør som en seriøs markedsflyt.",
  },
  {
    title: "Relasjonsdata",
    text: "Se sammenhenger mellom objekt, person, konge, regent, signatur, periode, produsent, motiv, materiale og funn.",
  },
  {
    title: "Finansdata",
    text: "Følg markedsverdi, trend, likviditet, prisutvikling, kjøpspris, fortjeneste og sammenligning mot marked.",
  },
  {
    title: "Estimering",
    text: "Estimert verdi kan vises når grunnlaget er godt nok. Estimering skal være tydelig merket og aldri presenteres som fasit.",
  },
  {
    title: "Deling og profil",
    text: "Del objekt, objektgruppe eller samling privat, anonymt, tidsstyrt eller via egen Collectium-profil.",
  },
];

const memberships = [
  {
    tier: "Free",
    description: "Begrenset tilgang for å komme i gang.",
    price: "0 kr",
    sub: "Gratis",
    bullets: ["Offentlig katalogutdrag", "Begrenset søk", "Medlemskapstilbud"],
    action: "Start gratis",
    href: "/registrering",
  },
  {
    tier: "Bronze",
    description: "Løpende månedsmedlemskap etter første år.",
    price: "149 kr første år",
    sub: "199 kr/mnd etterpå",
    bullets: ["Flere katalogfilter", "Grunnleggende samling", "Hjerte og stjerne", "Enkel markedsverdi"],
    action: "Velg Bronze",
    href: "/medlemskap",
  },
  {
    tier: "Silver",
    badge: "Aktiv samler",
    description: "Avansert samler- og analysemedlemskap.",
    price: "3 000 kr/år tilbud",
    sub: "6 000 kr/år eller 500 kr/mnd",
    bullets: ["Avansert katalog", "Flere filter", "Mer historikk", "Samlingsanalyse", "Enkel index"],
    action: "Velg Silver",
    href: "/medlemskap",
  },
  {
    tier: "Gold",
    description: "For samlere og aktører som trenger avansert tilgang.",
    price: "10 000 kr første år",
    sub: "20 000 kr/år etterpå",
    bullets: ["Avansert katalog", "Marked og index", "Forhandler kan søke separat", "Mer relasjons- og finansdata"],
    action: "Søk Gold",
    href: "/medlemskap",
  },
  {
    tier: "Platinum",
    description: "50 % rabatt i ett år. Medlemskapet varer i to år.",
    price: "50 000 kr / 2 år",
    sub: "100 000 kr/år",
    bullets: ["Ingen månedlig pris", "Alle land og kilder", "Full historikk", "Profesjonell analyse", "Full relasjons- og finansdybde"],
    action: "Kontakt oss",
    href: "/kontakt",
  },
];

const activityCards = [
  ["Mest omsatte objekt", "38 750 kr", "10 kroner 1937 Litra A · NSNR 20a", "+12 %"],
  ["Mest sette konge", "Haakon VII", "Sett 24 580 ganger", "+8 %"],
  ["Mest populære motiv", "Riksvåpen", "Sett 18 920 ganger", "+6 %"],
  ["Markedstrend", "Index 1 247", "Siste 30 dager", "+3,6 %"],
  ["Mest delte objekt", "1 krone 1917 Litra A", "Delt 420 ganger", "+9 %"],
  ["Mest fulgte auksjon", "100 kroner 1877", "Aktive følgere: 214", "+11 %"],
];

function Signature() {
  return <span className={styles.signature} aria-hidden="true">________________ Collectium</span>;
}

function BanknoteVisual({ title, tone }: { title: string; tone: "blue" | "gold" | "green" }) {
  const colors = {
    blue: ["#0f335d", "#4e89cb"],
    gold: ["#4b3516", "#c59a49"],
    green: ["#183a31", "#6aa98b"],
  }[tone];
  return (
    <svg className={styles.svgVisual} viewBox="0 0 600 360" role="img" aria-label={title}>
      <defs>
        <linearGradient id={`note-${tone}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <rect x="28" y="30" width="544" height="300" rx="26" fill={`url(#note-${tone})`} />
      <rect x="48" y="50" width="504" height="260" rx="22" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.35)" />
      <circle cx="150" cy="180" r="72" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.42)" />
      <path d="M120 175c12-40 50-52 76-16 20 28 4 64-32 70-34 6-56-20-44-54z" fill="rgba(255,255,255,0.18)" />
      {[96, 136, 170, 204, 236].map((y, i) => (
        <rect key={y} x="252" y={y} width={[232, 182, 212, 146, 204][i]} height="16" rx="8" fill={`rgba(255,255,255,${0.24 - i * 0.025})`} />
      ))}
      <text x="66" y="88" fill="rgba(255,255,255,0.82)" fontSize="22" fontWeight="700" letterSpacing="2">Collectium</text>
      <text x="146" y="198" fill="#fff" fontSize="44" textAnchor="middle" fontWeight="800">{title}</text>
      <text x="472" y="288" fill="rgba(255,255,255,0.76)" fontSize="20" textAnchor="end">Seddelpresentasjon</text>
    </svg>
  );
}

function CoinVisual({ title, gold = false }: { title: string; gold?: boolean }) {
  return (
    <svg className={styles.svgVisual} viewBox="0 0 520 360" role="img" aria-label={title}>
      <defs>
        <linearGradient id={gold ? "coinGoldBg" : "coinBg"} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={gold ? "#2b1f16" : "#101723"} />
          <stop offset="100%" stopColor={gold ? "#b98a45" : "#566576"} />
        </linearGradient>
        <radialGradient id={gold ? "coinGoldFill" : "coinFill"} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={gold ? "#fde3a0" : "#e5edf5"} />
          <stop offset="100%" stopColor={gold ? "#ad7c2d" : "#788596"} />
        </radialGradient>
      </defs>
      <rect x="24" y="24" width="472" height="312" rx="28" fill={`url(#${gold ? "coinGoldBg" : "coinBg"})`} />
      <circle cx="184" cy="180" r="106" fill={`url(#${gold ? "coinGoldFill" : "coinFill"})`} stroke="rgba(255,255,255,0.36)" strokeWidth="8" />
      <circle cx="184" cy="180" r="84" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
      <path d="M160 157c8-28 42-28 48 0v50h-12v-24h-24v24h-12z" fill="rgba(45,39,27,0.52)" />
      <circle cx="178" cy="138" r="16" fill="rgba(45,39,27,0.52)" />
      <rect x="320" y="110" width="120" height="16" rx="8" fill="rgba(255,255,255,0.24)" />
      <rect x="320" y="144" width="88" height="14" rx="7" fill="rgba(255,255,255,0.18)" />
      <rect x="320" y="176" width="108" height="14" rx="7" fill="rgba(255,255,255,0.16)" />
      <rect x="320" y="208" width="94" height="14" rx="7" fill="rgba(255,255,255,0.14)" />
      <text x="52" y="62" fill="rgba(255,255,255,0.82)" fontSize="20" fontWeight="700" letterSpacing="2">Collectium</text>
      <text x="440" y="284" fill="#fff" fontSize="26" textAnchor="end" fontWeight="800">{title}</text>
      <text x="440" y="312" fill="rgba(255,255,255,0.7)" fontSize="18" textAnchor="end">Myntpresentasjon</text>
    </svg>
  );
}

function PortraitVisual({ name, tone }: { name: string; tone: "blue" | "brown" }) {
  return (
    <svg className={styles.svgVisual} viewBox="0 0 340 360" role="img" aria-label={name}>
      <defs>
        <linearGradient id={`portrait-${tone}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={tone === "blue" ? "#233956" : "#291f19"} />
          <stop offset="100%" stopColor={tone === "blue" ? "#9e7740" : "#a06a3b"} />
        </linearGradient>
      </defs>
      <rect width="340" height="360" rx="26" fill={`url(#portrait-${tone})`} />
      <ellipse cx="170" cy="296" rx="102" ry="34" fill="rgba(0,0,0,0.18)" />
      <path d="M110 318c12-62 42-104 60-104s48 42 60 104z" fill="rgba(237,235,230,0.9)" />
      <ellipse cx="170" cy="146" rx="52" ry="68" fill="#e3c29d" />
      <path d="M120 122c10-40 42-64 64-64 30 0 54 18 62 54-20-12-32-16-62-16-26 0-45 10-64 26z" fill="rgba(42,27,18,0.8)" />
      <circle cx="150" cy="140" r="5" fill="#50331e" />
      <circle cx="191" cy="140" r="5" fill="#50331e" />
      <path d="M170 145v23" stroke="#7d5236" strokeWidth="4" strokeLinecap="round" />
      <path d="M154 184c8 6 24 6 32 0" stroke="#7d5236" strokeWidth="4" strokeLinecap="round" fill="none" />
      <text x="170" y="338" fill="#fff" fontSize="24" textAnchor="middle" fontWeight="800">{name}</text>
    </svg>
  );
}

function DealerVisual() {
  return (
    <svg className={styles.svgVisual} viewBox="0 0 560 340" role="img" aria-label="Forhandler vurderer samlerobjekter">
      <rect width="560" height="340" rx="28" fill="#f0f6fb" />
      <rect x="40" y="218" width="480" height="72" rx="18" fill="#dbe6f1" />
      <rect x="64" y="76" width="132" height="132" rx="18" fill="#ffffff" stroke="#c7d7e7" />
      <rect x="216" y="96" width="112" height="92" rx="16" fill="#ffffff" stroke="#c7d7e7" />
      <rect x="348" y="88" width="152" height="102" rx="16" fill="#ffffff" stroke="#c7d7e7" />
      <circle cx="128" cy="142" r="38" fill="#c9d8ea" />
      <rect x="92" y="150" width="72" height="24" rx="12" fill="#98b3d1" />
      <circle cx="412" cy="140" r="44" fill="#e3c99f" />
      <rect x="378" y="152" width="70" height="24" rx="12" fill="#b2833a" />
      <circle cx="276" cy="122" r="24" fill="#eed7bb" />
      <path d="M248 236c12-44 36-72 54-72 18 0 42 28 54 72" fill="#284866" />
      <text x="280" y="48" textAnchor="middle" fill="#284866" fontSize="28" fontWeight="800">Forhandlerposisjon</text>
    </svg>
  );
}

function MemberVisual() {
  return (
    <svg className={styles.svgVisual} viewBox="0 0 560 360" role="img" aria-label="Samler organiserer samling">
      <rect width="560" height="360" rx="28" fill="#eef4fb" />
      <rect x="34" y="224" width="492" height="100" rx="22" fill="#d5e1ee" />
      <rect x="54" y="60" width="170" height="120" rx="18" fill="#fff7e6" stroke="#d8c4a0" />
      <rect x="238" y="44" width="128" height="150" rx="18" fill="#ffffff" stroke="#cddced" />
      <rect x="388" y="68" width="126" height="104" rx="18" fill="#17385f" />
      <circle cx="300" cy="154" r="34" fill="#e7c6a0" />
      <path d="M254 270c18-64 48-96 78-96 30 0 60 32 78 96" fill="#27486b" />
      <text x="138" y="98" textAnchor="middle" fill="#69543e" fontSize="22" fontWeight="700">Album</text>
      <text x="138" y="126" textAnchor="middle" fill="#69543e" fontSize="16">sedler · mynter</text>
      <text x="452" y="108" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="700">Hva har jeg</text>
      <text x="452" y="132" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="700">egentlig?</text>
      <text x="280" y="40" textAnchor="middle" fill="#284866" fontSize="26" fontWeight="800">Bli medlem</text>
    </svg>
  );
}

function ObjectVisual({ object }: { object: FeaturedObject }) {
  if (object.visual === "noteBlue") return <BanknoteVisual title="10 kr" tone="blue" />;
  if (object.visual === "noteGold") return <BanknoteVisual title="100 kr" tone="gold" />;
  if (object.visual === "noteGreen") return <BanknoteVisual title="1 kr" tone="green" />;
  if (object.visual === "coinOscar") return <CoinVisual title="Oscar II" />;
  return <CoinVisual title="Karl Johan" gold />;
}

export default function CollectiumFrontpageV26() {
  const [activeGroup, setActiveGroup] = useState<ObjectGroupKey>("sedler");
  const [activeSegment, setActiveSegment] = useState<SegmentKey>("samler");
  const [activeIndex, setActiveIndex] = useState(0);
  const [billingMode, setBillingMode] = useState<"monthly" | "yearly">("monthly");

  const visibleObjects = useMemo(() => featuredObjects.filter((item) => item.group === activeGroup), [activeGroup]);

  useEffect(() => {
    setActiveIndex(0);
  }, [activeGroup]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleObjects.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [visibleObjects.length]);

  const activeObject = visibleObjects[activeIndex] ?? featuredObjects[0];

  return (
    <main className={styles.frontpage}>
      <header className={styles.topbar}>
        <a className={styles.logo} href="/" aria-label="Collectium forside">
          <span className={styles.logoMark}>C</span>
          <strong>Collectium</strong>
        </a>
        <nav className={styles.nav} aria-label="Hovedmeny">
          <a href="/katalog">Katalog</a>
          <a href="/medlemskap">Medlemskap</a>
          <a href="/forhandler">Forhandlere</a>
          <a href="/auksjon">Auksjon</a>
        </nav>
        <div className={styles.topActions}>
          <a className={styles.secondaryButtonSmall} href="/login">Logg inn</a>
          <a className={styles.primaryButtonSmall} href="/registrering">Kom i gang gratis</a>
        </div>
      </header>

      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>For samlere · for historien · for markedet</p>
          <h1>For samlere. Av samlere. <span>Alt på ett sted.</span></h1>
          <p className={styles.lead}>
            Collectium samler katalog, egen samling, relasjonsdata, historikk, verdivurdering,
            auksjon, forhandlerkontakt, deling og markedsutvikling i én strukturert plattform.
          </p>
          <div className={styles.actionRow}>
            <a className={styles.primaryButton} href="/registrering">Start gratis</a>
            <a className={styles.secondaryButton} href="/katalog">Se katalog</a>
            <a className={styles.ghostButton} href="/medlemskap">Bli medlem</a>
          </div>
          <div className={styles.heroChips}>
            <span>Relasjonsbasert katalog</span>
            <span>Oppdatert marked</span>
            <span>Sikker samling</span>
          </div>
        </div>

        <div className={styles.heroCard} aria-label="Eksempel på objektkort">
          <Signature />
          <div className={styles.heroCardControls}>
            <div className={styles.segmentTabs}>
              <span>Samler</span>
              <span>Historie</span>
              <span>Finans</span>
            </div>
            <div className={styles.segmentTabs}>
              <span>Sedler</span>
              <span>Mynter</span>
            </div>
          </div>
          <div className={styles.heroObjectPreview}>
            <div className={styles.previewVisual}><BanknoteVisual title="10 kr" tone="blue" /></div>
            <div>
              <h2>10 kroner 1949 A</h2>
              <p>Norges Bank · Haakon VII · Norske sedler</p>
              <div className={styles.objectLinks}>
                <span>NSNR 23a</span>
                <span>Hjerte</span>
                <span>Stjerne</span>
                <span>Min samling</span>
                <span>Kjøpspris</span>
              </div>
              <strong>15 000 kr</strong>
              <em>Samling</em>
            </div>
          </div>
          <div className={styles.heroNote}>
            Ett objekt kan forstås som samlerobjekt, historisk objekt og finansielt objekt.
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.featureGridSection}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Kjernen i Collectium</p>
          <h2>En relasjonsplattform, ikke bare en katalog</h2>
          <p>
            Katalogen skal vise hva objektet er, hvilken sammenheng det hører til, hvilke relasjoner det har,
            hvordan markedet utvikler seg, og hvordan det passer inn i brukerens egen samling.
          </p>
        </div>
        <div className={styles.featureGrid}>
          {featureCards.map((card) => (
            <article className={styles.featureCard} key={card.title}>
              <Signature />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.functionsSection}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Funksjoner</p>
          <h2>Alt du trenger for å starte, organisere, forstå og selge</h2>
        </div>
        <div className={styles.functionLayout}>
          <div className={styles.functionList}>
            {["Samler", "Organisering av samling", "Relasjonsdata", "Finansdata", "Estimering", "Forhandlerkontakt", "Auksjoner", "Deling", "Anonymitet og profil"].map((item, index) => (
              <button className={index === 0 ? styles.functionActive : styles.functionButton} type="button" key={item}>{item}</button>
            ))}
          </div>
          <article className={styles.functionDetail}>
            <Signature />
            <p className={styles.kicker}>Mulighet i Collectium</p>
            <h3>Samler</h3>
            <p>
              Start, organiser og bygg samlingen din med egne lister, hjerte, stjerne, private notater,
              dokumentasjon og kontrollert deling. Samleren skal kunne se hva han eier, hva han ønsker seg,
              hva som mangler verdi, og hvilke objekter som bør følges videre.
            </p>
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.membershipSection}`}>
        <div className={styles.membershipHeader}>
          <div>
            <p className={styles.kicker}>Medlemskap</p>
            <h2>Riktige priser og tilgangsnivå</h2>
            <p>Premium brukes ikke. Platinum finnes ikke som månedlig medlemskap.</p>
          </div>
          <div className={styles.billingToggle} aria-label="Velg prisvisning">
            <button className={billingMode === "monthly" ? styles.toggleActive : ""} type="button" onClick={() => setBillingMode("monthly")}>Månedlig</button>
            <button className={billingMode === "yearly" ? styles.toggleActive : ""} type="button" onClick={() => setBillingMode("yearly")}>Årlig</button>
          </div>
        </div>
        <div className={styles.priceGrid}>
          {memberships.map((plan) => (
            <article className={`${styles.priceCard} ${plan.tier === "Silver" ? styles.featuredPrice : ""}`} key={plan.tier}>
              <Signature />
              {plan.badge && <span className={styles.planBadge}>{plan.badge}</span>}
              <h3>{plan.tier}</h3>
              <p>{plan.description}</p>
              <strong>{plan.price}</strong>
              <b>{plan.sub}</b>
              <ul>
                {plan.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
              <a className={styles.priceButton} href={plan.href}>{plan.action}</a>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.activitySection}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Aktivitet her på Collectium</p>
          <h2>Hva samlersiden følger akkurat nå</h2>
        </div>
        <div className={styles.activityGrid}>
          {activityCards.map(([label, value, detail, trend]) => (
            <article className={styles.activityCard} key={label}>
              <Signature />
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{detail}</p>
              <em>{trend}</em>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.objectExplorer}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Levende objektpresentasjon</p>
          <h2>Utforsk objektene i Collectium</h2>
          <p>Se hvordan samme objekt kan forstås som samlerobjekt, historisk objekt, finansielt objekt og auksjonsobjekt.</p>
        </div>
        <div className={styles.explorerToolbar}>
          <button className={activeGroup === "sedler" ? styles.primaryButtonSmall : styles.secondaryButtonSmall} type="button" onClick={() => setActiveGroup("sedler")}>Sedler</button>
          <button className={activeGroup === "mynter" ? styles.primaryButtonSmall : styles.secondaryButtonSmall} type="button" onClick={() => setActiveGroup("mynter")}>Mynter</button>
        </div>
        <article className={styles.objectCard}>
          <Signature />
          <div className={styles.objectVisual} key={`${activeObject.key}-visual`}>
            <ObjectVisual object={activeObject} />
          </div>
          <div className={styles.objectContent} key={`${activeObject.key}-${activeSegment}`}>
            <div className={styles.objectTitleRow}>
              <div>
                <p className={styles.kicker}>{activeObject.typeLabel}</p>
                <h3>{activeObject.title}</h3>
                <p>{activeObject.meta}</p>
              </div>
              <div className={styles.dots}>
                {visibleObjects.map((item, index) => (
                  <button key={item.key} className={index === activeIndex ? styles.dotActive : styles.dot} type="button" aria-label={`Vis ${item.title}`} onClick={() => setActiveIndex(index)} />
                ))}
              </div>
            </div>
            <div className={styles.objectLinks}>
              <span>{activeObject.catalog}</span>
              <span>Hjerte</span>
              <span>Stjerne</span>
              <span>Min samling</span>
              <span>Kjøpspris</span>
            </div>
            <div className={styles.segmentButtons}>
              {Object.entries(segmentLabels).map(([key, label]) => (
                <button key={key} className={activeSegment === key ? styles.segmentActive : styles.segmentButton} type="button" onClick={() => setActiveSegment(key as SegmentKey)}>{label}</button>
              ))}
            </div>
            <div className={styles.segmentPanel}>
              <Signature />
              <span>{segmentLabels[activeSegment]}</span>
              <strong>{activeObject.title}</strong>
              <p>{activeObject.text[activeSegment]}</p>
            </div>
            <div className={styles.specGrid}>
              {activeObject.specs.map(([label, value]) => (
                <div key={`${activeObject.key}-${label}`}>
                  <Signature />
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className={`${styles.section} ${styles.relationsSection}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Historiske relasjoner</p>
          <h2>Konger, perioder og objekter</h2>
          <p>Collectium viser hvordan objekter kan kobles til personer, regenter, historiske perioder, motiver og relaterte objekter.</p>
        </div>
        <div className={styles.relationGrid}>
          <article className={styles.relationCard}>
            <Signature />
            <div className={styles.portrait}><PortraitVisual name="Oscar II" tone="blue" /></div>
            <div>
              <h3>Oscar II</h3>
              <p>Oscar II kan vises som historisk relasjon med objekter, periode, motiv, materiale, katalogkoblinger og lenker til sedler og mynter fra samme kontekst.</p>
              <a className={styles.secondaryButtonSmall} href="/katalog">Se relaterte objekter</a>
            </div>
          </article>
          <article className={styles.relationCard}>
            <Signature />
            <div className={styles.portrait}><PortraitVisual name="Karl Johan" tone="brown" /></div>
            <div>
              <h3>Karl Johan</h3>
              <p>Karl Johan kan brukes som relasjonspunkt mellom historisk periode, objektgruppe, regent, land, utgave og katalogobjekter i samlingen.</p>
              <a className={styles.secondaryButtonSmall} href="/katalog">Utforsk perioden</a>
            </div>
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dealerSection}`}>
        <div className={styles.dealerVisual}><DealerVisual /></div>
        <div className={styles.dealerText}>
          <p className={styles.kicker}>Forhandlerposisjon</p>
          <h2>Bedre presentasjon av objekter i markedet</h2>
          <p>
            Forhandlere kan presentere objekter med spesifikasjoner, historikk, kvalitet, relasjoner,
            marked og dokumentasjon samlet i ett uttrykk. Et objekt kan vises som katalogobjekt,
            samlerobjekt, forhandlerobjekt, auksjonsobjekt eller salgsobjekt uten at identiteten forsvinner.
          </p>
          <div className={styles.actionRow}>
            <a className={styles.primaryButtonSmall} href="/forhandler">Forhandler</a>
            <a className={styles.secondaryButtonSmall} href="/auksjon">Se auksjon</a>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.shareSection}`}>
        <div>
          <p className={styles.kicker}>Deling og profil</p>
          <h2>Del det du vil – behold kontrollen</h2>
          <p>
            Del enkeltobjekter, objektgrupper eller deler av samlingen privat, anonymt, tidsstyrt eller via egen Collectium-profil.
            Du bestemmer hvem som får se hva, og hvor lenge.
          </p>
        </div>
        <div className={styles.shareOptions}>
          {["Privat samling", "Anonym deling", "Tidsstyrt lenke", "Delvis offentlig profil", "Offentlig Collectium-profil", "Kun valgte objekter"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.memberCta}`}>
        <div className={styles.memberVisual}><MemberVisual /></div>
        <div>
          <p className={styles.kicker}>Bli medlem</p>
          <h2>Har du en samling, men mangler oversikt?</h2>
          <p>
            Mange samlere har sedler, mynter eller andre objekter liggende i album, esker, permer og skuffer.
            Collectium skal gjøre det enklere å bygge, forstå og dokumentere samlingen din.
          </p>
          <div className={styles.actionRow}>
            <a className={styles.primaryButton} href="/registrering">Bli medlem</a>
            <a className={styles.secondaryButton} href="/medlemskap">Se medlemskap</a>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.signupSection}`}>
        <div>
          <p className={styles.kicker}>Registreringstilbud</p>
          <h2>Nye medlemmer får introduksjonsfordel</h2>
          <p>Start gratis, bygg samling og få oversikt over tilbud før du velger medlemskap.</p>
        </div>
        <form className={styles.signupForm}>
          <input aria-label="Din e-postadresse" placeholder="Din e-postadresse" type="email" />
          <button className={styles.primaryButtonSmall} type="submit">Meld meg på</button>
        </form>
        <div className={styles.offerGrid}>
          <span>Bronze: 149 kr første år, deretter 199 kr/mnd</span>
          <span>Silver: 3 000 kr/år tilbud, deretter 6 000 kr/år</span>
          <span>Platinum: betal 50 000 kr i rabattperioden og få Platinum i to år</span>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>© Collectium</span>
        <span>© Collectium 2026 · Katalog · Relasjoner · Verdi · Auksjon · Samling</span>
      </footer>
    </main>
  );
}
