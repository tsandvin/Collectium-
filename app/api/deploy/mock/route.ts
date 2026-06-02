import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (!body.confirmed) {
    return NextResponse.json({
      ok: false,
      status: "not_confirmed",
      message: "Deploy krever andre bekreftelse."
    }, { status: 400 });
  }

  if (!body.preflightId) {
    return NextResponse.json({
      ok: false,
      status: "missing_preflight",
      message: "Preflight mangler. Kjør første bekreftelse først."
    }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    status: "mock_deployed",
    deployId: `mock-deploy-${Date.now()}`,
    mode: "mock_staging",
    message: "Mock deploy fullført. Ingen live filer er skrevet.",
    received: {
      preflightId: body.preflightId,
      file: body.file ?? null,
      changeSummary: body.changeSummary ?? ""
    }
  });
}
