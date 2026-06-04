# Collectium · Objektpresentasjon · skinn-lydig

Helt egen design som **følger brukerens valg av skinn fra Design-megamenyen** (Collectium / Enkel / Museum / Finans). Hele siden refererer kun til v5-tokens (`--ct-*`) — ingen hardkodede farger, ingen hardkodede fonter, ingen hardkodede aksenter.

---

## Slik er denne forskjellig fra forrige versjon

Forrige levering brukte en hardkodet blå-arkivpalett (`#eef4f8`, `#2e78b7`) som er en design-i-side. Det bryter designreglene dine:

> Vanlige sider skal IKKE definere bakgrunn, rammer, skygger, panel- eller kort-design. Templaten styrer all visuell identitet.

Denne versjonen er bygd om fra grunnen. Hver eneste farge, font og overflate kommer fra `--ct-*`-variablene definert i globals.css. Resultat: når brukeren velger Museum fra Design-knappen i sidemenyen, blir hele objektpresentasjonen mørk med gull-aksent og Cinzel-typografi — uten at en eneste linje kode på sidens nivå må endres.

---

## Hva du får

```
app/
├── objekt/[sourceKey]/[objectGroup]/[objectId]/
│   ├── page.tsx                          Server component (validering + datahenting)
│   ├── ObjectPresentation.tsx            Client — hele visningen i én fil
│   ├── styles.module.css                 Skin-lydig CSS-modul (kun --ct-*)
│   ├── types.ts                          TypeScript-datakontrakten
│   └── mock-data.ts                      Eksempeldata (NS 1 459 Oscar II)
└── api/object/presentation/route.ts      GET /api/object/presentation

preview/
└── objekt-skin-demo.html                 Standalone HTML med skin-velger
```

---

## De fire skinene

Designet er bygd og testet for alle fire:

| Skinn | Bakgrunn | Aksent | Display-font | Stemning |
|-------|----------|--------|--------------|----------|
| **Collectium** (standard) | Pergament | Grønn + gull | Playfair Display | Klassisk samlerarkiv |
| **Enkel** | Hvit | Skandinavisk blå | Fraunces | Minimalistisk, ren |
| **Museum** | Mørk koks | Antikk gull | Cinzel | Galleri, formelt |
| **Finans** | Mørk teal | Smaragd | IBM Plex Sans | Terminal, datatung |

**Hvordan det fungerer**: Globals.css definerer `--ct-*`-tokens per skinn under `html[data-template="..."]`. Megamenyen din skriver `document.documentElement.dataset.template = "museum"`. Det utløser CSS-cascade-bytte på alle elementer som bruker `var(--ct-accent)` osv. — som er hver eneste farge på objektsiden.

**Hvor du ser den faktiske obediensen**: Åpne `preview/objekt-skin-demo.html`. Skinn-velgeren oppe til høyre bytter `data-template` på `<html>`. Samme DOM, samme komponenter, fire helt forskjellige visuelle uttrykk.

---

## Tokens som brukes (revisjonssjekkliste)

CSS-modulen refererer **kun** til disse — ingen hex-kodede farger noensteds:

**Farger**
- `--ct-text`, `--ct-text-soft`, `--ct-text-muted`
- `--ct-accent`, `--ct-accent-dark`, `--ct-accent-soft`
- `--ct-signature`, `--ct-watermark`
- `--ct-status-ok`, `--ct-status-pending`, `--ct-status-rejected`

**Overflater**
- `--ct-panel-bg`, `--ct-panel-solid`, `--ct-card-bg`
- `--ct-panel-border`, `--ct-border-strong`, `--ct-line`
- `--ct-app-button-bg`, `--ct-app-button-border`

**Fonter**
- `--ct-font-display`, `--ct-font-body`, `--ct-font-ui`, `--ct-font-mono`
- Skinn-spesifikk fontoppførsel via `:global(html[data-template="finans"])` for monospace overrides

**Geometri**
- `--ct-radius`, `--ct-radius-card`, `--ct-radius-pill`
- `--ct-content-pad`
- `--w-display`, `--w-body`, `--w-ui`

Eneste hardkodede verdi i hele filen er `rgba(255,255,255,.x)` for inset highlights og noen lave-opasitet skygger — disse er rene optiske detaljer (et lite høylys på topp av kort) som er trygt skin-uavhengige.

---

## Designvalg

Designet er **mitt eget** (ikke porteringen av HTML-malen din), bygget rundt fire prinsipper:

1. **Editorial museum**: Hero har et "display case" på venstre side med en stilisert objektplate, og redaksjonell typografi-komposisjon på høyre side. Ingen SaaS-dashboard-følelse.

2. **Kapittel-tabs** (I · II · III · IV) med romertall: Mer arkiv enn app. Underlinje istedenfor bokset tabs. Romertall-prefiksene gir leseren en plassholder i fortellingen.

3. **Felt med stiplet line**: Hver field-rad er label/verdi med en stiplet linje under. Det er klassisk katalogtypografi. "Henter fra ct_v_..." vises tydelig på manglende felter.

4. **Bar-chart med proporsjonale høyder**: 08 VG (3 000 kr) → 67 SGUNC (95 000 kr) er en faktor på 32×. Det vises ærlig i barene istedenfor falsk-flate verdier.

---

## Den låste URL-strukturen

```
/objekt/[sourceKey]/[objectGroup]/[objectId]
```

