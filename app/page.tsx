import Link from "next/link";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Startside V2 kommersiell landingsside
 *
 * Definering / formal:
 * Kommersiell startside som forklarer Collectium-konseptet, medlemskap,
 * auksjon og forhandlermulighet uten aa vise fiktive data.
 *
 * Bruksomraade:
 * Brukes som offentlig inngang paa / i ren Next.js / React-kjerne.
 *
 * Berorte sider / routes:
 * - /
 * - /login
 * - /logout
 * - /min-side
 *
 * Berorte DB-brytere / feature_keys:
 * - landing.view
 * - auth.login
 * - auth.logout
 * - profile.view
 * - membership.view
 * - auction.view
 * - dealer.view
 *
 * Dataretning:
 * MariaDB/API senere -> Next.js -> React -> UI
 *
 * Viktig regel:
 * Ingen fiktive tall, priser, auksjonsobjekter eller markedsdata hardkodes.
 */

const navItems = [
  { label: "Konsept", href: "#konsept" },
  { label: "Medlemskap", href: "#medlemskap" },
  { label: "Auksjon", href: "#auksjon" },
  { label: "Forhandler", href: "#forhandler" },
  { label: "Logg inn", href: "/login" },
];

const membershipLevels = [
  {
    name: "Free",
    role: "Startnivaa",
    description: "For brukere som vil utforske Collectium og se begrenset offentlig innhold.",
    access: ["Offentlig inngang", "Enkel profil", "Begrenset katalogvisning"],
  },
  {
    name: "Bronze",
    role: "Grunnleggende samler",
    description: "For samlere som vil begynne aa bygge egen samling og lagre interesse.",
    access: ["Min side", "Onskeliste og favoritter", "Grunnleggende samlingsfunksjoner"],
  },
  {
    name: "Silver",
    role: "Aktiv samler",
    description: "For brukere som trenger mer filter, historikk og samlingsoversikt.",
    access: ["Flere katalogfilter", "Mer historisk kontekst", "Mer samlingsanalyse"],
  },
  {
    name: "Gold",
    role: "Avansert / forhandlerrettet",
    description: "For profesjonell bruk, forhandlerflyt og mer avansert markedstilgang etter godkjenning.",
    access: ["Forhandlerflyt", "Auksjonsforberedelse", "Utvidet kontrollflate"],
  },
  {
    name: "Platinum",
    role: "Full tilgang / profesjonell analyse",
    description: "For fullere tilgang til kilder, land, historikk, eksport og profesjonell analyse.",
    access: ["Dypere data", "Utvidet analyse", "Flere kilder og markeder"],
  },
];

const realDataPillars = [
  "Katalogdata fra MariaDB/API",
  "Medlemskap fra tilgangsmodul",
  "Auksjonsobjekter fra godkjente kanaler",
  "Forhandlerstatus fra admin-godkjenning",
  "Markedsdata fra reelle observasjoner",
];

const commercialModules = [
  {
    title: "Samlerplattform",
    text: "Brukeren skal kunne bygge samling, lagre onskeliste, markere favoritter, registrere kjop og salg og folge objekter.",
    tag: "Samler",
  },
  {
    title: "Auksjon",
    text: "Auksjon skal vise godkjente objekter, budflyt og historikk naar ekte auksjonsdata er koblet til API.",
    tag: "Marked",
  },
  {
    title: "Forhandler",
    text: "Forhandlere skal kunne soke tilgang, fa godkjente objektgrupper og handtere innlevering, vurdering og salg.",
    tag: "Proff",
  },
];

