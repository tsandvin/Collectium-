"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "../app/startside-v3.module.css";

type SegmentKey = "samler" | "historie" | "finans";
type SourceKey = "sedler" | "mynter";
type FeatureKey = "samler" | "organisering" | "verdi" | "forhandler" | "auksjon" | "index" | "sammenligning" | "museum";
type PriceMode = "monthly" | "yearly";

const segmentData: Record<SegmentKey, { title: string; status: string; description: string; note: string }> = {
  samler: {
    title: "Samler",
    status: "Min samling · ønskeliste · favoritt",
    description: "Viser brukerens forhold til objektet: hjerte, stjerne, Min samling, kjøpspris, egne notater, kjøp, salg og deling.",
    note: "Etter innlogging hentes brukerstatus og samlingsdata fra API.",
  },
  historie: {
    title: "Historie",
    status: "Konge · periode · signatur · relasjoner",
    description: "Viser historisk sammenheng: produsent, utgave, periode, regent, personer, signaturer, materiale, funn og relaterte objekter.",
    note: "Historiske relasjoner skal komme fra MariaDB og resolved views.",
  },
  finans: {
    title: "Finans",
    status: "Verdi · trend · marked · index",
    description: "Viser verdi, prisobservasjoner, auksjonsresultater, trend, likviditet, kjøpspris og sammenligning mot markedet.",
    note: "0 kr skal aldri tolkes som ekte markedsverdi. Manglende verdi vises som ikke vurdert.",
  },
};

const sourceData: Record<SourceKey, { label: string; title: string; type: string; pills: string[] }> = {
  sedler: {
    label: "SEDLER",
    title: "Seddelpresentasjon",
    type: "Norske sedler / banknote",
    pills: ["Katalognummer", "Hjerte", "Stjerne", "Min samling", "Kjøpspris"],
  },
  mynter: {
    label: "MYNTER",
    title: "Myntpresentasjon",
    type: "Mynter / coin",
    pills: ["Katalognummer", "Materiale", "Kvalitet", "Min samling", "Markedsgrunnlag"],
  },
};

const features: Array<{ key: FeatureKey; title: string; icon: string; text: string; note: string }> = [
  { key: "samler", title: "Samler", icon: "0", text: "Start, organiser og bygg samlingen din med egne lister, hjerte, stjerne og private notater.", note: "Etter innlogging vises funksjoner med riktig tilgang, data og global sidemeny." },
  { key: "organisering", title: "Organisering av samling", icon: "1", text: "Samleren skal kunne gruppere objekter, lagre status, bygge egne lister og holde orden på kjøp, salg, bilder og dokumentasjon.", note: "Data skal hentes fra collection-API og brukerens reelle samlingsstatus." },
  { key: "verdi", title: "Verdsettelse & innhold", icon: "2", text: "Collectium skal koble katalogdata, kvalitet, historikk og reelle prisobservasjoner til et kontrollert verdigrunnlag.", note: "Ingen fiktive markedsverdier vises. Verdi krever sanndata." },
  { key: "forhandler", title: "Forhandler kontakt", icon: "3", text: "Brukere skal kunne sende objekt til godkjent forhandler for vurdering, innlevering, auksjonsforslag eller nettbutikkforslag.", note: "Forhandler må godkjennes av admin og ha riktige objektgrupper." },
  { key: "auksjon", title: "Auksjoner", icon: "4", text: "Auksjon skal være en markedskanal for godkjente objekter. Forhandler vurderer objektet, eier godkjenner vilkår, og objektet kan publiseres.", note: "Avsluttede auksjoner kan bli reelle prisobservasjoner når resultatet er kontrollert." },
  { key: "index", title: "Index marked", icon: "5", text: "Index skal vise utvikling i objekter, grupper, perioder, materialer og marked når reelle transaksjoner og observasjoner finnes.", note: "Index skal ikke bruke simulerte tall." },
  { key: "sammenligning", title: "Objekt sammenligning", icon: "6", text: "Objekter skal kunne sammenlignes på kilde, utgave, kvalitet, sjeldenhet, historikk, prisobservasjoner og brukerens egen kjøpspris.", note: "Sammenligning må bruke object_id + object_group + source_key." },
  { key: "museum", title: "Historisk-museum modul", icon: "7", text: "Museumvisning skal presentere objekter, personer, regenter, perioder, funn og historiske relasjoner som en digital utstilling.", note: "Egnet for kommuner, private samlinger og historiske miljøer." },
];

