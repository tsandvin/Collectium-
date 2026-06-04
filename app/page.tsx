/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Collectium Vercel Frontside
 *
 * Definering / formål:
 * Forside for Collectium på Next.js/Vercel basert på godkjent canvas-retning.
 *
 * Bruksområde:
 * Brukes som app/page.tsx for hovedforsiden i Next.js App Router.
 *
 * Berørte sider / routes:
 * - /
 *
 * Berørte DB-brytere / feature_keys:
 * - landing.view
 * - catalog.view
 * - catalog.object.open
 * - membership.view
 *
 * Berørte API-ruter:
 * - Ingen direkte API-kall i denne første statiske Vercel-frontsiden.
 * - Senere kobling: GET /api/catalog/search, GET /api/membership/plans
 *
 * Berørte tabeller / views:
 * - Senere kobling: ct_v_catalog_objects_resolved
 * - Senere kobling: ct_v_catalog_market_summary
 * - Senere kobling: ct_memberships / membership plan view
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: landing
 * log_action: view
 *
 * Versjon:
 * CT-FRONTPAGE-VERCEL-0001 / CHANGE-2026-06-04-0001
 *
 * Endringsregel:
 * Denne pakken skal kopieres kontrollert. Eksisterende app/page.tsx bør tas backup av først.
 */

import type { Metadata } from "next";
import CollectiumFrontPageClient from "@/components/frontpage/CollectiumFrontPageClient";

export const metadata: Metadata = {
  title: "Collectium | Samlerplattform for sedler, mynter og historie",
  description:
    "Collectium samler katalog, samling, historie, markedsverdi, auksjon og medlemskap i én plattform.",
};

export default function Page() {
  return <CollectiumFrontPageClient />;
}
