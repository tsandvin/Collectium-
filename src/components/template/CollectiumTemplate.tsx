import Link from 'next/link';
import type { ReactNode } from 'react';

const links = [
  ['/', 'Forside'],
  ['/katalog', 'Katalog'],
  ['/samling', 'Samling'],
  ['/minside', 'Min side'],
  ['/forhandler', 'Forhandler'],
  ['/auksjon', 'Auksjon'],
  ['/admin/kontroll', 'Admin kontroll']
];

export function CollectiumTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="ct-shell">
      <aside className="ct-sidebar">
        <div className="ct-sidebar__brand">Collectium</div>
        <nav>{links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      </aside>
      <div className="ct-main">
        <header className="ct-topbar">
          <strong>app.collectium.no</strong>
          <div>Design · Aktivitet · Boks</div>
        </header>
        <main className="ct-page">{children}</main>
      </div>
    </div>
  );
}
