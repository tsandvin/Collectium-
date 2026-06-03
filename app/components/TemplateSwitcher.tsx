"use client";

import { useEffect, useState } from "react";
import { getStoredTemplate, setTemplate, THEMES, type CollectiumTemplate } from "../lib/theme";

export default function TemplateSwitcher() {
  const [active, setActive] = useState<CollectiumTemplate>("collectium");

  useEffect(() => {
    const stored = getStoredTemplate();
    setActive(stored);
    setTemplate(stored);
  }, []);

  return (
    <div className="ct-template-switcher" aria-label="Velg Collectium-skin">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          className={`ct-template-chip${active === theme.id ? " is-active" : ""}`}
          onClick={() => {
            setTemplate(theme.id);
            setActive(theme.id);
          }}
          title={theme.description}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
}
