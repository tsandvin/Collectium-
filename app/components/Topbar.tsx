"use client";

// app/components/Topbar.tsx
// Top bar with search and a few action pills.

export default function Topbar() {
  return (
    <header className="ct-topbar" aria-label="Toppmeny">
      <label className="ct-topbar-search">
        <i className="ti ti-search" aria-hidden />
        <input
          type="search"
          placeholder="Søk i katalog · objekter, kilder, varianter…"
          aria-label="Søk"
        />
      </label>
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
  );
}
