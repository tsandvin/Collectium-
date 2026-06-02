import { NextRequest, NextResponse } from "next/server";

type Finding = {
  level: "ok" | "warning" | "blocker";
  title: string;
  detail: string;
};

function staticReview(content: string, fileName: string): Finding[] {
  const findings: Finding[] = [];

  if (!content || content.trim().length < 10) {
    findings.push({ level: "blocker", title: "Tom eller manglende fil", detail: "Filen har ikke nok innhold til trygg deploy." });
  }

  if (content.includes("<<<<<<<") || content.includes("=======") || content.includes(">>>>>>>")) {
    findings.push({ level: "blocker", title: "Merge conflict", detail: "Filen inneholder konfliktmarkører." });
  }

  if (/DROP\s+TABLE|TRUNCATE\s+TABLE|DELETE\s+FROM/i.test(content)) {
    findings.push({ level: "blocker", title: "Farlig databaseoperasjon", detail: "Filen inneholder SQL som kan slette data." });
  }

  if (/mysqli_query|PDO\s*\(|fetch\s*\(\s*['"]\/app\/api\/admin/i.test(content) && /POST|DELETE|PUT/i.test(content)) {
    findings.push({ level: "warning", title: "Mulig skriveoperasjon", detail: "Filen kan kalle API eller DB-skriving. Krever route whitelist og tilgangssjekk." });
  }

  if (/TODO|FIXME|console\.log/i.test(content)) {
    findings.push({ level: "warning", title: "Utviklingsmarkør", detail: "Filen inneholder TODO/FIXME/console.log." });
  }

  if (fileName.includes("Index.php") || fileName.includes("index.php") || fileName.includes("header.php") || fileName.includes(".htaccess")) {
    findings.push({ level: "blocker", title: "Låst kjernefil", detail: "Collectium-regel: ikke overskriv index/header/.htaccess/global systemfiler uten eksplisitt godkjenning." });
  }

  if (/source_key/.test(content) && !/object_group/.test(content)) {
    findings.push({ level: "warning", title: "Ufullstendig katalogscope", detail: "source_key finnes, men object_group mangler. Katalogdata bør scopes med source_key + object_group + object_id." });
  }

  if (!findings.some((f) => f.level === "blocker")) {
    findings.push({ level: "ok", title: "Ingen blokkerende feil funnet", detail: "Statisk preflight fant ingen åpenbare blockers." });
  }

  return findings;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const content = String(body.content ?? "");
  const fileName = String(body.file?.path ?? body.file?.name ?? "unknown");
  const findings = staticReview(content, fileName);
  const blockers = findings.filter((f) => f.level === "blocker");
  const warnings = findings.filter((f) => f.level === "warning");

  let aiNote = "";
  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = [
        "Du er Collectium deploy preflight reviewer.",
        "Svar kort på norsk.",
        "Sjekk filen for React/Next/PHP/API/DB-risiko, Collectium-regler og frontendfeil.",
        "Fil: " + fileName,
        "Innhold:",
        content.slice(0, 7000)
      ].join("\n");

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1
        })
      });
      if (res.ok) {
        const data = await res.json();
        aiNote = data.choices?.[0]?.message?.content ?? "";
      }
    } catch {
      aiNote = "";
    }
  }

  const status = blockers.length ? "blocked" : warnings.length ? "warning" : "ok";

  return NextResponse.json({
    preflightId: `preflight-${Date.now()}`,
    status,
    fileName,
    findings,
    aiNote: aiNote || "Lokal preflight brukt. Legg inn OPENAI_API_KEY for AI-gjennomgang.",
    canDeploy: blockers.length === 0,
    requiresSecondConfirmation: blockers.length === 0
  });
}
