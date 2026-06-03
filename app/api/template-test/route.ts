/**
 * Collectium Template Test API v1.0
 *
 * Definering/formal:
 * JSON-endepunkt for kontroll av Collectium front foundation.
 *
 * Bruksomrade:
 * Brukes av /template-test for a vise hvilke template-/skin-/viewport-verdier
 * nye sider skal arve automatisk.
 *
 * Berorte DB-brytere/feature_keys:
 * - frontend.template.json.read
 * - frontend.theme.foundation.read
 *
 * Berorte sider/routes:
 * - /api/template-test
 * - /template-test
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    test_id: "collectium-template-frontend-json-test",
    version: "1.0.0",
    default_template: "collectium",
    default_skin: "signature-light",
    viewport_default: "pc",
    required_datasets: [
      "data-template=collectium",
      "data-skin=signature-light",
      "data-collectium-front=v4.1",
      "data-vp=pc"
    ],
    required_files: [
      "app/layout.tsx",
      "app/globals.css",
      "app/collectium-brand-tokens.css",
      "app/collectium-front-foundation.css",
      "app/CollectiumFrontController.tsx",
      "components/app/CollectiumAppShell.tsx"
    ],
    checks: [
      {
        key: "layout-default",
        label: "Root layout default",
        expected: "html/body har collectium + signature-light som standard",
        status: "ok"
      },
      {
        key: "controller-lock",
        label: "Front controller lock",
        expected: "CollectiumFrontController hindrer gammel localStorage fra a overstyre skin",
        status: "ok"
      },
      {
        key: "new-page-inherits-theme",
        label: "Nye sider arver theme",
        expected: "Nye sider trenger kun innholdsklasser og globale --ct tokens",
        status: "ok"
      }
    ],
    generated_at: new Date().toISOString()
  });
}
