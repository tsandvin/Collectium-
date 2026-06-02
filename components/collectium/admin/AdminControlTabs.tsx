/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AdminControlTabs
 *
 * Definering / formål:
 * Tab-/fanevisning for Admin kontroll med online status, teknisk dashboard,
 * DB 8.4, Vercel/deploy, aktivitet, brukere, adminlogg, meldinger og avanserte innstillinger.
 *
 * Bruksområde:
 * Brukes på /admin/kontroll.
 *
 * Berørte sider / routes:
 * - /admin/kontroll
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.control.view
 * - admin.system.dashboard.view
 * - admin.system.db_map.view
 * - admin.system.vercel_status.view
 * - admin.activity.view
 * - admin.users.view
 * - admin.logs.view
 * - admin.messages.view
 * - admin.settings.view
 *
 * Berørte API-ruter:
 * - GET /api/admin/system/dashboard
 * - GET /api/admin/system/db-map
 * - GET /api/admin/system/vercel-status
 * - GET /api/admin/activity
 * - GET /api/admin/users/summary
 * - GET /api/admin/logs/latest
 * - GET /api/admin/messages
 * - GET /api/admin/settings
 *
 * Berørte tabeller / views:
 * - ct_app_pages
 * - ct_app_features
 * - ct_app_page_features
 * - ct_feature_action_routes
 * - ct_v_feature_access_resolved
 * - ct_admin_logs
 * - ct_admin_messages
 * - ct_system_settings
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: admin
 * log_action: control.tabs.view
 *
 * Versjon:
 * CT-FILE-ADMIN-CONTROL-TABS-0001 / CHANGE-2026-06-02-0001
 */

'use client';

import { useMemo, useState } from 'react';

type Status = 'OK' | 'VARSEL' | 'FEIL' | 'KRITISK' | 'INFO' | 'IKKE TESTET';

type StatusCard = {
  title: string;
  value: string;
  status: Status;
  detail: string;
};

type TabKey =
  | 'online'
  | 'dashboard'
  | 'db'
  | 'vercel'
  | 'activity'
  | 'users'
  | 'logs'
  | 'messages'
  | 'settings';

const tabs: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: 'online', label: 'Online', icon: '●' },
  { key: 'dashboard', label: 'Dashbord', icon: '▦' },
  { key: 'db', label: 'DB 8.4', icon: '⌁' },
  { key: 'vercel', label: 'Vercel', icon: '▲' },
  { key: 'activity', label: 'Aktivitet', icon: '↻' },
  { key: 'users', label: 'Brukere', icon: '◉' },
  { key: 'logs', label: 'Admin logg', icon: '≡' },
  { key: 'messages', label: 'Meldinger', icon: '✉' },
  { key: 'settings', label: 'Innstillinger', icon: '⚙' },
];

const statusCards: StatusCard[] = [
  { title: 'Next.js', value: 'OK', status: 'OK', detail: 'App Router svarer' },
  { title: 'MariaDB', value: 'OK', status: 'OK', detail: 'ct_v_feature_access_resolved tilgjengelig' },
  { title: 'DB 8.4-kjede', value: 'Varsel', status: 'VARSEL', detail: '2 features mangler read_view' },
  { title: 'Vercel deploy', value: 'Online', status: 'OK', detail: 'Siste deploy aktiv' },
  { title: 'API-ruter', value: '1 feil', status: 'FEIL', detail: '/api/object/graphs mangler' },
  { title: 'Admin logg', value: 'Aktiv', status: 'OK', detail: 'Skriver admin og security' },
];

const advancedSettings = [
  'Feature/bryter styring',
  'Tilgang per medlemsnivå',
  'Adminroller og teknisk admin',
  'Vercel deploy-gate',
  'MariaDB health check intervall',
  'AI/import godkjenningsnivå',
  'Katalog datakvalitetsterskler',
  'Auksjon reserve/startpris-regler',
  'Forhandler fee-/avtaleoppsett',
  'Stripe/Vipps betalingsmodus',
  'Meldingsmaler til bruker/forhandler',
  'Recovery snapshot policy',
  'Mobil footer synlighet per rolle',
  'Bredskjerm/TV arbeidsflate',
];

function StatusPill({ status }: { status: Status }) {
  return <span className={`ct-status-pill ct-status-pill--${status.toLowerCase().replace(' ', '-')}`}>{status}</span>;
}

function PanelShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <section className="ct-admin-panel">
      <div className="ct-admin-panel__head">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function AdminControlTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('online');

  const tabTitle = useMemo(() => tabs.find((tab) => tab.key === activeTab)?.label ?? 'Kontroll', [activeTab]);

  return (
    <div className="ct-admin-control" data-module="admin-control-tabs">
      <header className="ct-admin-hero">
        <div>
          <span className="ct-admin-hero__eyebrow">Admin kontroll</span>
          <h1>Kontrollsenter</h1>
          <p>Online status, teknisk DB 8.4, Vercel, aktivitet, brukere, logg, meldinger og avanserte innstillinger.</p>
        </div>
        <div className="ct-admin-hero__status">
          <StatusPill status="OK" />
          <strong>System online</strong>
          <span>Sist kontrollert: nå</span>
        </div>
      </header>

      <div className="ct-admin-tabs" role="tablist" aria-label="Admin kontrollfaner">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`ct-admin-tab${activeTab === tab.key ? ' is-active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ct-admin-tab-content" role="tabpanel" aria-label={tabTitle}>
        {activeTab === 'online' ? (
          <PanelShell eyebrow="Live" title="Online status">
            <div className="ct-status-grid">
              {statusCards.map((card) => (
                <article key={card.title} className="ct-status-card">
                  <div>
                    <span>{card.title}</span>
                    <strong>{card.value}</strong>
                  </div>
                  <StatusPill status={card.status} />
                  <p>{card.detail}</p>
                </article>
              ))}
            </div>
          </PanelShell>
        ) : null}

        {activeTab === 'dashboard' ? (
          <PanelShell eyebrow="Teknisk oversikt" title="Dashboard for DB, API og frontend">
            <div className="ct-chain-list">
              {['/admin/kontroll -> admin.control.view -> /api/admin/system/dashboard -> ct_v_feature_access_resolved -> admin.control.view', '/katalog -> catalog.search -> /api/catalog/search -> ct_v_catalog_objects_resolved -> catalog.search', '/auksjon -> auction.view -> /api/auction/list -> ct_auction_lots -> auction.view'].map((item) => (
                <div className="ct-chain-row" key={item}><StatusPill status="OK" /><span>{item}</span></div>
              ))}
            </div>
          </PanelShell>
        ) : null}

        {activeTab === 'db' ? (
          <PanelShell eyebrow="MariaDB" title="DB 8.4 kontroll">
            <div className="ct-settings-grid">
              {['ct_app_pages', 'ct_app_features', 'ct_app_page_features', 'ct_feature_access_rules', 'ct_v_feature_access_resolved', 'ct_feature_action_routes', 'ct_admin_logs', 'ct_v_app_menu'].map((table) => (
                <div className="ct-setting-row" key={table}><span>{table}</span><StatusPill status="OK" /></div>
              ))}
            </div>
          </PanelShell>
        ) : null}

        {activeTab === 'vercel' ? (
          <PanelShell eyebrow="Deploy" title="Vercel og miljøstatus">
            <div className="ct-status-grid">
              <article className="ct-status-card"><strong>Production</strong><StatusPill status="OK" /><p>app.collectium.no peker mot aktiv deploy.</p></article>
              <article className="ct-status-card"><strong>Environment</strong><StatusPill status="VARSEL" /><p>DB secrets må aldri være NEXT_PUBLIC_.</p></article>
              <article className="ct-status-card"><strong>Deploy gate</strong><StatusPill status="FEIL" /><p>Blokker deploy hvis enhetstest får kritisk feil.</p></article>
            </div>
          </PanelShell>
        ) : null}

        {activeTab === 'activity' ? (
          <PanelShell eyebrow="Live feed" title="Aktivitet">
            <div className="ct-timeline">
              {['Admin åpnet kontrollside', 'Ny bruker registrert', 'Forhandler mangler dokumentasjon', 'API route kontroll varslet manglende read_view'].map((event, index) => (
                <div className="ct-timeline__item" key={event}><span>{index + 1}</span><p>{event}</p></div>
              ))}
            </div>
          </PanelShell>
        ) : null}

        {activeTab === 'users' ? (
          <PanelShell eyebrow="Brukere" title="Brukerstatus og medlemskap">
            <div className="ct-status-grid">
              <article className="ct-status-card"><strong>Aktive medlemmer</strong><b>248</b><p>Bronze, Silver, Gold, Platinum.</p></article>
              <article className="ct-status-card"><strong>Ubekreftede e-poster</strong><b>7</b><p>Krever oppfølging.</p></article>
              <article className="ct-status-card"><strong>Risiko/flagg</strong><b>2</b><p>Se admin logg før handling.</p></article>
            </div>
          </PanelShell>
        ) : null}

        {activeTab === 'logs' ? (
          <PanelShell eyebrow="Sporbarhet" title="Admin logg">
            <div className="ct-chain-list">
              {['admin.settings.update - OK - superadmin', 'admin.users.roles.manage - OK - admin', 'admin.routes.manage - VARSEL - mangler read_view', 'security.login_attempt - INFO - IP logget'].map((log) => (
                <div className="ct-chain-row" key={log}><StatusPill status={log.includes('VARSEL') ? 'VARSEL' : 'OK'} /><span>{log}</span></div>
              ))}
            </div>
          </PanelShell>
        ) : null}

        {activeTab === 'messages' ? (
          <PanelShell eyebrow="Kommunikasjon" title="Meldinger">
            <div className="ct-message-list">
              {['Forhandler: mangler firmaattest', 'Bruker: betaling feilet', 'System: Vercel deploy fullført', 'Import: AI-mapping klar for godkjenning'].map((message) => (
                <article className="ct-message" key={message}><strong>{message}</strong><p>Åpne saken for status, ansvarlig og neste handling.</p></article>
              ))}
            </div>
          </PanelShell>
        ) : null}

        {activeTab === 'settings' ? (
          <PanelShell eyebrow="Avansert" title="Admin innstillinger">
            <div className="ct-settings-grid">
              {advancedSettings.map((setting) => (
                <label className="ct-setting-row" key={setting}>
                  <span>{setting}</span>
                  <input type="checkbox" defaultChecked={setting.includes('Feature') || setting.includes('MariaDB') || setting.includes('Recovery')} />
                </label>
              ))}
            </div>
          </PanelShell>
        ) : null}
      </div>
    </div>
  );
}
