/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Objektpresentasjon
 *
 * Definering / formål:
 * Viser en unik objektpresentasjon for hvert katalogobjekt basert på
 * source_key + object_group + object_id.
 *
 * Bruksområde:
 * Brukes når bruker åpner et objekt fra katalogen.
 *
 * Berørte sider / routes:
 * - /objekt/[sourceKey]/[objectGroup]/[objectId]
 *
 * Berørte DB-brytere / feature_keys:
 * - catalog.object.open
 * - object.presentation.view
 * - object.history.view
 * - object.market.view
 * - object.relations.view
 *
 * Berørte API-ruter:
 * - getCatalogObject() via src/db/queries/catalog.ts
 *
 * Berørte tabeller / views:
 * - ct_v_catalog_objects_resolved
 *
 * Dataretning:
 * MariaDB -> PHP/API bridge -> Next.js objektpresentasjon -> UI
 *
 * Endringsregel:
 * Objektpresentasjon skal ikke være en felles HTML-fil. Hvert objekt skal
 * ha unik Next.js-route basert på source_key + object_group + object_id.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalogObject } from "@/db/queries/catalog";

type ObjektPageProps = {
  params: Promise<{
    sourceKey: string;
    objectGroup: string;
    objectId: string;
  }>;
};

function getText(value: unknown, fallback = "Ikke registrert") {
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }

  return fallback;
}

function getObjectField(object: unknown, key: string, fallback = "Ikke registrert") {
  const row = object as Record<string, unknown>;

  const aliases: Record<string, string[]> = {
    title: ["collectium_title", "frontend_title", "object_title_no"],
    meta: ["collectium_catalog_meta", "source_catalog_number", "local_catalog_number", "pick_catalog_number"],
    country: ["country", "country_raw_no"],
    producer: ["producer", "producer_raw_no", "issuer", "issuer_raw_no"],
    issuer: ["issuer", "issuer_raw_no", "producer", "producer_raw_no"],
    denomination: ["denomination", "denomination_raw_no"],
    denomination_issue: ["denomination_issue", "denomination_issue_raw_no"],
    year_label: ["year_label", "object_year_label", "publication_year_label"],
    litra: ["litra", "litra_raw_no"],
    variant: ["variant", "variant_type_raw_no"],
    signature: ["signature", "signature_raw_no"],
    ruler: ["ruler", "ruler_name_raw_no", "historical_ruler_raw_no"],
    historical_period: ["historical_period", "historical_period_label_no"],
    material: ["material", "material_raw_no", "paper_type_raw_no"],
    rarity: ["rarity", "rarity_label", "rarity_catalog_assessment_raw_no", "rarity_estimated_by_quantity_raw_no"],
    value_label: ["value_label", "market_value_label", "estimated_value_label"],
  };

  const keys = aliases[key] ?? [key];

  for (const candidateKey of keys) {
    const value = getText(row[candidateKey], "");

    if (value !== "") {
      return value;
    }
  }

  return fallback;
}

function getObjectTitle(object: unknown) {
  const title = getObjectField(object, "title", "");

  if (title) {
    return title;
  }

  return [
    getObjectField(object, "denomination", ""),
    getObjectField(object, "year_label", ""),
    getObjectField(object, "litra", ""),
    getObjectField(object, "variant", ""),
  ]
    .filter(Boolean)
    .join(" • ") || "Uten tittel";
}

function getValueLabel(object: unknown) {
  const value = getObjectField(object, "value_label", "");

  if (value && value !== "0 kr" && value !== "0") {
    return value;
  }

  return "Ikke vurdert";
}

function getRelationLinks(object: unknown, sourceKey: string, objectGroup: string) {
  const fields = [
    ["country", "Samme land"],
    ["producer", "Samme produsent"],
    ["issuer", "Samme utsteder"],
    ["denomination", "Samme valor"],
    ["year_label", "Samme ar/periode"],
    ["litra", "Samme litra"],
    ["denomination_issue", "Samme utgave/serie"],
    ["variant", "Samme variant"],
    ["signature", "Samme signatur"],
    ["ruler", "Samme regent"],
    ["historical_period", "Samme historiske periode"],
    ["material", "Samme materiale"],
  ];

  return fields
    .map(([field, label]) => {
      const value = getObjectField(object, field, "");
      return value ? { field, label, value } : null;
    })
    .filter((item): item is { field: string; label: string; value: string } => Boolean(item))
    .map((item) => ({
      ...item,
      href: `/relasjon/${encodeURIComponent(item.field)}/${encodeURIComponent(item.value)}?source_key=${encodeURIComponent(sourceKey)}&object_group=${encodeURIComponent(objectGroup)}`,
    }));
}

