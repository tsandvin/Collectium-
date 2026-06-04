"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AdminDealersClient v17
 *
 * Definering / formål:
 * Forhandleradministrasjon med status, avtale, kategoriadgang, fee, auksjon, nettbutikk
 * og dokumentasjonskontroll. Previewmodul som senere kobles til MariaDB/API.
 *
 * Berørte sider / routes:
 * - /admin/forhandlere
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.dealers.view
 * - admin.dealers.approve
 * - admin.dealers.fee.manage
 * - admin.dealers.agreement.manage
 * - admin.dealers.auction_access
 * - admin.dealers.shop_access
 */

import { useState } from "react";
import styles from "../landing/collectium-frontpage.module.css";
import PageHeader from "../ui/collectium/PageHeader";
import ContentPanel from "../ui/collectium/ContentPanel";
import InfoCard from "../ui/collectium/InfoCard";
import StatusCard from "../ui/collectium/StatusCard";
import ArchiveTabs from "../ui/collectium/ArchiveTabs";
import ActionButton from "../ui/collectium/ActionButton";

const dealers = [
  {
    name: "Nordisk Seddel & Mynt",
    org: "998 100 200",
    contact: "Kari Nilsen",
    email: "kontakt@nordisk.no",
    status: "Venter dokumentasjon",
    categories: "Sedler, Mynter",
    agreement: "Mangler signering",
    fee: "7,5 %",
    auction: "På",
    shop: "På",
    objects: 128,
  },
  {
    name: "Demo Forhandler",
    org: "900 000 001",
    contact: "Per Test",
    email: "demo.forhandler@collectium.no",
    status: "Aktiv",
    categories: "Sedler",
    agreement: "Signert",
    fee: "5 %",
    auction: "På",
    shop: "Av",
    objects: 32,
  },
  {
    name: "Museumspartner Lokalt",
    org: "812 445 000",
    contact: "Anne Arkiv",
    email: "museum@example.no",
    status: "Ny søknad",
    categories: "Dokumenter, Lokale objekter",
    agreement: "Utkast",
    fee: "Ikke satt",
    auction: "Av",
    shop: "Av",
    objects: 0,
  },
];

export default function AdminDealersClient() {
  const [selected, setSelected] = useState(dealers[0]);
  const [activeTab, setActiveTab] = useState("Alle");

  return (
    <div className="ct-page">
      <PageHeader kicker="Admin / forhandlere" title="Forhandlere og avtaler" description="Kontroller godkjenning, dokumentasjon, kategoriadgang, fee-avtale, auksjon og nettbutikk.">
        <ActionButton variant="gold" data-feature-key="admin.dealers.create">Ny forhandler</ActionButton>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        <StatusCard value="48" label="Aktive forhandlere" note="12 venter dokumentasjon" tone="green" />
        <StatusCard value="7" label="Nye søknader" note="3 kritiske avtaler" tone="gold" />
        <StatusCard value="2,1 mill" label="Omsetning" note="fee må avstemmes" tone="blue" />
        <StatusCard value="19" label="Kategoritilganger" note="sedler, mynter, dokumenter" tone="neutral" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "20px", alignItems: "start" }}>
        <ContentPanel>
          <ArchiveTabs
            items={[
              { key: "Alle", label: "Alle" },
              { key: "Venter", label: "Venter" },
              { key: "Aktive", label: "Aktive" },
              { key: "Avvist", label: "Avvist" }
            ]}
            activeKey={activeTab}
            onChange={setActiveTab}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
            {dealers.map((dealer) => (
              <button
                key={dealer.name}
                type="button"
                className="ct-btn"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  textAlign: "left",
                  padding: "12px",
                  background: selected.name === dealer.name ? "var(--ct-active-bg)" : "none",
                  color: selected.name === dealer.name ? "var(--ct-active-text)" : "var(--ct-text)",
                  border: "1px solid var(--ct-border)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "100%"
                }}
                onClick={() => setSelected(dealer)}
              >
                <strong style={{ display: "block", fontSize: "0.95rem" }}>{dealer.name}</strong>
                <span style={{ fontSize: "0.8rem", color: selected.name === dealer.name ? "var(--ct-active-text)" : "var(--ct-text-soft)", opacity: 0.85 }}>Org.nr {dealer.org}</span>
                <span style={{ display: "inline-block", alignSelf: "start", marginTop: "6px", fontSize: "0.75rem", padding: "2px 6px", background: "rgba(0,0,0,0.1)", borderRadius: "4px" }}>{dealer.status}</span>
              </button>
            ))}
          </div>
        </ContentPanel>

        <ContentPanel>
          <p className="ct-kicker">Forhandlerark</p>
          <h2 className="ct-title" style={{ fontSize: "1.5rem" }}>{selected.name}</h2>
          <p className="ct-description" style={{ marginBottom: "20px" }}>{selected.contact} · {selected.email} · Org.nr {selected.org}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <Info title="Status" value={selected.status} note="Godkjenning og dokumentasjonskrav" />
            <Info title="Kategorier" value={selected.categories} note="Objektgrupper forhandler kan selge i" />
            <Info title="Avtale" value={selected.agreement} note="Collectium-avtale i tekstformat" />
            <Info title="Collectium-fee" value={selected.fee} note="Settes av admin, ikke forhandler" />
            <Info title="Auksjon" value={selected.auction} note="Markedskanal: auction" />
            <Info title="Nettbutikk" value={selected.shop} note="Salgskanal for faste priser" />
            <Info title="Objekter" value={`${selected.objects}`} note="Aktive / ventende objekter" />
            <Info title="Neste handling" value="Kontroller" note="Be om dokumentasjon eller godkjenn" />
          </div>
        </ContentPanel>
      </div>
    </div>
  );
}

function Info({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <InfoCard title={title}>
      <strong style={{ display: "block", fontSize: "1.15rem", color: "var(--ct-brand-primary)", marginBottom: "4px" }}>{value}</strong>
      <p style={{ margin: "0 0 10px 0", fontSize: "0.82rem", color: "var(--ct-text-soft)" }}>{note}</p>
      <ActionButton style={{ padding: "4px 10px", fontSize: "0.76rem" }} type="button">Åpne</ActionButton>
    </InfoCard>
  );
}
