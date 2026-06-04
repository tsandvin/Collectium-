/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Minimal White Not Found Page
 *
 * Definering / formål:
 * Ren hvit 404-side uten skin, canvas, sidebar, topmeny eller global panelbakgrunn.
 *
 * Bruksområde:
 * Vises når fjernede frontend-ruter som /katalog, /admin, /samling og /auksjon åpnes.
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
 * Ingen DB-config, API, auth, env eller backend endres.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#061827",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Collectium
      </p>

      <h1
        style={{
          margin: "0 0 12px",
          fontSize: "32px",
          lineHeight: 1.1,
          fontWeight: 800,
        }}
      >
        Siden finnes ikke
      </h1>

      <p
        style={{
          margin: "0 0 16px",
          maxWidth: "520px",
          fontSize: "15px",
          lineHeight: 1.5,
        }}
      >
        Denne siden finnes ikke i den minimale frontend-versjonen.
      </p>

      <Link href="/" style={{ color: "#061827", textDecoration: "underline" }}>
        Til forsiden
      </Link>
    </main>
  );
}