const whyItems = [
  "Relasjonsbasert katalog med historisk dybde",
  "Samler, Historie og Finans i samme objektvisning",
  "Markedsdata, auksjon og index koblet til samme objektgrunnlag",
  "Forhandlerflyt for vurdering, salg, auksjon og oppgjør",
  "Museum- og historielag for personer, perioder, regenter og motiver",
  "Offentlig landing uten tekniske databasefelt eller intern systemtekst",
];

const priceCards = [
  { name: "Free", role: "Begrenset tilgang for å komme i gang.", monthly: ["0 kr", "0 kr", "Gratis"], yearly: ["0 kr", "0 kr", "Gratis"], button: "Start gratis", items: ["Offentlig katalogutdrag", "Begrenset søk", "Medlemskapstilbud"] },
  { name: "Bronze", role: "Løpende månedsmedlemskap etter første år.", monthly: ["149 kr første år", "199 kr/mnd etterpå", "Månedlig etter introår"], yearly: ["Bronze månedlig", "199 kr/mnd etter introår", "Løpende modell"], button: "Velg Bronze", items: ["Flere katalogfilter", "Grunnleggende samling", "Hjerte og stjerne", "Enkel markedsverdi"] },
  { name: "Silver", role: "Avansert samler- og analysemedlemskap. Kan vises både som år og måned.", monthly: ["250 kr/mnd tilbud", "500 kr/mnd etterpå", "Månedlig alternativ"], yearly: ["3 000 kr/år tilbud", "6 000 kr/år", "Årlig medlemskap"], button: "Velg Silver", items: ["Avansert katalog", "Flere filter", "Mer historikk", "Samlingsanalyse"], featured: true },
  { name: "Gold", role: "For samlere og aktører som trenger avansert tilgang. Forhandlerregistrering gjøres i eget løp.", monthly: ["Kun årsavtale", "Ikke månedlig", "Søk Gold"], yearly: ["10 000 kr første år", "20 000 kr/år etterpå", "Årlig"], button: "Søk Gold", items: ["Avansert katalog", "Marked og index", "Forhandler kan søke separat", "Kun årsavtale"] },
  { name: "Platinum", role: "50 % rabatt i ett år. Medlemskapet varer i to år.", monthly: ["Ingen månedlig pris", "Kun årlig", "Kontakt oss"], yearly: ["50 000 kr / 2 år", "100 000 kr/år", "Kun årlig"], button: "Kontakt oss", items: ["Ingen månedlig pris", "Alle land og kilder", "Full historikk", "Profesjonell analyse"] },
];