`page.tsx` validerer:
- `objectGroup` ∈ `{ banknote, coin, collectible }` → ellers 404
- `objectId` må være numerisk → ellers 404
- `?segment=` ∈ `{ samler, historie, finans, minsamling }` → ellers `samler`
- `?view=` ∈ `{ horizontal, museum, compact }` → ellers `horizontal`

Trippelnøkkelen `source_key + object_group + object_id` håndheves konsekvent i URL, API og typer.

---

## DB 8.4-kjeden

Alle dataverdier er `SourcedValue<T>` som vet hvilken view de leses fra:

| Sone | View |
|------|------|
| Identitet, Utgave, Raritet | `ct_v_catalog_objects_resolved` |
| Tittel | `ct_v_catalog_object_titles` |
| Bilder | `ct_v_catalog_object_images_resolved` |
| Konge, signatur, motiv | `ct_v_catalog_relations` |
| Markedsverdi per kvalitet | `ct_v_catalog_market_summary` |
| Lønn, valuta, politikk | `ct_v_catalog_year_context` |
| Kjøp og eierskap | `ct_user_collection_objects` |
| Notater | `ct_user_collection_object_notes` |
| Dokumenter/bilder | `ct_user_collection_object_files` |
| Spesifikasjoner | `ct_user_collection_object_specs` |
| Deling | `ct_object_share_links` |

Manglende verdier viser **"Henter fra `ct_v_…`"** i italic muted typografi.

---

## Handlinger og feature_keys

| Handling | feature_key | API |
|----------|-------------|-----|
| Hjerte (ønskeliste) | `collection.wishlist.toggle` | `POST /api/collection/wishlist-toggle` |
| Stjerne (favoritt) | `collection.favorite.toggle` | `POST /api/collection/favorite-toggle` |
| Legg i samling | `collection.item.add` | `POST /api/collection/add` |
| Del objekt | `object.share.create` | `POST /api/object/share-create` |
| Sammenlign | `object.compare` | client + `POST /api/object/compare` |
| Åpne relasjon | `object.relations.view` | navigasjon |
| Lagre notat | `collection.note.save` | `POST /api/collection/notes` |
| Endre spesifikasjon | `collection.spec.update` | `PATCH /api/collection/specs` |

Status-knappene gjør **optimistisk UI** med rollback ved feil.

---

## Tre visningsmodi

Velges fra sidepanelet og overstyrer hero-layout:

- **Horisontal**: balansert bilde + info ved siden av (standard)
- **Museum**: bilde dominerer, info skrumper til smal stripe
- **Kompakt**: bilde i full bredde, info under (mobil-vennlig)

Implementert via `.viewHorizontal`, `.viewMuseum`, `.viewCompact` på rotelementet. Ren CSS, ingen JS-omarrangering.

---

## Slik integrerer du

1. **Slipp `app/objekt/[sourceKey]/[objectGroup]/[objectId]/`** inn i Next.js-prosjektet ditt
2. **Slipp `app/api/object/presentation/route.ts`** inn samme prosjekt (erstatt Prisma-pseudokoden med ekte DB-spørringer)
3. **Erstatt `mockObjectData`** i `page.tsx` med ekte API-kall (skissen er ut-kommentert i koden)
4. **Implementer handlere** via en wrapper-komponent:

   ```tsx
   <ObjectPresentation
     data={data}
     handlers={{
       onWishlistToggle: async (key, next) =>
         fetch("/api/collection/wishlist-toggle", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ ...key, next }),
         }),
       onShareCreate: async (key, hours) => {
         const res = await fetch("/api/object/share-create", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ ...key, hours }),
         });
         return res.json();
       },
       // ...
     }}
   />
   ```

5. **Logging**: send `feature_key=object.presentation.view` til `ct_event_log` i API-ruten (markert TODO).

---

## Verifiser at skin-lydigheten fungerer

Åpne `preview/objekt-skin-demo.html` i nettleser. Klikk på de fire skinn-knappene oppe til høyre:

1. **Collectium** — pergament-bakgrunn, grønn-gull aksent, Playfair-titler
2. **Enkel** — hvit bakgrunn, blå aksent, Fraunces-titler, mindre kursiv
3. **Museum** — mørk bakgrunn, gull-aksent, Cinzel-fonter med sperret bokstavavstand
4. **Finans** — mørk teal, smaragd-aksent, IBM Plex Sans, monospace-verdier

Samme DOM, samme komponenter, fire forskjellige visuelle uttrykk. Det er beviset på at designet respekterer brukerens skinn-valg.

---

## Hva du bør si fra om

1. **Globals.css-versjon**: jeg har antatt at v5-tokens (`--ct-app-bg`, `--ct-accent`, `--ct-font-display` osv.) er låste navn fra ditt eksisterende `app/globals.css`. Hvis du har endret/utvidet noen, kan jeg justere CSS-modulen — bare last opp den nyeste globals.css.
2. **Hero-bilde**: stilisert plate i `--ct-accent-soft`-gradient fungerer som plassholder. Når `ct_v_catalog_object_images_resolved` returnerer faktiske bilde-URL-er, byttes den ut automatisk via `<img>` i banknote-elementet.
3. **De andre API-rutene**: skal jeg skrive `/api/collection/wishlist-toggle`, `/api/object/share-create`, `/api/collection/notes`, `/api/collection/specs`? Hver er ~30 linjer.
4. **Skinn-spesifikke detaljer**: vil du ha mer markerte forskjeller mellom skin-ene? F.eks. mer pyntelig signaturhjørne i Museum, eller mer minimalistisk i Enkel?
