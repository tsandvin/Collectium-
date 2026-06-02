# AI og eksport v1.0

## AI
AI-panelet sender følgende kontekst til `/api/ai/chat`:
- valgt element
- valgt kildeobjekt
- frame-tittel
- antall lag
- Collectium filterrekkefølge

Uten `OPENAI_API_KEY` brukes lokal mockrespons.

## Eksporter mappe
Browseren bruker File System Access API når tilgjengelig.

Eksportert mappe inneholder:
- `project.json`
- `frame.json`
- `current-object.json`
- `ExportedCollectiumPage.tsx`
- `README.md`

Hvis File System Access API ikke finnes, lastes en JSON-fil ned som fallback.
