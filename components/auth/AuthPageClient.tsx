"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AuthPageClient v15
 *
 * Definering / formål:
 * Felles klientkomponent for offentlig login- og registreringsside. Sender login og
 * registrering til Next.js API, oppretter session-cookie og videresender til Min side.
 *
 * Bruksområde:
 * Importeres av app/login/page.tsx og app/registrering/page.tsx.
 *
 * Berørte sider / routes:
 * - /login
 * - /registrering
 * - /minside
 * - /admin
 *
 * Berørte DB-brytere / feature_keys:
 * - auth.login
 * - auth.register
 * - auth.session.create
 * - landing.view
 *
 * Berørte API-ruter:
 * - POST /api/auth/login
 * - POST /api/auth/register
 * - GET /api/auth/session
 *
 * Dataretning:
 * API/backend -> Next.js -> React -> UI. MariaDB auth kobles senere.
 *
 * Logging:
 * log_category: auth
 * log_action: public_auth_page.submit
 */

import { FormEvent, useEffect, useMemo, useState } from "react";
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
  const [mounted, setMounted] = useState(false);
  const [skin, setSkin] = useState<PublicSkin>("collectium");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegister = mode === "register";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const savedSkin = window.localStorage.getItem("collectium.public.skin") as PublicSkin | null;
      if (savedSkin && ["collectium", "enkel", "museum", "finans"].includes(savedSkin)) {
        setSkin(savedSkin);
      }
    } catch {
      // localStorage is optional.
    }
  }, [mounted]);

  const logoSrc = useMemo(() => {
    if (skin === "museum" || skin === "finans") return "/brand/collectium-logo-white.png";
    if (skin === "enkel") return "/brand/collectium-logo-wide.png";
    return "/brand/collectium-logo-dark.png";
  }, [skin]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      membership: String(formData.get("membership") || "Free"),
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        setError(result.message || "Innlogging/registrering feilet.");
        return;
      }

      setMessage(isRegister ? "Konto opprettet. Sender deg til Min side." : "Innlogging OK. Sender deg til Min side.");
      window.setTimeout(() => {
        window.location.href = result.session?.role === "superadmin" ? "/admin" : "/minside";
      }, 450);
    } catch {
      setError("Kunne ikke kontakte auth-API akkurat nå.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={`${styles.page} ${styles[skin]}`} data-skin={skin} data-template={skin}>
      <PublicTopMenu skin={skin} logoSrc={logoSrc} onSkinChange={setSkin} />

      <section className={styles.authShell}>
        <div className={`${styles.authIntro} ct-panel`}>
          <p className={styles.kicker}>Collectium konto</p>
          <h1>{isRegister ? "Start samlingen din" : "Logg inn i Collectium"}</h1>
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
          className={`${styles.authCard} ct-card`}
          data-feature-key={isRegister ? "auth.register" : "auth.login"}
          onSubmit={handleSubmit}
        >
          <img src={logoSrc} alt="Collectium" className={styles.authLogo} />
          <h2>{isRegister ? "Registrering" : "Innlogging"}</h2>
          {isRegister && (
            <label>
              Navn
              <input name="name" type="text" autoComplete="name" placeholder="Ditt navn" />
            </label>
          )}
          <label>
            E-post
            <input name="email" type="email" autoComplete="email" placeholder="din@epost.no" required />
          </label>
          <label>
            Passord
            <input
              name="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder="Passord"
              required
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

          {error && <p className={styles.authError}>{error}</p>}
          {message && <p className={styles.authSuccess}>{message}</p>}

          <button
            type="submit"
            className={styles.primaryButton}
            data-feature-key={isRegister ? "auth.register" : "auth.login"}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Venter ..." : isRegister ? "Opprett konto" : "Logg inn"}
          </button>
          <p className={styles.authSwitchText}>
            {isRegister ? "Har du konto?" : "Ny bruker?"}{" "}
            <a href={isRegister ? "/login" : "/registrering"} data-feature-key={isRegister ? "auth.login" : "auth.register"}>
              {isRegister ? "Logg inn" : "Registrer deg"}
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}
