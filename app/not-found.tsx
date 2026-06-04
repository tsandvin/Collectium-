/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Minimal Not Found Page
 *
 * Definering / formål:
 * Ren 404-side etter frontend-opprydding.
 *
 * Bruksområde:
 * Vises når fjernede frontend-ruter åpnes.
 *
 * Berørte sider / routes:
 * - /_not-found
 * - alle fjernede frontend-ruter
 *
 * Berørte DB-brytere / feature_keys:
 * - none
 *
 * Berørte API-ruter:
 * - none
 *
 * Berørte tabeller / views:
 * - none
 *
 * Dataretning:
 * Static Next.js UI only
 *
 * Logging:
 * none
 *
 * Endringsregel:
 * Ingen DB-config, API, auth eller env endres.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="ct-page">
      <section className="ct-panel">
        <p className="ct-kicker">Collectium</p>
        <h1 className="ct-title">Siden finnes ikke</h1>
        <p className="ct-description">
          Denne siden er fjernet i ny minimal frontend. Gå tilbake til forsiden.
        </p>
        <Link className="ct-link-button" href="/">
          Til forsiden
        </Link>
      </section>
    </main>
  );
}