export default function StartsideV4Client() {
  const [segment, setSegment] = useState<SegmentKey>("samler");
  const [source, setSource] = useState<SourceKey>("sedler");
  const [featureKey, setFeatureKey] = useState<FeatureKey>("samler");
  const [priceMode, setPriceMode] = useState<PriceMode>("monthly");
  const activeSegment = segmentData[segment];
  const activeSource = sourceData[source];
  const activeFeature = features.find((item) => item.key === featureKey) ?? features[0];

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}><span className={styles.brandMark}>C</span><span>Collectium</span></Link>
        <nav className={styles.nav} aria-label="Hovedmeny">
          <Link href="#konsept">Katalog</Link><Link href="#medlemskap">Medlemskap</Link><Link href="#forhandler-auksjon">Forhandlere</Link><Link href="#forhandler-auksjon">Auksjon</Link>
        </nav>
        <div className={styles.actions}><Link href="/login" className={styles.secondaryButton}>Logg inn</Link><Link href="#medlemskap" className={styles.ghostButton}>Kom i gang gratis</Link></div>
      </header>

      <section id="konsept" className={`${styles.section} ${styles.hero}`}>
        <div>
          <p className={styles.kicker}>For samlere · for historien · for markedet</p>
          <h1 className={styles.heroTitle}>For samlere. Av samlere. <span className={styles.blueText}>Alt på ett sted.</span></h1>
          <p className={styles.heroLead}>Collectium samler katalog, egen samling, verdsettelse, auksjon, forhandlerkontakt, index og historiske relasjoner i en strukturert plattform.</p>
          <div className={styles.heroCtas}><Link href="#medlemskap" className={styles.primaryButton}>Start gratis</Link><Link href="#konsept" className={styles.secondaryButton}>Se katalog</Link></div>
          <p className={styles.publicNote}>Offentlig forside uten sidemeny. Etter innlogging overtar global AppShell og viser sidemenyen.</p>
          <div className={styles.chips}><span className={styles.chip}>Relasjonsbasert katalog</span><span className={styles.chip}>Oppdatert marked</span><span className={styles.chip}>Sikker samling</span></div>
        </div>

        <div className={styles.deviceWrap}>
          <div className={styles.device}>
            <div className={styles.deviceTop}>
              <div className={styles.segmentSwitch}>{(["samler", "historie", "finans"] as SegmentKey[]).map((key) => <button key={key} type="button" onClick={() => setSegment(key)} style={{ minHeight: 28, padding: "0 16px", border: 0, borderRadius: 999, background: segment === key ? "#fff" : "transparent", fontWeight: 950, cursor: "pointer" }}>{key === "samler" ? "Samler" : key === "historie" ? "Historie" : "Finans"}</button>)}</div>
              <div className={styles.sourceSwitch}>{(["sedler", "mynter"] as SourceKey[]).map((key) => <button key={key} type="button" onClick={() => setSource(key)} style={{ minHeight: 28, padding: "0 16px", border: 0, borderRadius: 999, background: source === key ? "#fff" : "transparent", fontWeight: 950, cursor: "pointer" }}>{key === "sedler" ? "Sedler" : "Mynter"}</button>)}</div>
            </div>
            <div className={styles.objectCard}>
              <div><Image src="/images/collectium-c-logo.png" alt="Collectium C" width={96} height={96} style={{ objectFit: "contain" }} /><span className={styles.objectType}>{activeSource.label}</span></div>
              <div><h2 className={styles.objectTitle}>{activeSource.title}</h2><p className={styles.objectMeta}>Kilde · objektgruppe · object_id</p><p className={styles.objectStatus}>{activeSegment.status}</p><div className={styles.pillRow}>{activeSource.pills.map((pill) => <span key={pill} className={styles.pill}>{pill}</span>)}</div><div className={styles.objectPrice}><span>{activeSegment.title}: hentes fra API</span><span className={styles.realData}>sanndata</span></div></div>
            </div>
            <div className={styles.infoCard}><h3>{activeSegment.title} · {activeSource.type}</h3><p>{activeSegment.description}</p><p style={{ marginTop: 10, color: "#0069b4", fontWeight: 900 }}>{activeSegment.note}</p></div>
          </div>
          <div className={styles.floatCard}><Image src="/images/collectium-c-logo.png" alt="Collectium" width={42} height={42} /><p className={styles.floatTitle}>Min samling</p><p className={styles.floatValue}>API-data</p><p className={styles.floatText}>Objekter og verdi hentes reelt</p></div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.kicker}>Funksjoner</p><h2 className={styles.sectionTitle}>Alt du trenger for å starte, organisere, forstå og selge</h2>
        <div className={styles.twoCol} style={{ marginTop: 28 }}>
          <div className={styles.featureList}>{features.map((feature) => <button key={feature.key} type="button" onClick={() => setFeatureKey(feature.key)} className={styles.featureItem} style={{ cursor: "pointer", borderColor: featureKey === feature.key ? "#0069b4" : "#bdd0df" }}><span className={styles.featureIcon}>{feature.icon}</span><span>{feature.title}</span></button>)}</div>
          <article className={styles.panel}><div className={styles.panelIcon}>◎</div><p className={styles.kicker}>Mulighet i Collectium</p><h3>{activeFeature.title}</h3><p>{activeFeature.text}</p><p className={styles.panelNote}>{activeFeature.note}</p></article>
        </div>
      </section>

      <section className={styles.section}><div className={styles.whyGrid}><div><p className={styles.kicker}>Hvorfor Collectium?</p><h2 className={styles.sectionTitle}>En relasjonsplattform, ikke bare en katalog</h2></div><div className={styles.whyList}>{whyItems.map((item) => <div key={item} className={styles.whyItem}><span className={styles.dot} />{item}</div>)}</div></div></section>

      <section className={styles.section} style={{ paddingTop: 0 }}><div style={{ position: "relative", width: "100%", minHeight: 520, borderRadius: 18, overflow: "hidden", background: "#050505" }}><Image src="/images/collectium-family.png" alt="Familie som samler objekter" fill style={{ objectFit: "cover" }} /><div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,.72), rgba(0,0,0,.18), rgba(0,0,0,.72))" }} /><div style={{ position: "absolute", left: 34, bottom: 32, maxWidth: 620 }}><p className={styles.kicker} style={{ color: "#f4d28a" }}>Familie · arv · samling</p><h2 className={styles.sectionTitle} style={{ color: "#fff" }}>Samling er historie som kan deles videre.</h2></div></div></section>

      <section id="medlemskap" className={styles.section}>
        <div className={styles.priceHeader}><div><p className={styles.kicker}>Medlemskap</p><h2 className={styles.sectionTitle}>Riktige priser og tilgangsnivå</h2><p className={styles.priceIntro}>Premium brukes ikke. Platinum finnes ikke som månedlig medlemskap.</p></div><div className={styles.toggle}><button type="button" onClick={() => setPriceMode("monthly")} style={{ minHeight: 36, padding: "0 18px", border: 0, borderRadius: 999, background: priceMode === "monthly" ? "#fff" : "transparent", fontWeight: 950, cursor: "pointer" }}>Månedlig</button><button type="button" onClick={() => setPriceMode("yearly")} style={{ minHeight: 36, padding: "0 18px", border: 0, borderRadius: 999, background: priceMode === "yearly" ? "#fff" : "transparent", fontWeight: 950, cursor: "pointer" }}>Årlig</button></div></div>
        <div className={styles.priceGrid}>{priceCards.map((price) => { const p = price[priceMode]; return <article key={price.name} className={`${styles.priceCard} ${price.featured ? styles.priceCardFeatured : ""}`}><h3>{price.name}</h3><p className={styles.priceRole}>{price.role}</p><p className={styles.priceMain}>{p[0]}</p><p className={styles.priceSub}>{p[1]}</p><p className={styles.priceNote}>{p[2]}</p><ul className={styles.priceList}>{price.items.map((item) => <li key={item}>{item}</li>)}</ul><Link href="/login" className={styles.cardButton}>{price.button}</Link></article>; })}</div>
      </section>

      <section id="forhandler-auksjon" className={styles.section}><p className={styles.kicker}>Forhandler og auksjon</p><h2 className={styles.sectionTitle}>Slik skal auksjon fungere i Collectium</h2><div className={styles.twoCol} style={{ marginTop: 28 }}><article className={styles.panel}><div className={styles.panelIcon}>3</div><p className={styles.kicker}>Forhandler</p><h3>Vurdering</h3><p>Forhandler søker tilgang, godkjennes av admin, får riktige objektgrupper og kan motta objekter til vurdering. Forhandler kan foreslå kvalitet, verdi, utrop og salgsstrategi.</p><p className={styles.panelNote}>Forhandlerflyten styres av tilgang, avtale og godkjenning.</p></article><article className={styles.panel}><div className={styles.panelIcon}>4</div><p className={styles.kicker}>Auksjon</p><h3>Publisering</h3><p>Eier godkjenner auksjonsforslag før publisering. Deretter kan objektet vises i riktig auksjonskanal, med status og resultater fra API.</p><p className={styles.panelNote}>Auksjonsobjekter skal komme fra API, ikke fra fiktive frontend-data.</p></article></div></section>

      <footer className={styles.footer}><span>©Collectium</span><span>© Collectium 2026 · Katalog · Relasjoner · Verdi</span></footer>
    </main>
  );
}
