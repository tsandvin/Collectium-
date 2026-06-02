"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AuthPageClient v14
 *
 * Definering / formål:
 * Felles klientkomponent for offentlig login- og registreringsside. Sidene bruker samme
 * offentlige toppmeny som forsiden og viser sidemeny først etter innlogging via global AppShell.
 *
 * Bruksområde:
 * Importeres av app/login/page.tsx og app/registrering/page.tsx.
 *
 * Berørte sider / routes:
 * - /login
 * - /registrering
 *
 * Berørte DB-brytere / feature_keys:
 * - auth.login
 * - auth.register
 * - auth.session.create
 * - landing.view
 *
 * Berørte API-ruter:
 * - POST /api/auth/login        (senere)
 * - POST /api/auth/register     (senere)
 * - GET /api/auth/session       (senere)
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: auth
 * log_action: public_auth_page.view
 */

import { useEffect, useMemo, useState } from "react";
import PublicTopMenu, { type PublicSkin } from "../layout/PublicTopMenu";
import styles from "../landing/collectium-frontpage.module.css";

type AuthMode = "login" | "register";

type AuthPageClientProps = {
  mode: AuthMode;
};

const planOptions = [
  "Free",
  "Bronze · 149 kr første år",
  "Silver · 3 000 kr/år eller 250 kr/mnd",
  "Gold · søk etter registrering",
];

export default function AuthPageClient({ mode }: AuthPageClientProps) {
  const [skin, setSkin] = useState<PublicSkin>("collectium");
  const isRegister = mode === "register";

  useEffect(() => {
    try {
      const savedSkin = window.localStorage.getItem("collectium.public.skin") as PublicSkin | null;
      if (savedSkin && ["collectium", "enkel", "museum", "finans"].includes(savedSkin)) {
        setSkin(savedSkin);
      }
    } catch {
      // localStorage is optional.
    }
  }, []);

  const logoSrc = useMemo(() => {
    if (skin === "museum" || skin === "finans")
      return "/brand/collectium-logo-white.png";
    if (skin === "enkel") return "/brand/collectium-logo-wide.png";
    return "/brand/collectium-logo-dark.png";
  }, [skin]);

  return (
    <main className={`${styles.page} ${styles[skin]}`} data-skin={skin} data-template={skin}>
      <PublicTopMenu skin={skin} logoSrc={logoSrc} onSkinChange={setSkin} />

      <section className={styles.authShell}>
        <div className={styles.authIntro}>
          <p className={styles.kicker}>Collectium konto</p>
          <h1>
            {isRegister ? "Start samlingen din" : "Logg inn i Collectium"}
          </h1>
          <p>
            {isRegister
              ? "Opprett konto for å lagre objekter, følge markedet og bygge egen samling. Etter registrering vises global sidemeny og innlogget arbeidsflate."
              : "Logg inn for å åpne Min side, samling, katalogstatus og innlogget sidemeny."}
          </p>
          <div className={styles.authInfoGrid}>
            <span>Global sidemeny etter innlogging</span>
            <span>Tilgang styres av medlemskap</span>
            <span>Katalog, samling og index kobles senere mot API</span>
          </div>
        </div>

        <form
          className={`${styles.authCard} ct-signature-frame`}
          data-feature-key={isRegister ? "auth.register" : "auth.login"}
        >
          <img src={logoSrc} alt="Collectium" className={styles.authLogo} />
          <h2>{isRegister ? "Registrering" : "Innlogging"}</h2>
          {isRegister && (
            <label>
              Navn
              <input
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Ditt navn"
              />
            </label>
          )}
          <label>
            E-post
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="din@epost.no"
            />
          </label>
          <label>
            Passord
            <input
              name="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder="Passord"
            />
          </label>
          {isRegister && (
            <label>
              Velg startnivå
              <select name="membership" defaultValue="Free">
                {planOptions.map((plan) => (
                  <option key={plan}>{plan}</option>
                ))}
              </select>
            </label>
          )}
          <button
            type="button"
            className={styles.primaryButton}
            data-feature-key={isRegister ? "auth.register" : "auth.login"}
          >
            {isRegister ? "Opprett konto" : "Logg inn"}
          </button>
          <p className={styles.authSwitchText}>
            {isRegister ? "Har du konto?" : "Ny bruker?"}{" "}
            <a
              href={isRegister ? "/login" : "/registrering"}
              data-feature-key={isRegister ? "auth.login" : "auth.register"}
            >
              {isRegister ? "Logg inn" : "Registrer deg"}
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}
