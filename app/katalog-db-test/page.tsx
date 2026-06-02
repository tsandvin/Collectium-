"use client";

import { useEffect, useState } from "react";

type CatalogObject = {
  object_id: number;
  source_key: string;
  object_group: string;
  source_catalog_number?: string | null;
  frontend_title?: string | null;
  title_no?: string | null;
  denomination?: string | null;
  variant?: string | null;
  litra?: string | null;
  year_label?: string | null;
  country?: string | null;
  producer?: string | null;
  issuer?: string | null;
  ruler?: string | null;
  king_period_label?: string | null;
  dynasty_name?: string | null;
  historical_period?: string | null;
  material?: string | null;
  value_label?: string | null;
};

type ApiResponse = {
  ok: boolean;
  source: string;
  route: string;
  data: {
    source_key: string;
    object_group: string;
    q: string;
    limit: number;
    count: number;
    objects: CatalogObject[];
  } | null;
  errors: Array<{
    code?: string;
    message?: string;
  }>;
};

export default function KatalogDbTestPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadObjects() {
      try {
        const response = await fetch(
          "/api/catalog/search-db-test?source_key=norske_sedler&object_group=banknote&limit=10",
          { cache: "no-store" }
        );

        const json = (await response.json()) as ApiResponse;
        setData(json);

        if (!json.ok) {
          setError(json.errors?.[0]?.message || "Ukjent API-feil");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ukjent frontend-feil");
      }
    }

    loadObjects();
  }, []);

  return (
    <main style={{ padding: 32, fontFamily: "Arial, sans-serif" }}>
      <h1>Katalog DB-test</h1>

      <p>
        Tester frontend → API → MariaDB for Norske sedler.
      </p>

      {!data && !error && <p>Laster katalogdata...</p>}

      {error && (
        <div style={{ border: "1px solid #c00", padding: 16, marginBottom: 24 }}>
          <strong>FEIL:</strong> {error}
        </div>
      )}

      {data?.ok && (
        <div style={{ marginBottom: 24 }}>
          <p><strong>Status:</strong> OK</p>
          <p><strong>Kilde:</strong> {data.source}</p>
          <p><strong>Route:</strong> {data.route}</p>
          <p><strong>source_key:</strong> {data.data?.source_key}</p>
          <p><strong>object_group:</strong> {data.data?.object_group}</p>
          <p><strong>Antall vist:</strong> {data.data?.count}</p>
        </div>
      )}

      <section style={{ display: "grid", gap: 16 }}>
        {data?.data?.objects.map((object) => (
          <article
            key={object.object_id}
            style={{
              border: "1px solid #d5dbe5",
              borderRadius: 12,
              padding: 16,
              background: "#fff",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {object.frontend_title || object.title_no || `Objekt ${object.object_id}`}
            </h2>

            <p>
              <strong>Katalognummer:</strong> {object.source_catalog_number || "Ikke registrert"}
            </p>

            <p>
              <strong>Valør:</strong> {object.denomination || "Ikke registrert"} ·{" "}
              <strong>År:</strong> {object.year_label || "Ikke registrert"} ·{" "}
              <strong>Litra:</strong> {object.litra || "Ikke registrert"}
            </p>

            <p>
              <strong>Variant:</strong> {object.variant || "Ikke registrert"}
            </p>

            <p>
              <strong>Land:</strong> {object.country || "Ikke registrert"} ·{" "}
              <strong>Utsteder:</strong> {object.issuer || object.producer || "Ikke registrert"}
            </p>

            <p>
              <strong>Regent:</strong> {object.ruler || "Ikke registrert"} ·{" "}
              <strong>Periode:</strong> {object.king_period_label || "Ikke registrert"} ·{" "}
              <strong>Dynasti:</strong> {object.dynasty_name || "Ikke registrert"}
            </p>

            <p>
              <strong>Historisk periode:</strong> {object.historical_period || "Ikke registrert"}
            </p>

            <p>
              <strong>Materiale:</strong> {object.material || "Ikke registrert"} ·{" "}
              <strong>Verdi:</strong> {object.value_label || "Ikke vurdert"}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
