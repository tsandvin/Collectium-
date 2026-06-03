// app/components/AppShell.tsx
// Collectium · app shell · v3.0
//
// LOCKED layout: sidebar (left) + topbar (top) + content (main).
// Watermarks are positioned in two locked slots:
//   1. Sidebar bottom (.ct-sidebar-watermark)
//   2. Content top center, just below topbar (.ct-page-watermark)

import type { ReactNode } from "react";
import TemplateSwitcher from "./TemplateSwitcher";

type NavItem = {
  href: string;
  label: string;
  icon: string; // tabler icon name, e.g. "ti-archive"
  active?: boolean;
};

const DEFAULT_NAV: NavItem[] = [
  { href: "/", label: "Forside", icon: "ti-home", active: true },
  { href: "/katalog", label: "Katalog", icon: "ti-archive" },
  { href: "/samling", label: "Min samling", icon: "ti-bookmark" },
  { href: "/auksjon", label: "Auksjon", icon: "ti-gavel" },
  { href: "/finans", label: "Finans", icon: "ti-chart-line" },
  { href: "/historie", label: "Historie", icon: "ti-building-bank" },
  { href: "/min-side", label: "Min side", icon: "ti-user" },
  { href: "/admin", label: "Admin", icon: "ti-shield-lock" },
];

export default function AppShell({
  children,
  nav = DEFAULT_NAV,
}: {
  children: ReactNode;
  nav?: NavItem[];
}) {
  return (
    <div className="ct-app">
      <aside className="ct-sidebar">
        <div className="ct-brand">
          <div className="ct-brand-mark" aria-hidden />
          <div>
            <div className="ct-brand-title">Collectium</div>
            <div className="ct-brand-sub">For samlere · For historien</div>
          </div>
        </div>

        <div className="ct-menu-label">Hovedmeny</div>
        <nav className="ct-nav">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`ct-nav-link${item.active ? " is-active" : ""}`}
            >
              <i className={`ti ${item.icon}`} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Locked watermark slot · sidebar bottom */}
        <div className="ct-sidebar-watermark" aria-hidden />
      </aside>

      <main className="ct-main">
        <header className="ct-topbar">
          <div className="ct-topbar-search">
            <i className="ti ti-search" aria-hidden />
            <input
              type="search"
              placeholder="Søk i katalog · objekter, kilder, varianter…"
              aria-label="Søk"
            />
          </div>
          <TemplateSwitcher />
          <div className="ct-topbar-actions">
            <button className="ct-topbar-pill" type="button">
              <i className="ti ti-bell" aria-hidden />
              <span>Varsler</span>
            </button>
            <button className="ct-topbar-pill" type="button">
              <i className="ti ti-user-circle" aria-hidden />
              <span>Min side</span>
            </button>
          </div>
        </header>

        <section className="ct-content">
          {/* Locked watermark slot · content top center, below topbar */}
          <div className="ct-page-watermark" aria-hidden />
          <div className="ct-container">{children}</div>
        </section>
      </main>

      {/* Mobile bottom nav · visible only at narrow widths or data-vp="mobile" */}
      <nav className="ct-mobile-nav" aria-label="Mobilnavigasjon">
        {nav.slice(0, 4).map((item) => (
          <button
            key={item.href}
            type="button"
            className={item.active ? "is-active" : ""}
          >
            <i className={`ti ${item.icon}`} aria-hidden />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