function CheckMark() {
  return <span style={{ color: "#1f7a53", fontWeight: 900 }}>✓</span>;
}

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#edf3f7", color: "#071827" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 10, borderBottom: "1px solid rgba(116, 139, 156, 0.25)", background: "rgba(246, 250, 252, 0.9)", backdropFilter: "blur(18px)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "18px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <span style={{ width: "38px", height: "38px", display: "grid", placeItems: "center", borderRadius: "14px", background: "linear-gradient(135deg, #061827, #215d83)", color: "#f4d28a", fontWeight: 900, boxShadow: "0 12px 28px rgba(6, 24, 39, 0.18)" }}>C</span>
            <span>
              <strong style={{ display: "block", fontSize: "16px", letterSpacing: "-0.02em" }}>Collectium</strong>
              <span style={{ display: "block", fontSize: "11px", color: "#587084", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>Commercial V2</span>
            </span>
          </Link>

          <nav aria-label="Hovedmeny" style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "8px" }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} style={{ padding: "10px 12px", borderRadius: "999px", textDecoration: "none", color: "#071827", fontSize: "13px", fontWeight: 850, background: item.href === "/login" ? "#ffffff" : "transparent", border: item.href === "/login" ? "1px solid #d8e5ed" : "1px solid transparent" }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section id="konsept" style={{ maxWidth: "1400px", margin: "0 auto", padding: "44px 24px 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(340px, 0.92fr)", gap: "24px", alignItems: "stretch" }}>
          <article style={{ position: "relative", overflow: "hidden", minHeight: "560px", borderRadius: "34px", background: "linear-gradient(145deg, #071827 0%, #0c2b43 45%, #124d70 100%)", color: "#ffffff", padding: "44px", boxShadow: "0 28px 90px rgba(7, 24, 39, 0.24)" }}>
            <div style={{ position: "absolute", right: "-120px", top: "-110px", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(244,210,138,0.45), rgba(244,210,138,0.04) 66%, transparent 70%)" }} />
            <div style={{ position: "absolute", right: "48px", bottom: "38px", width: "310px", height: "220px", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "26px", background: "linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))", transform: "rotate(-3deg)", boxShadow: "0 24px 60px rgba(0,0,0,0.24)" }}>
              <div style={{ height: "100%", padding: "22px", display: "grid", alignContent: "space-between" }}>
                <div>
                  <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: "#f4d28a" }}>Objektkort / sanndata</p>
                  <div style={{ height: "12px", width: "78%", borderRadius: "999px", background: "rgba(255,255,255,0.42)", marginBottom: "10px" }} />
                  <div style={{ height: "12px", width: "54%", borderRadius: "999px", background: "rgba(255,255,255,0.25)" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  <div style={{ height: "52px", borderRadius: "16px", background: "rgba(244,210,138,0.22)", border: "1px solid rgba(244,210,138,0.28)" }} />
                  <div style={{ height: "52px", borderRadius: "16px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.16)" }} />
                  <div style={{ height: "52px", borderRadius: "16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }} />
                </div>
              </div>
            </div>

            <div style={{ position: "relative", maxWidth: "760px" }}>
              <p style={{ margin: "0 0 14px", display: "inline-flex", padding: "9px 12px", borderRadius: "999px", background: "rgba(244,210,138,0.14)", border: "1px solid rgba(244,210,138,0.32)", color: "#f7d995", fontSize: "12px", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Samler · Historie · Finans
              </p>
              <h1 style={{ margin: "0 0 22px", fontSize: "clamp(44px, 7vw, 88px)", lineHeight: 0.92, letterSpacing: "-0.075em" }}>
                En kommersiell plattform for samlere, marked og dokumentert verdi.
              </h1>
              <p style={{ margin: "0 0 30px", maxWidth: "700px", color: "#d8e8f1", fontSize: "18px", lineHeight: 1.7 }}>
                Collectium skal samle katalog, egen samling, medlemskap, auksjon, forhandlerflyt og markedsanalyse i ett kontrollert system. Siden viser konsept og tilbud uten fiktive tall. Reelle data skal komme fra API og MariaDB.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <Link href="/login" style={{ padding: "14px 20px", borderRadius: "999px", background: "#f4d28a", color: "#071827", textDecoration: "none", fontWeight: 950 }}>
                  Start med innlogging
                </Link>
                <Link href="#medlemskap" style={{ padding: "14px 20px", borderRadius: "999px", background: "rgba(255,255,255,0.1)", color: "#ffffff", textDecoration: "none", fontWeight: 900, border: "1px solid rgba(255,255,255,0.24)" }}>
                  Se medlemskap
                </Link>
              </div>
            </div>
          </article>

          <aside style={{ display: "grid", gap: "16px" }}>
            <article style={{ borderRadius: "30px", background: "#ffffff", border: "1px solid #d9e7ef", padding: "26px", boxShadow: "0 22px 70px rgba(7, 24, 39, 0.09)" }}>
              <p style={{ margin: "0 0 12px", color: "#2e6f95", fontSize: "12px", fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>Sanndata-prinsipp</p>
              <h2 style={{ margin: "0 0 12px", fontSize: "28px", letterSpacing: "-0.045em" }}>Ingen fiktive markedsdata.</h2>
              <p style={{ margin: "0 0 18px", color: "#4a6072", fontSize: "15px", lineHeight: 1.7 }}>
                Tall, auksjonsobjekter, priser, antall, trender og markedsverdi skal bare vises naar de kommer fra godkjent datakilde.
              </p>
              <div style={{ display: "grid", gap: "10px" }}>
                {realDataPillars.map((item) => (
                  <div key={item} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", color: "#233849", lineHeight: 1.45 }}>
                    <CheckMark />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article style={{ minHeight: "220px", borderRadius: "30px", background: "linear-gradient(135deg, #ffffff, #e8f1f6)", border: "1px solid #d9e7ef", padding: "24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "auto 20px 18px auto", width: "190px", height: "120px", borderRadius: "24px", background: "repeating-linear-gradient(90deg, rgba(14, 68, 99, 0.16) 0 12px, rgba(14, 68, 99, 0.05) 12px 24px)", transform: "skewX(-8deg)" }} />
              <div style={{ position: "relative" }}>
                <p style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2e6f95" }}>Grafikkfelt</p>
                <h2 style={{ margin: 0, maxWidth: "360px", fontSize: "26px", letterSpacing: "-0.04em" }}>Visuell markedsflate klar for ekte grafdata.</h2>
              </div>
            </article>
          </aside>
        </div>
      </section>

      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "18px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {commercialModules.map((module) => (
            <article key={module.title} style={{ minHeight: "230px", borderRadius: "28px", background: "#ffffff", border: "1px solid #d9e7ef", padding: "26px", boxShadow: "0 18px 52px rgba(7, 24, 39, 0.07)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: "-18px", top: "-18px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(46, 111, 149, 0.1)" }} />
              <p style={{ margin: "0 0 16px", display: "inline-flex", padding: "8px 10px", borderRadius: "999px", background: "#edf5f9", color: "#2e6f95", fontSize: "11px", fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>{module.tag}</p>
              <h2 style={{ margin: "0 0 12px", fontSize: "26px", letterSpacing: "-0.04em" }}>{module.title}</h2>
              <p style={{ margin: 0, color: "#4a6072", fontSize: "15px", lineHeight: 1.7 }}>{module.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="medlemskap" style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 24px 18px" }}>
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", gap: "18px", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#2e6f95", fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>Medlemskap</p>
            <h2 style={{ margin: 0, fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 1, letterSpacing: "-0.065em" }}>Tilgang som kan vokse med samleren.</h2>
          </div>
          <p style={{ margin: 0, maxWidth: "520px", color: "#4a6072", lineHeight: 1.7 }}>
            Pris, aktive fordeler og endelige vilkaar skal hentes fra medlemskapsmodulen naar den kobles. Denne siden definerer nivaaene og kommersiell retning uten fiktive priser.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "14px" }}>
          {membershipLevels.map((level) => (
            <article key={level.name} style={{ background: level.name === "Silver" ? "#071827" : "#ffffff", color: level.name === "Silver" ? "#ffffff" : "#071827", border: "1px solid #d9e7ef", borderRadius: "26px", padding: "24px", boxShadow: "0 18px 54px rgba(7, 24, 39, 0.08)" }}>
              <p style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: 950, color: level.name === "Silver" ? "#f4d28a" : "#2e6f95" }}>{level.role}</p>
              <h3 style={{ margin: "0 0 12px", fontSize: "30px", letterSpacing: "-0.045em" }}>{level.name}</h3>
              <p style={{ margin: "0 0 16px", color: level.name === "Silver" ? "#d9e8f0" : "#4a6072", fontSize: "14px", lineHeight: 1.65 }}>{level.description}</p>
              <div style={{ display: "grid", gap: "9px" }}>
                {level.access.map((item) => (
                  <div key={item} style={{ display: "flex", gap: "9px", fontSize: "13px", lineHeight: 1.45 }}>
                    <span style={{ color: level.name === "Silver" ? "#f4d28a" : "#1f7a53", fontWeight: 900 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="auksjon" style={{ maxWidth: "1400px", margin: "0 auto", padding: "38px 24px 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.95fr) minmax(320px, 1.05fr)", gap: "18px", alignItems: "stretch" }}>
          <article style={{ borderRadius: "30px", background: "#ffffff", border: "1px solid #d9e7ef", padding: "30px", boxShadow: "0 18px 54px rgba(7, 24, 39, 0.08)" }}>
            <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#2e6f95", fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>Auksjon</p>
            <h2 style={{ margin: "0 0 14px", fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1, letterSpacing: "-0.06em" }}>Markedskanal for godkjente objekter.</h2>
            <p style={{ margin: "0 0 20px", color: "#4a6072", lineHeight: 1.7 }}>
              Auksjonsdelen skal senere hente ekte objekter, bud, status, selger, forhandler, kjoper og oppgjor fra API. Inntil sanndata er koblet, viser siden bare konsept og flyt.
            </p>
            <div style={{ display: "grid", gap: "10px" }}>
              {[
                "Objekt vurderes og godkjennes for auksjon",
                "Bud og budhistorikk registreres gjennom API",
                "Avsluttet salg kan bli reell prisobservasjon",
                "Oppgjor og gebyrer skal kobles til transaksjonslogg",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: "10px", alignItems: "flex-start", color: "#253b4d" }}>
                  <CheckMark />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>

          <article style={{ borderRadius: "30px", background: "linear-gradient(135deg, #0c2b43, #113f5f)", color: "#ffffff", padding: "30px", position: "relative", overflow: "hidden", minHeight: "360px" }}>
            <div style={{ position: "absolute", left: "28px", right: "28px", bottom: "28px", height: "160px", borderLeft: "1px solid rgba(255,255,255,0.25)", borderBottom: "1px solid rgba(255,255,255,0.25)" }}>
              <div style={{ position: "absolute", left: "8%", bottom: "16%", width: "12%", height: "40%", borderRadius: "14px 14px 0 0", background: "rgba(244,210,138,0.5)" }} />
              <div style={{ position: "absolute", left: "28%", bottom: "16%", width: "12%", height: "62%", borderRadius: "14px 14px 0 0", background: "rgba(255,255,255,0.28)" }} />
              <div style={{ position: "absolute", left: "48%", bottom: "16%", width: "12%", height: "50%", borderRadius: "14px 14px 0 0", background: "rgba(244,210,138,0.34)" }} />
              <div style={{ position: "absolute", left: "68%", bottom: "16%", width: "12%", height: "76%", borderRadius: "14px 14px 0 0", background: "rgba(255,255,255,0.38)" }} />
            </div>
            <p style={{ margin: "0 0 10px", color: "#f4d28a", fontSize: "12px", fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>Grafikk uten fiktive tall</p>
            <h3 style={{ margin: 0, maxWidth: "420px", fontSize: "34px", lineHeight: 1.05, letterSpacing: "-0.05em" }}>Plassholder for reelle auksjons- og markedsobservasjoner.</h3>
          </article>
        </div>
      </section>

      <section id="forhandler" style={{ maxWidth: "1400px", margin: "0 auto", padding: "38px 24px 56px" }}>
        <div style={{ borderRadius: "34px", background: "#ffffff", border: "1px solid #d9e7ef", padding: "30px", boxShadow: "0 22px 70px rgba(7, 24, 39, 0.08)", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 430px)", gap: "24px" }}>
          <div>
            <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#2e6f95", fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>Forhandler</p>
            <h2 style={{ margin: "0 0 14px", fontSize: "clamp(32px, 4vw, 54px)", lineHeight: 1, letterSpacing: "-0.06em" }}>Profesjonell kanal for vurdering, innlevering og salg.</h2>
            <p style={{ margin: "0 0 20px", color: "#4a6072", lineHeight: 1.7, maxWidth: "760px" }}>
              Forhandlerrollen skal gi godkjente aktorer mulighet til aa motta objekter, kontrollere kvalitet, foresla salgsstrategi og publisere til auksjon eller nettbutikk etter tilgang og godkjenning.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              {[
                "Soknad og admin-godkjenning",
                "Objektgrupper og kategori-tilgang",
                "Innlevering og vurderingsflyt",
                "Auksjon, nettbutikk og oppgjor",
              ].map((step) => (
                <div key={step} style={{ padding: "15px", borderRadius: "18px", background: "#edf5f9", border: "1px solid #d9e7ef", fontWeight: 850, color: "#243a4b" }}>{step}</div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: "26px", background: "linear-gradient(160deg, #f8fbfd, #e7f0f5)", border: "1px solid #d9e7ef", padding: "22px", display: "grid", gap: "12px", alignContent: "center" }}>
            <h3 style={{ margin: 0, fontSize: "24px", letterSpacing: "-0.04em" }}>Forhandlerstatus</h3>
            <p style={{ margin: 0, color: "#4a6072", lineHeight: 1.65 }}>Vises bare med reell status naar forhandlerprofil, avtale, objektgrupper og admin-godkjenning er koblet til API.</p>
            <Link href="/login" style={{ marginTop: "6px", display: "inline-flex", justifyContent: "center", padding: "13px 16px", borderRadius: "999px", background: "#071827", color: "#ffffff", textDecoration: "none", fontWeight: 950 }}>
              Logg inn for videre flyt
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
