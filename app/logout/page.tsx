/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Logout Page
 *
 * Definering / formål:
 * Minimal logout-route for Collectium.
 *
 * Bruksområde:
 * Brukes på /logout.
 *
 * Berørte sider / routes:
 * - /logout
 *
 * Berørte DB-brytere / feature_keys:
 * - auth.logout
 *
 * Berørte API-ruter:
 * - POST /api/auth/logout
 *
 * Berørte tabeller / views:
 * - ct_user_sessions
 *
 * Dataretning:
 * React -> API/backend -> MariaDB/session -> UI redirect
 *
 * Logging:
 * log_category: auth
 * log_action: logout
 *
 * Endringsregel:
 * Ingen DB-config, API eller env endres.
 */

"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    async function runLogout() {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } finally {
        window.location.href = "/login";
      }
    }

    runLogout();
  }, []);

  return (
    <main className="ct-page">
      <section className="ct-panel">
        <p className="ct-kicker">Collectium</p>
        <h1 className="ct-title">Logger ut</h1>
        <p className="ct-description">Du sendes tilbake til innlogging.</p>
      </section>
    </main>
  );
}
