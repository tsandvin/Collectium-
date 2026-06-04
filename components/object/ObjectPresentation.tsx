"use client";

// components/object/ObjectPresentation.tsx
//
// SKIN-LYDIG objektpresentasjon.
//
// Komponentene refererer kun til --ct-*-tokens via ObjectPresentation.module.css.
// Når brukeren bytter skinn (Collectium / Enkel / Museum / Finans) via
// Design-megamenyen, transformeres hele denne siden automatisk.
//
// Strukturen følger speccen din:
//   Hero (display case + editorial info + 4 stat-blokker)
//   Chapter tabs (I. Samler · II. Historie · III. Finans · IV. I min samling)
//   4 paneler med relasjoner, kort og felt
//   Side panel (Aktiv visning · Status · Del visning)

import { useEffect, useMemo, useState } from "react";
import styles from "./ObjectPresentation.module.css";
import type {
  ImageMode,
  ObjectKey,
  ObjectPresentationData,
  ObjectRelationLink,
  ObjectViewHandlers,
  Segment,
  SourcedValue,
  ViewMode,
} from "../../lib/object/types";

type Props = {
  data: ObjectPresentationData;
  initialSegment?: Segment;
  initialView?: ViewMode;
  from?: string;
  handlers?: ObjectViewHandlers;
};

const CHAPTERS: Array<{ key: Segment; label: string; roman: string }> = [
  { key: "samler", label: "Samler", roman: "I" },
  { key: "historie", label: "Historie", roman: "II" },
  { key: "finans", label: "Finans", roman: "III" },
];

const VIEW_OPTS: Array<{ key: ViewMode; label: string }> = [
  { key: "horizontal", label: "Horisontal" },
  { key: "museum", label: "Museum" },
  { key: "compact", label: "Kompakt" },
];

const HOURS = [6, 12, 18, 24, 48];

const IMAGE_MODES: Array<{ key: ImageMode; label: string }> = [
  { key: "forside", label: "Forside" },
  { key: "bakside", label: "Bakside" },
  { key: "gjennomlysning_forside", label: "Gjennomlysning" },
  { key: "variant_forside", label: "Variant" },
  { key: "detalj", label: "Detalj" },
];

function isMissing(v: unknown) {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v === "") return true;
  return false;
}

function valueOrSource<T>(field: SourcedValue<T>): string {
  return isMissing(field.value)
    ? `Henter fra ${field.source}`
    : String(field.value);
}

/* ----------------------------------------------------------------
 * Field
 * ---------------------------------------------------------------- */
function Field<T = string>({
  label,
  field,
}: {
  label: string;
  field: SourcedValue<T>;
}) {
  const missing = isMissing(field.value);
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={missing ? styles.fieldFade : styles.fieldValue}>
        {missing ? `Henter fra ${field.source}` : String(field.value)}
      </span>
    </div>
  );
}

/* ----------------------------------------------------------------
 * Locked signature (uses global .ct-sig from globals.css)
 * ---------------------------------------------------------------- */
function Sig() {
  return (
    <span className="ct-sig" aria-hidden>
      <span className="ct-sig-word">Collectium</span>
      <span className="ct-sig-corner" />
      <span className="ct-sig-rise" />
    </span>
  );
}

/* ----------------------------------------------------------------
 * Hero — display case + editorial info + 4 facts
 * ---------------------------------------------------------------- */
