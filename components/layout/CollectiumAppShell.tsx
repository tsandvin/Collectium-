"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./CollectiumAppShell.module.css";

type SearchMode = "ai" | "catalog" | "pages";
type SidebarMode = "light" | "dark";
type MegaMenuKey = "design" | "account" | "register" | null;

type CollectiumAppShellProps = {
  children: React.ReactNode;
};

const sidebarItems = [
  { href: "/", icon: "⌂", label: "Startside", meta: "Oversikt" },
  { href: "/katalog", icon: "▦", label: "Katalog", meta: "Objekter" },
  { href: "/samling", icon: "▤", label: "Min samling", meta: "Hjerte · stjerne" },
  { href: "/auksjon", icon: "⚒", label: "Auksjon", meta: "Bud · lotter" },
  { href: "/nettbutikk", icon: "▣", label: "Nettbutikk", meta: "Kjøp" },
  { href: "/forhandler", icon: "◆", label: "Forhandler", meta: "Innlevering" },
  { href: "/medlemskap", icon: "◈", label: "Medlemskap", meta: "Tilgang" },
  { href: "/index", icon: "◍", label: "Index", meta: "Finans" },
];

const searchModeLabels: Record<SearchMode, string> = {
  ai: "AI-søk",
  catalog: "Katalogsøk",
  pages: "Sidesøk",
};

export default function CollectiumAppShell({ children }: CollectiumAppShellProps) {
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("light");
  const [searchMode, setSearchMode] = useState<SearchMode>("catalog");
  const [megaMenu, setMegaMenu] = useState<MegaMenuKey>(null);

  const shellClassName = useMemo(
    () => [styles.shell, sidebarMode === "dark" ? styles.sidebarDark : styles.sidebarLight].join(" "),
    [sidebarMode],
  );

  function toggleMegaMenu(nextMenu: Exclude<MegaMenuKey, null>) {
    setMegaMenu((current) => (current === nextMenu ? null : nextMenu));
  }

  return (
    <div className={shellClassName} data-template="collectium" data-skin="signature-light" data-vp="pc">
      <aside className={styles.sidebar} aria-label="Collectium sidemeny">
        <div className={styles.sidebarStampWrap}>
          <div className={styles.annoStamp} aria-label="Collectium Anno 2022">
            <span className={styles.stampAnno}>ANNO</span>
            <span className={styles.stampYear}>2022</span>
            <span className={styles.stampMask} aria-hidden="true" />
            <span className={styles.stampMicro}>Collectium</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {sidebarItems.map((item) => (
            <Link className={styles.sidebarLink} href={item.href} key={item.href}>
              <span className={styles.sidebarIcon}>{item.icon}</span>
              <span className={styles.sidebarTextWrap}>
                <span className={styles.sidebarText}>{item.label}</span>
                <span className={styles.sidebarMeta}>{item.meta}</span>
              </span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <Link className={styles.supportLink} href="/support">
            <span className={styles.sidebarIcon}>?</span>
            <span className={styles.sidebarTextWrap}>
              <span className={styles.sidebarText}>Support</span>
              <span className={styles.sidebarMeta}>Status · hjelp · adminchat</span>
            </span>
          </Link>

          <div className={styles.sidebarModeSwitch} aria-label="Velg lys eller mørk sidemeny">
            <button
              className={sidebarMode === "light" ? styles.modeActive : undefined}
              type="button"
              onClick={() => setSidebarMode("light")}
            >
              Lys
            </button>
            <button
              className={sidebarMode === "dark" ? styles.modeActive : undefined}
              type="button"
              onClick={() => setSidebarMode("dark")}
            >
              Mørk
            </button>
          </div>
        </div>
      </aside>

      <div className={styles.appColumn}>
        <header className={styles.topbar}>
          <div className={styles.searchArea}>
            <label className={styles.searchLabel} htmlFor="collectium-global-search">
              Søk
            </label>
            <div className={styles.searchBox}>
              <input
                id="collectium-global-search"
                placeholder="Søk i Collectium Katalogen"
                type="search"
              />
              <div className={styles.searchModeGroup} aria-label="Søketype">
                {(["ai", "catalog", "pages"] as SearchMode[]).map((mode) => (
                  <button
                    className={searchMode === mode ? styles.searchModeActive : undefined}
                    key={mode}
                    type="button"
                    onClick={() => setSearchMode(mode)}
                  >
                    {searchModeLabels[mode]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.topActions}>
            <button
              className={styles.topActionButton}
              type="button"
              onClick={() => toggleMegaMenu("design")}
            >
              Design
            </button>
            <button
              className={styles.topActionButton}
              type="button"
              onClick={() => toggleMegaMenu("account")}
            >
              Logg inn / Min side
            </button>
            <button
              className={styles.topRegisterButton}
              type="button"
              onClick={() => toggleMegaMenu("register")}
            >
              Registrer deg gratis
            </button>
          </div>
        </header>

        {megaMenu ? <MegaMenu menuKey={megaMenu} onClose={() => setMegaMenu(null)} /> : null}

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}

function MegaMenu({ menuKey, onClose }: { menuKey: Exclude<MegaMenuKey, null>; onClose: () => void }) {
  const data = {
    design: {
      eyebrow: "Design og visning",
      title: "Collectium følger global skin og template",
      text: "Her kan brukeren senere se valgt skin, lys/mørk sidemeny, visningsmodus og tilgjengelige globale visningsvalg. Selve designet styres fortsatt av global template, ikke av enkeltsider.",
      cards: ["Signature light", "Sidebar lys/mørk", "Stående kort", "Listevisning"],
    },
    account: {
      eyebrow: "Konto og min side",
      title: "Logg inn, åpne Min side eller se status",
      text: "Min side samler profil, medlemskap, samling, varsler, meldinger, transaksjoner og prosesser. Forhandler og admin får rollebaserte moduler.",
      cards: ["Logg inn", "Min samling", "Varsler", "Prosesser"],
    },
    register: {
      eyebrow: "Ny bruker",
      title: "Registrer deg gratis og start samlingen",
      text: "Gratis registrering gir enkel profil, begrenset katalog og start på ønskeliste/samling. Medlemskap åpner mer historikk, marked og finans.",
      cards: ["Free", "Bronze", "Silver", "Gold"],
    },
  }[menuKey];

  return (
    <div className={styles.megaBackdrop} onClick={onClose} role="presentation">
      <section className={styles.megaMenu} onClick={(event) => event.stopPropagation()} aria-label={data.title}>
        <button className={styles.megaClose} type="button" onClick={onClose}>
          Lukk ×
        </button>
        <div>
          <p className={styles.megaEyebrow}>{data.eyebrow}</p>
          <h2>{data.title}</h2>
          <p>{data.text}</p>
        </div>
        <div className={styles.megaGrid}>
          {data.cards.map((card) => (
            <article className={styles.megaCard} key={card}>
              <span>{card}</span>
              <small>Collectium</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
