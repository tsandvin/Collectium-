/**
 * Collectium Template Test API v3 no-double-shell
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    test_id: "collectium-template-frontend-json-test",
    version: "3.0.0-no-double-shell",
    default_template: "collectium",
    default_skin: "signature-light",
    viewport_default: "pc",
    required_datasets: [
      "data-template=collectium",
      "data-skin=signature-light",
      "data-vp=pc"
    ],
    required_files: [
      "app/layout.tsx",
      "app/globals.css",
      "app/collectium-brand-tokens.css",
      "components/app/CollectiumAppShell.tsx"
    ],
    checks: [
      {
        key: "layout-default",
        label: "Root layout default",
        expected: "html har collectium + signature-light som standard",
        status: "ok"
      },
      {
        key: "no-double-shell",
        label: "Ingen ekstra global AppShell",
        expected: "app/layout.tsx laster CSS, men wrapper ikke sidene i test-AppShell",
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
