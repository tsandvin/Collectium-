import { objectFilterOrder } from "@/lib/specs/collectiumSpecs";

export type CatalogObject = {
  source_key: string;
  object_group: string;
  object_id: string;
  title: string;
  market_value?: number;
  currency?: string;
  trend_percent_12m?: number;
  period_summary_no?: string;
  relations?: Array<{ type: string; label: string }>;
  [key: string]: any;
};

export function CollectiumCatalogPage({ object }: { object: CatalogObject }) {
  return (
    <article className="frontendPage">
      <section className="frontendHero">
        <div className="frontendImage">10</div>
        <div>
          <p className="frontendKicker">{object.source_key} · {object.object_group}</p>
          <h1>{object.title}</h1>
          <p>{object.period_summary_no}</p>
          <div className="frontendChips">
            <span>{object.denomination_raw_no}</span>
            <span>{object.object_year_label}</span>
            <span>{object.litra_raw_no}</span>
            <span>{object.rarity_label}</span>
          </div>
        </div>
        <div className="frontendValue">
          <small>Markedsverdi</small>
          <strong>{Number(object.market_value ?? 0).toLocaleString("nb-NO")} {object.currency ?? "NOK"}</strong>
          <span>{Number(object.trend_percent_12m ?? 0) >= 0 ? "▲" : "▼"} {object.trend_percent_12m ?? 0}% / 12 mnd</span>
        </div>
      </section>

      <section className="frontendGrid">
        <div className="frontendPanel">
          <h2>Objektfilter</h2>
          {objectFilterOrder.map((item) => (
            <div className="frontendSpec" key={item.field}>
              <span>{item.label}</span>
              <strong>{String(object[item.field] ?? "—")}</strong>
            </div>
          ))}
        </div>
        <div className="frontendPanel">
          <h2>Relasjoner</h2>
          {(object.relations ?? []).map((rel) => (
            <div className="frontendRelation" key={rel.type + rel.label}>
              <span>{rel.type}</span>
              <strong>{rel.label}</strong>
            </div>
          ))}
        </div>
        <div className="frontendPanel">
          <h2>Marked</h2>
          <div className="frontendSpec"><span>Likviditet</span><strong>{object.liquidity_label}</strong></div>
          <div className="frontendSpec"><span>Grade</span><strong>{object.grade_label}</strong></div>
          <div className="frontendSpec"><span>Materiale</span><strong>{object.material_raw_no}</strong></div>
          <div className="frontendSpec"><span>Utsteder</span><strong>{object.issuer_raw_no}</strong></div>
        </div>
      </section>
    </article>
  );
}
