"use client";

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
} from "../../lib/theme";

type Props = {
  open: boolean;
  onClose: () => void;
  template: Template;
  viewport: Viewport;
  fontBase: number;
  onTemplateChange: (template: Template) => void;
  onViewportChange: (viewport: Viewport) => void;
  onFontBaseChange: (fontBase: number) => void;
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

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    function onDocClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (ref.current?.contains(target)) return;
      if (target.closest(".ct-design-btn")) return;
      onClose();
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onClose]);

  function handleReset() {
    resetDesign();
    onTemplateChange("collectium");
    onViewportChange("pc");
    onFontBaseChange(FONT_BASE_DEFAULT);
  }

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
          onClick={handleReset}
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

      <section className="ct-mega-section">
        <h3 className="ct-mega-h">
          <i className="ti ti-palette" aria-hidden />
          Tema
        </h3>
        <div className="ct-mega-templates">
          {TEMPLATES.map((item) => {
            const active = item.id === template;

            return (
              <button
                key={item.id}
                type="button"
                className={`ct-mega-template${active ? " is-active" : ""}`}
                onClick={() => onTemplateChange(item.id)}
                aria-pressed={active}
              >
                <div
                  className="ct-mega-template-swatch"
                  style={{
                    background: `linear-gradient(135deg, ${item.swatch[0]} 0%, ${item.swatch[0]} 50%, ${item.swatch[1]} 50%, ${item.swatch[1]} 100%)`,
                  }}
                  aria-hidden
                >
                  <span
                    className="ct-mega-template-dot"
                    style={{ background: item.accent }}
                  />
                </div>
                <div className="ct-mega-template-text">
                  <div className="ct-mega-template-label">
                    {item.label}
                    <small>{item.tone}</small>
                  </div>
                  <div className="ct-mega-template-desc">{item.description}</div>
                </div>
                {active ? <i className="ti ti-circle-check ct-mega-template-check" aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="ct-mega-section">
        <h3 className="ct-mega-h">
          <i className="ti ti-device-desktop" aria-hidden />
          Skjermstørrelse
        </h3>
        <div className="ct-mega-vps">
          {VIEWPORTS.map((item) => {
            const active = item.id === viewport;

            return (
              <button
                key={item.id}
                type="button"
                className={`ct-mega-vp${active ? " is-active" : ""}`}
                onClick={() => onViewportChange(item.id)}
                aria-pressed={active}
              >
                <i className={`ti ${item.icon}`} aria-hidden />
                <span className="ct-mega-vp-label">{item.label}</span>
                <small className="ct-mega-vp-width">{item.width}</small>
                {item.hint ? <span className="ct-mega-vp-hint">{item.hint}</span> : null}
              </button>
            );
          })}
        </div>
      </section>

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
            onChange={(event) => onFontBaseChange(parseInt(event.target.value, 10))}
            aria-label={`Tekststørrelse i piksler. Nåværende: ${fontBase}`}
            className="ct-mega-font-slider"
          />
          <span className="ct-mega-font-max">A</span>
          <output className="ct-mega-font-output">{fontBase} px</output>
        </div>
        <div className="ct-mega-font-ticks" aria-hidden>
          {Array.from(
            { length: FONT_BASE_MAX - FONT_BASE_MIN + 1 },
            (_, index) => FONT_BASE_MIN + index,
          ).map((item) => (
            <span
              key={item}
              className={`ct-mega-font-tick${item === fontBase ? " is-active" : ""}${item === FONT_BASE_DEFAULT ? " is-default" : ""}`}
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
