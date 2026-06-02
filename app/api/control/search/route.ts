import { NextRequest, NextResponse } from "next/server";
import manifest from "@/data/control_manifest.json";

type Result = {
  type: string;
  key: string;
  label: string;
  status?: string;
  description?: string;
  item: unknown;
};

function haystack(value: unknown): string {
  return JSON.stringify(value ?? "").toLowerCase();
}

export async function GET(req: NextRequest) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().toLowerCase();
  const results: Result[] = [];

  for (const page of manifest.pages ?? []) {
    if (!q || haystack(page).includes(q)) {
      results.push({ type: "page", key: page.page_key, label: page.name, status: page.status, description: page.role, item: page });
    }
  }

  for (const component of manifest.components ?? []) {
    if (!q || haystack(component).includes(q)) {
      results.push({ type: "component", key: component.component_key, label: component.name, status: component.status, description: component.type, item: component });
    }
  }

  for (const sw of manifest.switches ?? []) {
    if (!q || haystack(sw).includes(q)) {
      results.push({ type: "switch", key: sw.key, label: sw.label, status: sw.status, description: sw.description, item: sw });
    }
  }

  for (const api of manifest.apis ?? []) {
    if (!q || haystack(api).includes(q)) {
      results.push({ type: "api", key: api.route, label: api.route, status: api.status, description: api.purpose, item: api });
    }
  }

  return NextResponse.json({ query: q, count: results.length, results });
}