export default async function ObjektPage({ params }: ObjektPageProps) {
  const { sourceKey, objectGroup, objectId } = await params;

  const object = await getCatalogObject(sourceKey, objectGroup, objectId);

  if (!object) {
    notFound();
  }

  const title = getObjectTitle(object);
  const meta = getObjectField(object, "meta", `ID ${objectId}`);
  const value = getValueLabel(object);
  const relationLinks = getRelationLinks(object, sourceKey, objectGroup);
  const detailSections = [
    {
      title: "Samler",
      text: `Kilde ${sourceKey}, objektgruppe ${objectGroup}, katalognummer ${meta}. Samlingsstatus, onskeliste, favoritt og eierhistorikk kobles pa samme tekniske nokkel nar API returnerer brukerdata.`,
    },
    {
      title: "Historie",
      text: `Historisk periode: ${getObjectField(object, "historical_period")}. Regent/person: ${getObjectField(object, "ruler")}. Produsent/utsteder: ${getObjectField(object, "producer")}.`,
    },
    {
      title: "Finans",
      text: `Estimert verdi: ${value}. Marked, auksjon, prisobservasjoner og indeks skal hentes fra kilde-scopede API-visninger.`,
    },
  ];

  return (
    <main className="ct-object-page">
      <section className="ct-object-hero">
        <div>
          <p className="ct-eyebrow">Collectium objektpresentasjon</p>
          <h1>{title}</h1>
          <p>{meta}</p>
          <p>
            source_key = {sourceKey} · object_group = {objectGroup} · object_id = {objectId}
          </p>
        </div>

        <Link className="ct-object-back" href={`/katalog?source_key=${encodeURIComponent(sourceKey)}&object_group=${encodeURIComponent(objectGroup)}`}>
          Tilbake til katalog
        </Link>
      </section>

      <section className="ct-object-layout">
        <section className="ct-object-image-panel">
          <div className="ct-banknote-preview">
            <span className="ct-banknote-number">1</span>
            <span className="ct-banknote-title">NORGES</span>
            <span className="ct-banknote-year">{getObjectField(object, "year_label", "")}</span>
            <span className="ct-banknote-center">1</span>
            <span className="ct-banknote-line" />
          </div>
        </section>

        <section className="ct-object-info-panel">
          <h2>Objektdata</h2>

          <dl className="ct-object-fields">
            <div>
              <dt>Land</dt>
              <dd>{getObjectField(object, "country")}</dd>
            </div>
            <div>
              <dt>Produsent / utsteder</dt>
              <dd>{getObjectField(object, "producer")}</dd>
            </div>
            <div>
              <dt>Valør</dt>
              <dd>{getObjectField(object, "denomination")}</dd>
            </div>
            <div>
              <dt>Årstall</dt>
              <dd>{getObjectField(object, "year_label")}</dd>
            </div>
            <div>
              <dt>Litra / nummer</dt>
              <dd>{getObjectField(object, "litra")}</dd>
            </div>
            <div>
              <dt>Valørutgave / serie</dt>
              <dd>{getObjectField(object, "denomination_issue")}</dd>
            </div>
            <div>
              <dt>Variant / type</dt>
              <dd>{getObjectField(object, "variant")}</dd>
            </div>
            <div>
              <dt>Signatur / personer</dt>
              <dd>{getObjectField(object, "signature")}</dd>
            </div>
            <div>
              <dt>Konge / regent</dt>
              <dd>{getObjectField(object, "ruler")}</dd>
            </div>
            <div>
              <dt>Historisk periode</dt>
              <dd>{getObjectField(object, "historical_period")}</dd>
            </div>
            <div>
              <dt>Materiale</dt>
              <dd>{getObjectField(object, "material")}</dd>
            </div>
            <div>
              <dt>Sjeldenhet</dt>
              <dd>{getObjectField(object, "rarity")}</dd>
            </div>
          </dl>

          <div className="ct-object-detail-sections">
            {detailSections.map((section) => (
              <article key={section.title}>
                <h3>{section.title}</h3>
                <p>{section.text}</p>
              </article>
            ))}
          </div>

          <section className="ct-object-relations">
            <h2>Relasjoner</h2>
            <p>Alle lenker er scopt med source_key + object_group og peker tilbake til relasjonskatalogen.</p>
            <div>
              {relationLinks.map((relation) => (
                <Link key={`${relation.field}:${relation.value}`} href={relation.href}>
                  <span>{relation.label}</span>
                  <strong>{relation.value}</strong>
                </Link>
              ))}
            </div>
          </section>
        </section>

        <aside className="ct-object-side-panel">
          <div className="ct-object-actions">
            <button type="button">♡ Ønskeliste</button>
            <button type="button">☆ Favoritt</button>
            <button type="button">▣ Min samling</button>
          </div>

          <div className="ct-object-market-box">
            <span>Estimert verdi</span>
            <strong>{value}</strong>
            <span>Status</span>
            <strong>{value === "Ikke vurdert" ? "Ikke vurdert" : "Vurdert"}</strong>
          </div>

          <div className="ct-object-segments">
            <button type="button">Samler</button>
            <button type="button">Historie</button>
            <button type="button">Finans</button>
          </div>
        </aside>
      </section>
    </main>
  );
}
