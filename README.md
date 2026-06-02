# Collectium admin users v20.1

Denne pakken inneholder:

```txt
components/admin/collectiumDemoUsers.ts
components/admin/AdminUserSearchInsightRow.tsx
styles/collectium-admin-users-v20-1.css
install-admin-users-v20-1.ps1
```

## Innhold

1. Retter TypeScript-feilen i `collectiumDemoUsers.ts`.
2. Gjør demo-brukerne til organiserte, styrte, organiske testprofiler med `activityBot` og `functionTests`.
3. Legger til ny boksrad for admin/brukere:
   - søk / sortering
   - antall synlige brukere
   - samlet samlingsverdi
   - type kunde/forhandler
   - styrte testprofiler
   - nye medlemmer etter Free/Bronze/Silver/Gold/Platinum
   - utvikling fra forrige måned
4. Legger til CSS-fix for Design/Varsler/Aktiviteter slik at panelene åpner som egne overlays og ikke inne i menyknappen.

## Bruk

Pakk ut ZIP i prosjektroten.

Kjør:

```powershell
powershell -ExecutionPolicy Bypass -File .\install-admin-users-v20-1.ps1
```

Så må du importere komponenten der admin/brukere rendres:

```tsx
import "@/styles/collectium-admin-users-v20-1.css";
import { AdminUserSearchInsightRow } from "@/components/admin/AdminUserSearchInsightRow";
```

Legg komponenten under øverste eksisterende boksrad:

```tsx
<AdminUserSearchInsightRow />
```

Test:

```powershell
npm.cmd run build
```

Hvis build er grønn:

```powershell
git status
git add components/admin/collectiumDemoUsers.ts components/admin/AdminUserSearchInsightRow.tsx styles/collectium-admin-users-v20-1.css app/admin/brukere/page.tsx components/admin/AdminUsersClient.tsx
git commit -m "Add Collectium admin users v20.1 insights and menu panel fix"
git push
```

Hvis `AdminUsersClient.tsx` ikke finnes, ignorer den i `git add`.
