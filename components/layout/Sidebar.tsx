"use client";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
};

const NAV: ReadonlyArray<NavItem> = [
  { href: "/", label: "Forside", icon: "ti-home", active: true },
  { href: "/startside", label: "Startside", icon: "ti-layout-dashboard" },
  { href: "/katalog", label: "Katalog", icon: "ti-archive" },
  { href: "/samling", label: "Min samling", icon: "ti-bookmark" },
  { href: "/auksjon", label: "Auksjon", icon: "ti-gavel" },
  { href: "/finans", label: "Finans", icon: "ti-chart-line" },
  { href: "/historie", label: "Historie", icon: "ti-building-bank" },
  { href: "/min-side", label: "Min side", icon: "ti-user" },
  { href: "/admin", label: "Admin", icon: "ti-shield-lock" },
];

export default function Sidebar({
  onDesignClick,
  designOpen,
}: {
  onDesignClick: () => void;
  designOpen: boolean;
}) {
  return (
    <aside className="ct-sidebar" aria-label="Hovedmeny">
      <div className="ct-brand">
        <div className="ct-brand-mark" aria-hidden />
        <div>
          <div className="ct-brand-title">Collectium</div>
          <div className="ct-brand-sub">For samlere · For historien</div>
        </div>
      </div>

      <div className="ct-menu-label">Hovedmeny</div>
      <nav className="ct-nav">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`ct-nav-link${item.active ? " is-active" : ""}`}
          >
            <i className={`ti ${item.icon}`} aria-hidden />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="ct-sidebar-watermark" aria-hidden />

      <div className="ct-sidebar-footer">
        <button
          type="button"
          className={`ct-design-btn${designOpen ? " is-open" : ""}`}
          onClick={onDesignClick}
          aria-expanded={designOpen}
          aria-controls="ct-design-mega"
          aria-haspopup="dialog"
        >
          <i className="ti ti-palette" aria-hidden />
          <span>Design</span>
          <i className={`ti ${designOpen ? "ti-chevron-down" : "ti-chevron-up"} ct-design-btn-caret`} aria-hidden />
        </button>
      </div>
    </aside>
  );
}
