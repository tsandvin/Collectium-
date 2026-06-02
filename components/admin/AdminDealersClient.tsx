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

  return (
    <div className={styles.adminUsersPage}>
      <section className={styles.adminPageHeader}>
        <div>
          <p className={styles.kicker}>Admin / forhandlere</p>
          <h1>Forhandlere og avtaler</h1>
          <p>Kontroller godkjenning, dokumentasjon, kategoriadgang, fee-avtale, auksjon og nettbutikk.</p>
        </div>
        <button type="button" className={styles.goldButton} data-feature-key="admin.dealers.create">Ny forhandler</button>
      </section>

      <section className={styles.adminStatsGrid}>
        <article className={`${styles.adminStatCard} ct-card`}><strong>48</strong><span>Aktive forhandlere</span><small>12 venter dokumentasjon</small></article>
        <article className={`${styles.adminStatCard} ct-card`}><strong>7</strong><span>Nye søknader</span><small>3 kritiske avtaler</small></article>
        <article className={`${styles.adminStatCard} ct-card`}><strong>2,1 mill</strong><span>Omsetning</span><small>fee må avstemmes</small></article>
        <article className={`${styles.adminStatCard} ct-card`}><strong>19</strong><span>Kategoritilganger</span><small>sedler, mynter, dokumenter</small></article>
      </section>

      <section className={styles.dealerWorkspace}>
        <div className={`${styles.dealerList} ct-panel`}>
          <div className={styles.archiveTabs}>
            <button type="button" className={styles.archiveTabActive}>Alle</button>
            <button type="button">Venter</button>
            <button type="button">Aktive</button>
            <button type="button">Avvist</button>
          </div>
          {dealers.map((dealer) => (
            <button key={dealer.name} type="button" className={`${styles.dealerRow} ${selected.name === dealer.name ? styles.adminUserRowActive : ""}`} onClick={() => setSelected(dealer)}>
              <strong>{dealer.name}</strong>
              <span>{dealer.org}</span>
              <em>{dealer.status}</em>
              <small>{dealer.categories}</small>
            </button>
          ))}
        </div>

        <aside className={`${styles.dealerDetail} ct-panel`}>
          <p className={styles.kicker}>Forhandlerark</p>
          <h2>{selected.name}</h2>
          <p>{selected.contact} · {selected.email} · Org.nr {selected.org}</p>
          <div className={styles.membershipGrid}>
            <Info title="Status" value={selected.status} note="Godkjenning og dokumentasjonskrav" />
            <Info title="Kategorier" value={selected.categories} note="Objektgrupper forhandler kan selge i" />
            <Info title="Avtale" value={selected.agreement} note="Collectium-avtale i tekstformat" />
            <Info title="Collectium-fee" value={selected.fee} note="Settes av admin, ikke forhandler" />
            <Info title="Auksjon" value={selected.auction} note="Markedskanal: auction" />
            <Info title="Nettbutikk" value={selected.shop} note="Salgskanal for faste priser" />
            <Info title="Objekter" value={`${selected.objects}`} note="Aktive / ventende objekter" />
            <Info title="Neste handling" value="Kontroller" note="Be om dokumentasjon eller godkjenn" />
          </div>
        </aside>
      </section>
    </div>
  );
}

function Info({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <article className={`${styles.infoBox} ct-card`}>
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{note}</p>
      <button type="button">Åpne</button>
    </article>
  );
}
