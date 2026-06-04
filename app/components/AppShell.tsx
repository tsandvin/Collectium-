"use client";

// app/components/AppShell.tsx
// Single source of truth for app chrome.
// Layout: sidebar (left) + topbar (top) + content (main).
// Watermarks: sidebar bottom + content top center.
// Design mega menu is opened by the "Design" button at sidebar bottom.

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DesignMegaMenu from "./DesignMegaMenu";
import {
  applyFontBase,
  applyTemplate,
  applyViewport,
  readFontBase,
  readTemplate,
  readViewport,
  type Template,
  type Viewport,
} from "../lib/theme";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [designOpen, setDesignOpen] = useState(false);
  const [template, setTemplate] = useState<Template>("collectium");
  const [viewport, setViewport] = useState<Viewport>("pc");
  const [fontBase, setFontBase] = useState<number>(14);

  // Sync React state with persisted values on mount. The bootstrap script
  // in layout.tsx has already applied them to <html>, this just mirrors
  // them so the UI controls show the right active state.
  useEffect(() => {
    setTemplate(readTemplate());
    setViewport(readViewport());
    setFontBase(readFontBase());
  }, []);

  function handleTemplate(t: Template) {
    setTemplate(t);
    applyTemplate(t);
  }
  function handleViewport(v: Viewport) {
    setViewport(v);
    applyViewport(v);
  }
  function handleFontBase(px: number) {
    setFontBase(px);
    applyFontBase(px);
  }

  return (
    <div className="ct-app">
      <Sidebar onDesignClick={() => setDesignOpen((v) => !v)} designOpen={designOpen} />

      <div className="ct-main">
        <Topbar />
        <main className="ct-content">
          <div className="ct-page-watermark" aria-hidden />
          <div className="ct-container">{children}</div>
        </main>
      </div>

      <DesignMegaMenu
        open={designOpen}
        onClose={() => setDesignOpen(false)}
        template={template}
        viewport={viewport}
        fontBase={fontBase}
        onTemplateChange={handleTemplate}
        onViewportChange={handleViewport}
        onFontBaseChange={handleFontBase}
      />
    </div>
  );
}
