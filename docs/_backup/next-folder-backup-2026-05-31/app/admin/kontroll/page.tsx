/**
 * COLLECTIUM FILE HEADER
 * Overskrift: Admin kontroll via PHP API bridge
 * Definering / formål: Viser at Next.js får kontakt med Collectium PHP/API og MariaDB via Domeneshop.
 * Bruksområde: /admin/kontroll
 * Berørte DB-brytere/feature_keys: admin.control, system.database.connect
 * Versjon: CT-NEXT-ADMIN-CONTROL-0001
 */

import { collectiumApiGet } from "@/lib/collectiumApi";

export const dynamic = "force-dynamic";

type DbHealth = {
  database: string | null;
  ct_app_pages: number;
};

export default async function AdminKontrollPage() {
  const health = await collectiumApiGet<DbHealth>("db-health.php");

  return (
    <main className="ct-page">
      <section className="ct-panel">
        <h1>Collectium admin kontroll</h1>
        <p>Next.js henter nå data via PHP/API bridge på Domeneshop.</p>
        <dl>
          <dt>Database</dt>
          <dd>{health.database}</dd>
          <dt>ct_app_pages</dt>
          <dd>{health.ct_app_pages}</dd>
        </dl>
      </section>
    </main>
  );
}
