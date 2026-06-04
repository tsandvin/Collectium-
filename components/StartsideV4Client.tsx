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
    status: "Min samling Â· Ã¸nskeliste Â· favoritt",
    description: "Viser brukerens forhold til objektet: hjerte, stjerne, Min samling, kjÃ¸pspris, egne notater, kjÃ¸p, salg og deling.",
    note: "Etter innlogging hentes brukerstatus og samlingsdata fra API.",
  },
  historie: {
    title: "Historie",
    status: "Konge Â· periode Â· signatur Â· relasjoner",
    description: "Viser historisk sammenheng: produsent, utgave, periode, regent, personer, signaturer, materiale, funn og relaterte objekter.",
    note: "Historiske relasjoner skal komme fra MariaDB og resolved views.",
  },
  finans: {
    title: "Finans",
    status: "Verdi Â· trend Â· marked Â· index",
    description: "Viser verdi, prisobservasjoner, auksjonsresultater, trend, likviditet, kjÃ¸pspris og sammenligning mot markedet.",
    note: "0 kr skal aldri tolkes som ekte markedsverdi. Manglende verdi vises som ikke vurdert.",
  },
};

const sourceData: Record<SourceKey, { label: string; title: string; type: string; pills: string[] }> = {
  sedler: {
    label: "SEDLER",
    title: "Seddelpresentasjon",
    type: "Norske sedler / banknote",
    pills: ["Katalognummer", "Hjerte", "Stjerne", "Min samling", "KjÃ¸pspris"],
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
  { key: "organisering", title: "Organisering av samling", icon: "1", text: "Samleren skal kunne gruppere objekter, lagre status, bygge egne lister og holde orden pÃ¥ kjÃ¸p, salg, bilder og dokumentasjon.", note: "Data skal hentes fra collection-API og brukerens reelle samlingsstatus." },
  { key: "verdi", title: "Verdsettelse & innhold", icon: "2", text: "Collectium skal koble katalogdata, kvalitet, historikk og reelle prisobservasjoner til et kontrollert verdigrunnlag.", note: "Ingen fiktive markedsverdier vises. Verdi krever sanndata." },
  { key: "forhandler", title: "Forhandler kontakt", icon: "3", text: "Brukere skal kunne sende objekt til godkjent forhandler for vurdering, innlevering, auksjonsforslag eller nettbutikkforslag.", note: "Forhandler mÃ¥ godkjennes av admin og ha riktige objektgrupper." },
  { key: "auksjon", title: "Auksjoner", icon: "4", text: "Auksjon skal vÃ¦re en markedskanal for godkjente objekter. Forhandler vurderer objektet, eier godkjenner vilkÃ¥r, og objektet kan publiseres.", note: "Avsluttede auksjoner kan bli reelle prisobservasjoner nÃ¥r resultatet er kontrollert." },
  { key: "index", title: "Index marked", icon: "5", text: "Index skal vise utvikling i objekter, grupper, perioder, materialer og marked nÃ¥r reelle transaksjoner og observasjoner finnes.", note: "Index skal ikke bruke simulerte tall." },
  { key: "sammenligning", title: "Objekt sammenligning", icon: "6", text: "Objekter skal kunne sammenlignes pÃ¥ kilde, utgave, kvalitet, sjeldenhet, historikk, prisobservasjoner og brukerens egen kjÃ¸pspris.", note: "Sammenligning mÃ¥ bruke object_id + object_group + source_key." },
  { key: "museum", title: "Historisk-museum modul", icon: "7", text: "Museumvisning skal presentere objekter, personer, regenter, perioder, funn og historiske relasjoner som en digital utstilling.", note: "Egnet for kommuner, private samlinger og historiske miljÃ¸er." },
];

const whyItems = [
  "Relasjonsbasert katalog med historisk dybde",
  "Samler, Historie og Finans i samme objektvisning",
  "Markedsdata, auksjon og index koblet til samme objektgrunnlag",
  "Forhandlerflyt for vurdering, salg, auksjon og oppgjÃ¸r",
  "Museum- og historielag for personer, perioder, regenter og motiver",
  "Offentlig landing uten tekniske databasefelt eller intern systemtekst",
];

const priceCards = [
  { name: "Free", role: "Begrenset tilgang for Ã¥ komme i gang.", monthly: ["0 kr", "0 kr", "Gratis"], yearly: ["0 kr", "0 kr", "Gratis"], button: "Start gratis", items: ["Offentlig katalogutdrag", "Begrenset sÃ¸k", "Medlemskapstilbud"] },
  { name: "Bronze", role: "LÃ¸pende mÃ¥nedsmedlemskap etter fÃ¸rste Ã¥r.", monthly: ["149 kr fÃ¸rste Ã¥r", "199 kr/mnd etterpÃ¥", "MÃ¥nedlig etter introÃ¥r"], yearly: ["Bronze mÃ¥nedlig", "199 kr/mnd etter introÃ¥r", "LÃ¸pende modell"], button: "Velg Bronze", items: ["Flere katalogfilter", "Grunnleggende samling", "Hjerte og stjerne", "Enkel markedsverdi"] },
  { name: "Silver", role: "Avansert samler- og analysemedlemskap. Kan vises bÃ¥de som Ã¥r og mÃ¥ned.", monthly: ["250 kr/mnd tilbud", "500 kr/mnd etterpÃ¥", "MÃ¥nedlig alternativ"], yearly: ["3 000 kr/Ã¥r tilbud", "6 000 kr/Ã¥r", "Ã…rlig medlemskap"], button: "Velg Silver", items: ["Avansert katalog", "Flere filter", "Mer historikk", "Samlingsanalyse"], featured: true },
  { name: "Gold", role: "For samlere og aktÃ¸rer som trenger avansert tilgang. Forhandlerregistrering gjÃ¸res i eget lÃ¸p.", monthly: ["Kun Ã¥rsavtale", "Ikke mÃ¥nedlig", "SÃ¸k Gold"], yearly: ["10 000 kr fÃ¸rste Ã¥r", "20 000 kr/Ã¥r etterpÃ¥", "Ã…rlig"], button: "SÃ¸k Gold", items: ["Avansert katalog", "Marked og index", "Forhandler kan sÃ¸ke separat", "Kun Ã¥rsavtale"] },
  { name: "Platinum", role: "50 % rabatt i ett Ã¥r. Medlemskapet varer i to Ã¥r.", monthly: ["Ingen mÃ¥nedlig pris", "Kun Ã¥rlig", "Kontakt oss"], yearly: ["50 000 kr / 2 Ã¥r", "100 000 kr/Ã¥r", "Kun Ã¥rlig"], button: "Kontakt oss", items: ["Ingen mÃ¥nedlig pris", "Alle land og kilder", "Full historikk", "Profesjonell analyse"] },
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
          <p className={styles.kicker}>For samlere Â· for historien Â· for markedet</p>
          <h1 className={styles.heroTitle}>For samlere. Av samlere. <span className={styles.blueText}>Alt pÃ¥ ett sted.</span></h1>
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
              <div><h2 className={styles.objectTitle}>{activeSource.title}</h2><p className={styles.objectMeta}>Kilde Â· objektgruppe Â· object_id</p><p className={styles.objectStatus}>{activeSegment.status}</p><div className={styles.pillRow}>{activeSource.pills.map((pill) => <span key={pill} className={styles.pill}>{pill}</span>)}</div><div className={styles.objectPrice}><span>{activeSegment.title}: hentes fra API</span><span className={styles.realData}>sanndata</span></div></div>
            </div>
            <div className={styles.infoCard}><h3>{activeSegment.title} Â· {activeSource.type}</h3><p>{activeSegment.description}</p><p style={{ marginTop: 10, color: "#0069b4", fontWeight: 900 }}>{activeSegment.note}</p></div>
          </div>
          <div className={styles.floatCard}><Image src="/images/collectium-c-logo.png" alt="Collectium" width={42} height={42} /><p className={styles.floatTitle}>Min samling</p><p className={styles.floatValue}>API-data</p><p className={styles.floatText}>Objekter og verdi hentes reelt</p></div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.kicker}>Funksjoner</p><h2 className={styles.sectionTitle}>Alt du trenger for Ã¥ starte, organisere, forstÃ¥ og selge</h2>
        <div className={styles.twoCol} style={{ marginTop: 28 }}>
          <div className={styles.featureList}>{features.map((feature) => <button key={feature.key} type="button" onClick={() => setFeatureKey(feature.key)} className={styles.featureItem} style={{ cursor: "pointer", borderColor: featureKey === feature.key ? "#0069b4" : "#bdd0df" }}><span className={styles.featureIcon}>{feature.icon}</span><span>{feature.title}</span></button>)}</div>
          <article className={styles.panel}><div className={styles.panelIcon}>â—Ž</div><p className={styles.kicker}>Mulighet i Collectium</p><h3>{activeFeature.title}</h3><p>{activeFeature.text}</p><p className={styles.panelNote}>{activeFeature.note}</p></article>
        </div>
      </section>

      <section className={styles.section}><div className={styles.whyGrid}><div><p className={styles.kicker}>Hvorfor Collectium?</p><h2 className={styles.sectionTitle}>En relasjonsplattform, ikke bare en katalog</h2></div><div className={styles.whyList}>{whyItems.map((item) => <div key={item} className={styles.whyItem}><span className={styles.dot} />{item}</div>)}</div></div></section>

      <section className={styles.section} style={{ paddingTop: 0 }}><div style={{ position: "relative", width: "100%", minHeight: 520, borderRadius: 18, overflow: "hidden", background: "#050505" }}><Image src="/images/collectium-family.png" alt="Familie som samler objekter" fill style={{ objectFit: "cover" }} /><div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,.72), rgba(0,0,0,.18), rgba(0,0,0,.72))" }} /><div style={{ position: "absolute", left: 34, bottom: 32, maxWidth: 620 }}><p className={styles.kicker} style={{ color: "#f4d28a" }}>Familie Â· arv Â· samling</p><h2 className={styles.sectionTitle} style={{ color: "#fff" }}>Samling er historie som kan deles videre.</h2></div></div></section>

      <section id="medlemskap" className={styles.section}>
        <div className={styles.priceHeader}><div><p className={styles.kicker}>Medlemskap</p><h2 className={styles.sectionTitle}>Riktige priser og tilgangsnivÃ¥</h2><p className={styles.priceIntro}>Premium brukes ikke. Platinum finnes ikke som mÃ¥nedlig medlemskap.</p></div><div className={styles.toggle}><button type="button" onClick={() => setPriceMode("monthly")} style={{ minHeight: 36, padding: "0 18px", border: 0, borderRadius: 999, background: priceMode === "monthly" ? "#fff" : "transparent", fontWeight: 950, cursor: "pointer" }}>MÃ¥nedlig</button><button type="button" onClick={() => setPriceMode("yearly")} style={{ minHeight: 36, padding: "0 18px", border: 0, borderRadius: 999, background: priceMode === "yearly" ? "#fff" : "transparent", fontWeight: 950, cursor: "pointer" }}>Ã…rlig</button></div></div>
        <div className={styles.priceGrid}>{priceCards.map((price) => { const p = price[priceMode]; return <article key={price.name} className={`${styles.priceCard} ${price.featured ? styles.priceCardFeatured : ""}`}><h3>{price.name}</h3><p className={styles.priceRole}>{price.role}</p><p className={styles.priceMain}>{p[0]}</p><p className={styles.priceSub}>{p[1]}</p><p className={styles.priceNote}>{p[2]}</p><ul className={styles.priceList}>{price.items.map((item) => <li key={item}>{item}</li>)}</ul><Link href="/login" className={styles.cardButton}>{price.button}</Link></article>; })}</div>
      </section>

            <section id="forhandler-auksjon" className={styles.section}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 24,
            minHeight: 720,
            padding: "56px 28px",
            backgroundImage:
              "linear-gradient(90deg, rgba(0,31,59,0.94), rgba(0,31,59,0.78), rgba(0,31,59,0.35)), url('/images/collectium-family.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#ffffff",
            boxShadow: "0 24px 90px rgba(0,31,59,0.20)",
          }}
        >
          <div style={{ maxWidth: 1380, margin: "0 auto" }}>
            <p className={styles.kicker} style={{ color: "#f4d28a" }}>
              Forhandler og auksjon
            </p>

            <h2
              className={styles.sectionTitle}
              style={{ color: "#ffffff", maxWidth: 980 }}
            >
              Slik skal auksjon fungere i Collectium
            </h2>

            <p
              style={{
                maxWidth: 820,
                margin: "22px 0 34px",
                color: "#d8e8f1",
                fontSize: 17,
                lineHeight: 1.7,
              }}
            >
              Auksjon skal være en kontrollert prosess fra objektvurdering til
              publisering, budrunde, avslutning og prisobservasjon. Alt skal
              styres av tilgang, avtale, API og reelle data.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: 14,
              }}
            >
              {[
                {
                  nr: "1",
                  title: "Forhandler",
                  head: "Søknad",
                  text: "Forhandler søker tilgang til Collectium og velger relevante objektgrupper.",
                },
                {
                  nr: "2",
                  title: "Admin",
                  head: "Godkjenning",
                  text: "Admin kontrollerer forhandler, avtale, objektgrupper og tilgang før funksjoner åpnes.",
                },
                {
                  nr: "3",
                  title: "Forhandler",
                  head: "Vurdering",
                  text: "Forhandler kan motta objekter til vurdering og foreslå kvalitet, verdi, utrop og salgsstrategi.",
                },
                {
                  nr: "4",
                  title: "Eier",
                  head: "Godkjenning",
                  text: "Eier må godkjenne auksjonsforslag og vilkår før objektet kan publiseres.",
                },
                {
                  nr: "5",
                  title: "Auksjon",
                  head: "Publisering",
                  text: "Objektet vises i riktig auksjonskanal med status, bilder, beskrivelse og sanndata fra API.",
                },
                {
                  nr: "6",
                  title: "Budrunde",
                  head: "Aktivitet",
                  text: "Godkjente brukere kan by. Bud, tid, brukerstatus og endringer logges i systemet.",
                },
                {
                  nr: "7",
                  title: "Avslutning",
                  head: "Resultat",
                  text: "Når auksjonen er avsluttet, registreres vinner, status og resultat i transaksjonsflyten.",
                },
                {
                  nr: "8",
                  title: "Marked",
                  head: "Prisobservasjon",
                  text: "Et kontrollert sluttresultat kan brukes som reell prisobservasjon i katalog og index.",
                },
              ].map((step) => (
                <article
                  key={step.nr}
                  style={{
                    minHeight: 230,
                    padding: 22,
                    border: "1px solid rgba(255,255,255,0.24)",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(14px)",
                    boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      display: "grid",
                      placeItems: "center",
                      marginBottom: 18,
                      borderRadius: "50%",
                      background: "#f4d28a",
                      color: "#001f3b",
                      fontWeight: 950,
                    }}
                  >
                    {step.nr}
                  </div>

                  <p
                    style={{
                      margin: "0 0 8px",
                      color: "#f4d28a",
                      fontSize: 12,
                      fontWeight: 950,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {step.title}
                  </p>

                  <h3
                    style={{
                      margin: "0 0 12px",
                      color: "#ffffff",
                      fontSize: 26,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {step.head}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#e5f0f6",
                      fontSize: 14,
                      lineHeight: 1.65,
                    }}
                  >
                    {step.text}
                  </p>
                </article>
              ))}
            </div>

            <div
              style={{
                marginTop: 24,
                padding: 20,
                borderRadius: 16,
                border: "1px solid rgba(244,210,138,0.35)",
                background: "rgba(244,210,138,0.12)",
                color: "#fff5d8",
                lineHeight: 1.7,
              }}
            >
              Auksjonsobjekter, bud, status, resultater og prisobservasjoner
              skal komme fra API og MariaDB. Frontend skal ikke lage fiktive
              auksjonsdata.
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}><span>Â©Collectium</span><span>Â© Collectium 2026 Â· Katalog Â· Relasjoner Â· Verdi</span></footer>
    </main>
  );
}

