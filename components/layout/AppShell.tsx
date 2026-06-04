"use client";

import { useEffect, useState } from "react";
import DesignMegaMenu from "./DesignMegaMenu";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import {
  applyFontBase,
  applyTemplate,
  applyViewport,
  readFontBase,
  readTemplate,
  readViewport,
  type Template,
  type Viewport,
} from "../../lib/theme";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [designOpen, setDesignOpen] = useState(false);
  const [template, setTemplate] = useState<Template>("collectium");
  const [viewport, setViewport] = useState<Viewport>("pc");
  const [fontBase, setFontBase] = useState<number>(14);

  useEffect(() => {
    setTemplate(readTemplate());
    setViewport(readViewport());
    setFontBase(readFontBase());
  }, []);

  function handleTemplate(nextTemplate: Template) {
    setTemplate(nextTemplate);
    applyTemplate(nextTemplate);
  }

  function handleViewport(nextViewport: Viewport) {
    setViewport(nextViewport);
    applyViewport(nextViewport);
  }

  function handleFontBase(nextFontBase: number) {
    setFontBase(nextFontBase);
    applyFontBase(nextFontBase);
  }

  return (
    <div className="ct-app">
      <Sidebar onDesignClick={() => setDesignOpen((open) => !open)} designOpen={designOpen} />

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