function Hero({
  data,
  imageMode,
  setImageMode,
}: {
  data: ObjectPresentationData;
  imageMode: ImageMode;
  setImageMode: (m: ImageMode) => void;
}) {
  const { identity, market, rarity, people, images } = data;
  const url = images.byMode[imageMode];

  return (
    <section className={styles.hero}>
      {/* Display case */}
      <div className={styles.stage}>
        <div className={styles.banknote}>
          {url ? (
            <img src={url} alt={identity.title} className={styles.banknoteImg} />
          ) : (
            <>
              <span className={styles.banknoteDenom}>
                {(identity.denomination.value ?? "")
                  .toString()
                  .replace(/\s*kroner?$/i, "")
                  .trim() || "—"}
              </span>
              <div className={styles.banknotePortrait} />
              <span className={styles.banknoteMeta}>
                {[
                  "Norges Bank",
                  people.ruler.value ?? "",
                  identity.publicationYear.value ?? "",
                ]
                  .filter(Boolean)
                  .join(" · ")
                  .toUpperCase()}
              </span>
              <span className={styles.banknoteSerial}>
                {identity.sourceCatalogNumber.value ?? ""}
              </span>
            </>
          )}
        </div>
        <div className={styles.stageTabs}>
          {IMAGE_MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              className={`${styles.stageTab} ${imageMode === m.key ? styles.stageTabOn : ""}`}
              onClick={() => setImageMode(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <Sig />
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.kickerLine}>
          <span className={styles.kickerDot} />
          {[
            identity.country.value ?? "Norge",
            identity.objectTypeLabel,
            data.object_key.source_key,
          ].join(" · ")}
        </div>
        <h1 className={styles.title}>{identity.title}</h1>
        {data.identity.objectTypeLabel && (
          <p className={styles.lead}>
            {[
              `Tidlig hovedvalør fra ${identity.country.value ?? "den norske"} seddelhistorien`,
              people.ruler.value ? `under ${people.ruler.value}` : null,
              rarity.estimatedByQuantity.value
                ? `Sjeldenhet: ${rarity.estimatedByQuantity.value.toLowerCase()}`
                : null,
              people.motif.value ? `Motiv: ${people.motif.value}` : null,
            ]
              .filter(Boolean)
              .join(" · ")
              .concat(".")}
          </p>
        )}

        <div className={styles.stats}>
          <Stat
            label="Markedsverdi"
            value={market.headlineValue.value}
            source={market.headlineValue.source}
            sub="45 XF"
          />
          <Stat
            label="Trend 12 mnd"
            value={market.trend.value}
            source={market.trend.source}
            sub={market.liquidity.value ?? undefined}
            tone={
              market.trend.value && String(market.trend.value).startsWith("-")
                ? "down"
                : "up"
            }
          />
          <Stat
            label="Sjeldenhet"
            value={rarity.estimatedByQuantity.value}
            source={rarity.estimatedByQuantity.source}
            sub={rarity.catalogAssessment.value ?? undefined}
          />
          <Stat
            label="Konge"
            value={people.ruler.value}
            source={people.ruler.source}
            sub={identity.objectYear.value ?? undefined}
          />
        </div>
      </div>

      <Sig />
    </section>
  );
}

function Stat({
  label,
  value,
  source,
  sub,
  tone,
}: {
  label: string;
  value: string | null | undefined;
  source: string;
  sub?: string;
  tone?: "up" | "down";
}) {
  const missing = isMissing(value);
  const cls = [
    styles.stat,
    tone === "up" ? styles.statUp : "",
    tone === "down" ? styles.statDown : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls}>
      <span className={styles.statLabel}>{label}</span>
      <span className={missing ? styles.statValueFade : styles.statValue}>
        {missing ? `Henter fra ${source}` : String(value)}
      </span>
      {sub && <span className={styles.statSub}>{sub}</span>}
    </div>
  );
}

/* ----------------------------------------------------------------
 * Card (reusable)
 * ---------------------------------------------------------------- */
function Card({
  title,
  roman,
  children,
  wide,
}: {
  title: string;
  roman?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <article className={`${styles.card} ${wide ? styles.wide : ""}`}>
      <h3 className={styles.cardTitle}>
        {roman && <span className={styles.cardRoman}>{roman}</span>}
        {title}
      </h3>
      {children}
      <Sig />
    </article>
  );
}

/* ----------------------------------------------------------------
 * Panel: Samler
 * ---------------------------------------------------------------- */
function SamlerPanel({ data }: { data: ObjectPresentationData }) {
  const { identity, issue, rarity, images } = data;
  return (
    <div className={styles.grid3}>
      <Card title="Identitet" roman="i">
        <Field label="Katalognummer" field={identity.sourceCatalogNumber} />
        <Field label="Lokalt nr." field={identity.localCatalogNumber} />
        <Field label="Pick / referanse" field={identity.pickCatalogNumber} />
        <Field label="Valør" field={identity.denomination} />
        <Field label="Objektår" field={identity.objectYear} />
        <Field label="Land" field={identity.country} />
      </Card>

      <Card title="Utgave" roman="ii">
        <Field label="Valørutgave" field={issue.denominationIssue} />
        <Field label="Litra" field={issue.litra} />
        <Field label="Variant" field={issue.variantType} />
        <Field label="Utgivelsesår" field={issue.releaseYear} />
        <Field label="Slutt produksjon" field={issue.productionEndYear} />
      </Card>

      <Card title="Raritet" roman="iii">
        <Field label="Estimert sjeldenhet" field={rarity.estimatedByQuantity} />
        <Field label="Katalogvurdering" field={rarity.catalogAssessment} />
        <Field label="Valørgruppe" field={rarity.denominationGroupCount} />
        <Field label="Signaturmengde" field={rarity.signatureQuantity} />
        <Field label="Destruert" field={rarity.destroyedQuantity} />
      </Card>

      <article className={`${styles.card} ${styles.wide}`}>
        <h3 className={styles.cardTitle}>
          <span className={styles.cardRoman}>iv</span>Bilder
        </h3>
        <div className={styles.grid3}>
          {(
            [
              ["forside", "Forside"],
              ["bakside", "Bakside"],
              ["gjennomlysning_forside", "Gjennomlysning fs"],
              ["gjennomlysning_bakside", "Gjennomlysning bs"],
              ["variant_forside", "Variant forside"],
              ["variant_bakside", "Variant bakside"],
            ] as const
          ).map(([key, label]) => {
            const v = images.byMode[key as keyof typeof images.byMode];
            return (
              <Field
                key={key}
                label={label}
                field={{ value: v ?? null, source: images.source }}
              />
            );
          })}
        </div>
        <Sig />
      </article>
    </div>
  );
}

/* ----------------------------------------------------------------
 * Panel: Historie
 * ---------------------------------------------------------------- */
function HistoriePanel({
  data,
  onOpenRelation,
}: {
  data: ObjectPresentationData;
  onOpenRelation?: (key: ObjectKey, rel: ObjectRelationLink) => void;
}) {
  const { people, yearContext, identity, relations, object_key } = data;

  // Ruler initials → "Oscar II" → "O2"
  const initials = useMemo(() => {
    const s = (people.ruler.value ?? "").trim();
    if (!s) return "—";
    const parts = s.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    const last = parts[parts.length - 1];
    if (/^[IVX]+$/.test(last)) return parts[0][0].toUpperCase() + last;
    return parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  }, [people.ruler.value]);

  return (
    <>
      <div className={styles.grid2}>
        <Card title="Konge · Regent" roman="i">
          <div className={styles.ruler}>
            <div className={styles.rulerPortrait}>{initials}</div>
            <div className={styles.rulerInfo}>
              <p>
                <strong>{people.ruler.value ?? "—"}</strong>
                {identity.objectYear.value ? ` · regent ${identity.objectYear.value}` : ""}
              </p>
              <Field label="Historisk regent" field={people.historicalRuler} />
              <Field label="Union / periode" field={yearContext.historicalUnionPeriod} />
            </div>
          </div>
        </Card>

        <Card title="Signatur · Motiv" roman="ii">
          <Field label="Signatur" field={people.signature} />
          <Field label="Venstre motiv" field={people.leftPortraitSubject} />
          <Field label="Høyre motiv" field={people.rightPortraitSubject} />
          <Field label="Motiv" field={people.motif} />
        </Card>
      </div>

      <article className={`${styles.card} ${styles.wide}`}>
        <h3 className={styles.cardTitle}>
          <span className={styles.cardRoman}>iii</span>Historisk kontekst
        </h3>
        <div className={styles.grid3}>
          <Field label="Hendelser" field={yearContext.historicalYearEvents} />
          <Field label="Statsminister" field={yearContext.primeMinister} />
          <Field label="Parti / fokus" field={yearContext.political_party} />
        </div>
        <Sig />
      </article>

      <article className={`${styles.card} ${styles.wide}`}>
        <h3 className={styles.cardTitle}>
          <span className={styles.cardRoman}>iv</span>Relasjoner
        </h3>
        <div className={styles.rels}>
          {relations.length === 0 && (
            <p className={styles.fieldFade}>Relasjon ikke registrert</p>
          )}
          {relations.map((rel) => (
            <button
              key={rel.action_key}
              type="button"
              className={styles.rel}
              onClick={() => onOpenRelation?.(object_key, rel)}
            >
              <div>
                <div className={styles.relName}>{rel.label}</div>
                <div className={styles.relDesc}>{rel.description}</div>
              </div>
              <div className={styles.relArrow}>→</div>
            </button>
          ))}
        </div>
        <Sig />
      </article>
    </>
  );
}

/* ----------------------------------------------------------------
 * Panel: Finans (with bar chart)
 * ---------------------------------------------------------------- */
function FinansPanel({ data }: { data: ObjectPresentationData }) {
  const { market, yearContext } = data;
  const gradeOrder = [
    "08 VG", "15 CF", "25 VF", "35 CVF", "45 XF",
    "53 AUNC", "60 UNC", "63 CUNC", "65 GUNC", "67 SGUNC",
  ] as const;

  const entries = gradeOrder
    .map((g) => ({ grade: g, field: market.marketGrades[g] }))
    .filter((e) => e.field !== undefined);

  const numericValues = entries
    .map((e) => parseNum(e.field?.value ?? null))
    .filter((n): n is number => n !== null);
  const max = numericValues.length > 0 ? Math.max(...numericValues) : 0;

  return (
    <>
      <div className={styles.grid2}>
        <Card title="Markedsverdi per kvalitet" roman="i">
          {entries.length === 0 ? (
            <p className={styles.fieldFade}>
              Henter data fra {market.headlineValue.source}
            </p>
          ) : (
            <div className={styles.chart}>
              {entries.map(({ grade, field }) => {
                const n = parseNum(field?.value ?? null);
                const heightPct =
                  n !== null && max > 0 ? Math.max((n / max) * 100, 8) : 12;
                const missing = n === null;
                return (
                  <div
                    key={grade}
                    className={`${styles.bar} ${missing ? styles.barMiss : ""}`}
                    style={{ height: `${heightPct}%` }}
                    title={`${grade}: ${field?.value ?? "Ikke vurdert"}`}
                  >
                    {!missing && n !== null && (
                      <span className={styles.barValue}>
                        {n.toLocaleString("no-NO")}
                      </span>
                    )}
                    <span className={styles.barLabel}>{grade.split(" ")[0]}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card title="Marked og salg" roman="ii">
          <Field label="Verdi 45 XF" field={market.headlineValue} />
          <Field label="Trend 12 mnd" field={market.trend} />
          <Field label="Likviditet" field={market.liquidity} />
          <Field label="Auksjoner i år" field={market.auction} />
          <Field label="Nettbutikk" field={market.shop} />
          <Field label="Sist solgt" field={market.lastSold} />
        </Card>
      </div>

      <div className={`${styles.grid3} ${styles.wide}`}>
        <Card title="Publiseringsår" roman="iii">
          <Field label="Publisert" field={yearContext.publicationYear} />
          <Field label="Relaterte sedler" field={yearContext.relatedBanknoteYearCount} />
          <Field label="Katalogår" field={yearContext.banknoteCatalogYear} />
          <Field label="Kjøpekraft i dag" field={yearContext.purchasingPowerValue} />
        </Card>
        <Card title="Lønn · Befolkning" roman="iv">
          <Field label="Gjennomsnittslønn" field={yearContext.averageSalary} />
          <Field label="Årlig prisvekst" field={yearContext.annualPriceGrowthPercent} />
          <Field label="Befolkning" field={yearContext.population} />
          <Field label="10-års endring" field={yearContext.populationChange10YearCount} />
        </Card>
        <Card title="Renter · Metall" roman="v">
          <Field label="Utlånsrente" field={yearContext.lendingRateNorway} />
          <Field label="Gull USD/oz" field={yearContext.usdGoldPrice} />
          <Field label="Sølv USD/oz" field={yearContext.usdSilverPrice} />
          <Field label="SEK · DKK" field={yearContext.sekRate} />
        </Card>
      </div>
    </>
  );
}

function parseNum(s: string | null): number | null {
  if (isMissing(s)) return null;
  const m = String(s).replace(/\s+/g, "").match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/* ----------------------------------------------------------------
 * Panel: Min Samling
 * ---------------------------------------------------------------- */
function MinSamlingPanel({
  data,
  onSaveNote,
  onUpdateSpec,
  onNotify,
}: {
  data: ObjectPresentationData;
  onSaveNote?: (key: ObjectKey, text: string) => Promise<void>;
  onUpdateSpec?: (key: ObjectKey, label: string, value: string) => Promise<void>;
  onNotify: (msg: string) => void;
}) {
  const { collection, object_key } = data;
  const [note, setNote] = useState<string>(
    isMissing(collection.notes.latest.value)
      ? ""
      : String(collection.notes.latest.value),
  );

  async function handleSave() {
    if (!note.trim()) return;
    try {
      await onSaveNote?.(object_key, note);
      onNotify("Notat lagret");
    } catch {
      onNotify("Kunne ikke lagre notat");
    }
  }

  function editSpec(label: string) {
    const v = window.prompt(`Ny verdi for ${label}`);
    if (v !== null) {
      onUpdateSpec?.(object_key, label, v);
      onNotify(`${label} oppdatert`);
    }
  }

  return (
    <>
      <div className={styles.grid4}>
        <Card title="Kjøp" roman="i">
          <Field label="Dato" field={collection.purchase.date} />
          <Field label="Sted" field={collection.purchase.place} />
          <Field label="Av" field={collection.purchase.seller} />
          <Field
            label="Pris"
            field={{
              value:
                collection.purchase.price.value !== null
                  ? `${collection.purchase.price.value} ${collection.purchase.currency}`
                  : null,
              source: collection.purchase.price.source,
            }}
          />
        </Card>
        <Card title="Kvalitet" roman="ii">
          <Field label="Min kvalitet" field={collection.quality.grade} />
          <Field label="Gradering" field={collection.quality.detailedGrade} />
          <Field label="Plassering" field={collection.quality.location} />
          <Field label="Synlighet" field={collection.quality.visibility} />
        </Card>
        <Card title="Notater" roman="iii">
          <textarea
            className={styles.note}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Henter fra ${collection.notes.source}`}
            rows={4}
          />
          <div className={styles.noteActions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleSave}
              disabled={!note.trim()}
            >
              Lagre
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={() => onNotify("Historikk åpnet")}
            >
              Historikk
            </button>
          </div>
        </Card>
        <Card title="Filer" roman="iv">
          <Field label="Kvittering" field={collection.files.receipt} />
          <Field label="Egne bilder" field={collection.files.ownPhotos} />
          <Field label="Forside scan" field={collection.files.obverseScan} />
          <Field label="Bakside scan" field={collection.files.reverseScan} />
        </Card>
      </div>

      <article className={`${styles.card} ${styles.wide}`}>
        <h3 className={styles.cardTitle}>
          <span className={styles.cardRoman}>v</span>Egne spesifikasjoner
        </h3>
        <div className={styles.specs}>
          {collection.ownSpecs.map((spec) => {
            const missing = isMissing(spec.value.value);
            return (
              <div key={spec.label} className={styles.specRow}>
                <strong>{spec.label}</strong>
                <span className={missing ? styles.specVal : styles.fieldValue}>
                  {missing
                    ? `Henter fra ${spec.value.source}`
                    : String(spec.value.value)}
                </span>
                <button type="button" onClick={() => editSpec(spec.label)}>
                  Endre
                </button>
              </div>
            );
          })}
        </div>
        <Sig />
      </article>
    </>
  );
}

/* ----------------------------------------------------------------
 * SidePanel — view chips · status · share
 * ---------------------------------------------------------------- */
function SidePanel({
  data,
  view,
  setView,
  handlers,
  onNotify,
}: {
  data: ObjectPresentationData;
  view: ViewMode;
  setView: (v: ViewMode) => void;
  handlers: ObjectViewHandlers;
  onNotify: (msg: string) => void;
}) {
  const { collection, sharing, object_key } = data;
  const [hours, setHours] = useState<number>(sharing.defaultHours);
  const [link, setLink] = useState<string>("");
  const [wishlist, setWishlist] = useState(collection.isWishlist);
  const [favorite, setFavorite] = useState(collection.isFavorite);
  const [inCollection, setInCollection] = useState(collection.isInCollection);

  async function toggleWishlist() {
    const next = !wishlist;
    setWishlist(next);
    try {
      await handlers.onWishlistToggle?.(object_key, next);
      onNotify(next ? "Lagt til ønskeliste" : "Fjernet");
    } catch {
      setWishlist(!next);
    }
  }
  async function toggleFavorite() {
    const next = !favorite;
    setFavorite(next);
    try {
      await handlers.onFavoriteToggle?.(object_key, next);
      onNotify(next ? "Favoritt" : "Favoritt fjernet");
    } catch {
      setFavorite(!next);
    }
  }
  async function addCollection() {
    const prev = inCollection;
    setInCollection(true);
    try {
      await handlers.onAddToCollection?.(object_key);
      onNotify("Lagt til samlingen");
    } catch {
      setInCollection(prev);
    }
  }
  async function share() {
    if (!handlers.onShareCreate) {
      const url = `https://collectium.no/objekt/${object_key.source_key}/${object_key.object_group}/${object_key.object_id}?share=${hours}t`;
      setLink(url);
      onNotify("Lenke generert (lokal)");
      return;
    }
    try {
      const { url } = await handlers.onShareCreate(object_key, hours);
      setLink(url);
      onNotify("Lenke generert");
    } catch {
      onNotify("Kunne ikke generere");
    }
  }

  return (
    <aside className={styles.side}>
      <section className={styles.sideCard}>
        <h4>Aktiv visning</h4>
        <div className={styles.viewChips}>
          {VIEW_OPTS.map((v) => (
            <button
              key={v.key}
              type="button"
              className={`${styles.viewChip} ${view === v.key ? styles.viewChipOn : ""}`}
              onClick={() => {
                setView(v.key);
                onNotify(`Visning: ${v.label}`);
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
        <Sig />
      </section>

      <section className={styles.sideCard}>
        <h4>Status</h4>
        <div className={styles.statusList}>
          <StatusBtn
            icon="♡"
            title="Hjerte"
            sub="Ønskeliste"
            on={wishlist}
            onClick={toggleWishlist}
          />
          <StatusBtn
            icon="★"
            title="Stjerne"
            sub="Favoritt"
            on={favorite}
            onClick={toggleFavorite}
          />
          <StatusBtn
            icon="+"
            title={inCollection ? "I min samling" : "Legg i samling"}
            sub={inCollection ? "Eier objektet" : "Min samling"}
            primary
            onClick={addCollection}
          />
          <StatusBtn icon="↗" title="Del objekt" sub="Visningslenke" onClick={share} />
          <StatusBtn
            icon="⇄"
            title="Sammenlign"
            sub="Mot andre objekter"
            onClick={() => {
              handlers.onCompare?.(object_key);
              onNotify("Sammenligning åpnet");
            }}
          />
        </div>
        <Sig />
      </section>

      <section className={styles.sideCard}>
        <h4>Del visning</h4>
        <div className={styles.hours}>
          {HOURS.map((h) => (
            <button
              key={h}
              type="button"
              className={`${styles.hourChip} ${hours === h ? styles.hourChipOn : ""}`}
              onClick={() => setHours(h)}
            >
              {h}t
            </button>
          ))}
        </div>
        <Field
          label="Katalog"
          field={data.identity.sourceCatalogNumber}
        />
        <Field
          label="Tilgang"
          field={{
            value: `${hours} timer`,
            source: sharing.source,
          }}
        />
        <input
          className={styles.shareInput}
          value={link}
          placeholder="Trykk «Generer» for å lage lenke"
          readOnly
          onFocus={(e) => e.currentTarget.select()}
        />
        <div className={styles.shareActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={share}
          >
            Generer
          </button>
          {link && (
            <button
              type="button"
              className={styles.btn}
              onClick={() => {
                navigator.clipboard?.writeText(link);
                onNotify("Kopiert");
              }}
            >
              Kopier
            </button>
          )}
        </div>
        <Sig />
      </section>
    </aside>
  );
}

function StatusBtn({
  icon,
  title,
  sub,
  on,
  primary,
  onClick,
}: {
  icon: string;
  title: string;
  sub: string;
  on?: boolean;
  primary?: boolean;
  onClick: () => void;
}) {
  const cls = [
    styles.statusBtn,
    on ? styles.statusBtnOn : "",
    primary ? styles.statusBtnPrimary : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={cls} onClick={onClick}>
      <span className={styles.statusIcon}>{icon}</span>
      <div>
        <strong>{title}</strong>
        <small>{sub}</small>
      </div>
      <span />
    </button>
  );
}

/* ----------------------------------------------------------------
 * MAIN COMPONENT
 * ---------------------------------------------------------------- */
export default function ObjectPresentation({
  data,
  initialSegment = "samler",
  initialView = "horizontal",
  from = "katalog",
  handlers = {},
}: Props) {
  const [segment, setSegment] = useState<Segment>(initialSegment);
  const [view, setView] = useState<ViewMode>(initialView);
  const [imageMode, setImageMode] = useState<ImageMode>("forside");
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  function notify(msg: string) {
    setToast(msg);
  }

  const viewClass =
    view === "museum"
      ? styles.viewMuseum
      : view === "compact"
        ? styles.viewCompact
        : styles.viewHorizontal;

  return (
    <main className={`${styles.page} ${viewClass}`}>
      <div className={styles.eyebrow}>
        <a className={styles.back} href={`/${from}`}>
          ← Katalog
        </a>
        <span className={styles.eyebrowMeta}>
          {data.object_key.source_key} · {data.object_key.object_group} ·{" "}
          {data.object_key.object_id}
        </span>
      </div>

      <Hero data={data} imageMode={imageMode} setImageMode={setImageMode} />

      <div className={styles.tabs}>
        <div className={styles.tabsGroup}>
          {CHAPTERS.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`${styles.tab} ${segment === c.key ? styles.tabOn : ""}`}
              onClick={() => setSegment(c.key)}
            >
              <span className={styles.roman}>{c.roman}</span>
              {c.label}
            </button>
          ))}
        </div>
        <div className={styles.tabsGroup}>
          <button
            type="button"
            className={`${styles.tab} ${styles.tabCollection} ${segment === "minsamling" ? styles.tabOn : ""}`}
            onClick={() => setSegment("minsamling")}
          >
            <span className={styles.roman}>IV</span>I min samling
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <div>
          <div className={`${styles.panel} ${segment === "samler" ? styles.panelOn : ""}`}>
            <SamlerPanel data={data} />
          </div>
          <div className={`${styles.panel} ${segment === "historie" ? styles.panelOn : ""}`}>
            <HistoriePanel data={data} onOpenRelation={handlers.onOpenRelation} />
          </div>
          <div className={`${styles.panel} ${segment === "finans" ? styles.panelOn : ""}`}>
            <FinansPanel data={data} />
          </div>
          <div className={`${styles.panel} ${segment === "minsamling" ? styles.panelOn : ""}`}>
            <MinSamlingPanel
              data={data}
              onSaveNote={handlers.onSaveNote}
              onUpdateSpec={handlers.onUpdateSpec}
              onNotify={notify}
            />
          </div>
        </div>

        <SidePanel
          data={data}
          view={view}
          setView={setView}
          handlers={handlers}
          onNotify={notify}
        />
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </main>
  );
}
