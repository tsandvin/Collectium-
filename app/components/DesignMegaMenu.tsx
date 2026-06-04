"use client";

// app/components/DesignMegaMenu.tsx
// Mega menu anchored to the Design button at the sidebar bottom.
// Three sections:
//   1. Tema      — four templates as color-preview cards
//   2. Skjerm    — viewport selector (mobile / tablet / pc / wide / tv)
//   3. Tekst     — font-size slider (12–18 px)

import { useEffect, useRef } from "react";
import {
  FONT_BASE_DEFAULT,
  FONT_BASE_MAX,
  FONT_BASE_MIN,
  TEMPLATES,
  VIEWPORTS,
  resetDesign,
  type Template,
  type Viewport,
} from "../lib/theme";

type Props = {
  open: boolean;
  onClose: () => void;
  template: Template;
  viewport: Viewport;
  fontBase: number;
  onTemplateChange: (t: Template) => void;
  onViewportChange: (v: Viewport) => void;
  onFontBaseChange: (px: number) => void;
};

export default function DesignMegaMenu({
  open,
  onClose,
  template,
  viewport,
  fontBase,
  onTemplateChange,
  onViewportChange,
  onFontBaseChange,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Click outside closes (but ignore clicks on the Design button itself)
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (ref.current?.contains(t)) return;
      if (t.closest(".ct-design-btn")) return;
      onClose();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onClose]);

  return (
    <div
      id="ct-design-mega"
      ref={ref}
      className={`ct-mega${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="false"
      aria-label="Designinnstillinger"
      aria-hidden={!open}
    >
      <div className="ct-mega-head">
        <div className="ct-mega-title">Design</div>
        <button
          type="button"
          className="ct-mega-reset"
          onClick={resetDesign}
          title="Tilbakestill til standard"
        >
          <i className="ti ti-rotate-clockwise" aria-hidden />
          Tilbakestill
        </button>
        <button
          type="button"
          className="ct-mega-close"
          onClick={onClose}
          aria-label="Lukk designinnstillinger"
        >
          <i className="ti ti-x" aria-hidden />
        </button>
      </div>

      {/* Section 1 — TEMA */}
      <section className="ct-mega-section">
        <h3 className="ct-mega-h">
          <i className="ti ti-palette" aria-hidden />
          Tema
        </h3>
        <div className="ct-mega-templates">
          {TEMPLATES.map((t) => {
            const active = t.id === template;
            return (
              <button
                key={t.id}
                type="button"
                className={`ct-mega-template${active ? " is-active" : ""}`}
                onClick={() => onTemplateChange(t.id)}
                aria-pressed={active}
              >
                <div
                  className="ct-mega-template-swatch"
                  style={{
                    background: `linear-gradient(135deg, ${t.swatch[0]} 0%, ${t.swatch[0]} 50%, ${t.swatch[1]} 50%, ${t.swatch[1]} 100%)`,
                  }}
                  aria-hidden
                >
                  <span
                    className="ct-mega-template-dot"
                    style={{ background: t.accent }}
                  />
                </div>
                <div className="ct-mega-template-text">
                  <div className="ct-mega-template-label">
                    {t.label}
                    <small>{t.tone}</small>
                  </div>
                  <div className="ct-mega-template-desc">{t.description}</div>
                </div>
                {active && (
                  <i className="ti ti-circle-check ct-mega-template-check" aria-hidden />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 2 — SKJERM */}
      <section className="ct-mega-section">
        <h3 className="ct-mega-h">
          <i className="ti ti-device-desktop" aria-hidden />
          Skjermstørrelse
        </h3>
        <div className="ct-mega-vps">
          {VIEWPORTS.map((v) => {
            const active = v.id === viewport;
            return (
              <button
                key={v.id}
                type="button"
                className={`ct-mega-vp${active ? " is-active" : ""}`}
                onClick={() => onViewportChange(v.id)}
                aria-pressed={active}
              >
                <i className={`ti ${v.icon}`} aria-hidden />
                <span className="ct-mega-vp-label">{v.label}</span>
                <small className="ct-mega-vp-width">{v.width}</small>
                {v.hint && <span className="ct-mega-vp-hint">{v.hint}</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3 — TEKST */}
      <section className="ct-mega-section">
        <h3 className="ct-mega-h">
          <i className="ti ti-letter-case" aria-hidden />
          Tekststørrelse
        </h3>
        <div className="ct-mega-font">
          <span className="ct-mega-font-min">A</span>
          <input
            type="range"
            min={FONT_BASE_MIN}
            max={FONT_BASE_MAX}
            step={1}
            value={fontBase}
            onChange={(e) => onFontBaseChange(parseInt(e.target.value, 10))}
            aria-label={`Tekststørrelse i piksler. Nåværende: ${fontBase}`}
            className="ct-mega-font-slider"
          />
          <span className="ct-mega-font-max">A</span>
          <output className="ct-mega-font-output">{fontBase} px</output>
        </div>
        <div className="ct-mega-font-ticks" aria-hidden>
          {Array.from(
            { length: FONT_BASE_MAX - FONT_BASE_MIN + 1 },
            (_, i) => FONT_BASE_MIN + i
          ).map((n) => (
            <span
              key={n}
              className={`ct-mega-font-tick${n === fontBase ? " is-active" : ""}${n === FONT_BASE_DEFAULT ? " is-default" : ""}`}
            >
              {n}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
