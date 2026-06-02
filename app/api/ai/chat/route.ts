import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const context = body.context ?? {};
  const last = messages[messages.length - 1]?.content ?? "";

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      reply:
        "Lokal AI-modus:\n\n" +
        "Jeg ser valgt element, valgt kildeobjekt og prosjektdata. Legg inn OPENAI_API_KEY i .env.local for ekte ChatGPT-lignende respons.\n\n" +
        "Foreslått neste steg:\n" +
        "1. Velg et element i lagpanelet.\n" +
        "2. Be meg lage bedre tekst, komponentnavn, props eller DB-kobling.\n" +
        "3. Bruk Eksporter mappe for å lagre prosjektet i egen mappe.\n\n" +
        "Siste melding: " + last + "\n\n" +
        "Kontekst: " + JSON.stringify(context, null, 2).slice(0, 1400)
    });
  }

  const system = [
    "Du er Collectium sin innebygde AI-designer og frontend/database-assistent.",
    "Svar på norsk, konkret og praktisk.",
    "Du kan hjelpe med React-komponenter, UI-tekst, Collectium-regler, databasefelt og eksportstruktur.",
    "Husk at React/Next.js er frontend, mens MariaDB/API er source of truth.",
    "Objekter identifiseres med source_key + object_group + object_id.",
    "denomination_issue_raw_no skal vises som Valørutgave / serie."
  ].join("\n");

  const apiMessages = [
    { role: "system", content: system },
    {
      role: "user",
      content:
        "Prosjektkontekst:\n" +
        JSON.stringify(context, null, 2).slice(0, 6000)
    },
    ...messages.map((m: any) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? "")
    }))
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: apiMessages,
      temperature: 0.25
    })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json({
      reply: "AI API-feil. Sjekk OPENAI_API_KEY og OPENAI_MODEL.\n\n" + text.slice(0, 600)
    });
  }

  const data = await res.json();
  return NextResponse.json({
    reply: data.choices?.[0]?.message?.content ?? "Ingen respons."
  });
}
