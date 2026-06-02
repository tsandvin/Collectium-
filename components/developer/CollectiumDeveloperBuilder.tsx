"use client";

import { useEffect, useMemo, useState } from "react";
import "./developer.css";

type Manifest = {
  pages: any[];
  components: any[];
  switches: any[];
  apis: any[];
  deploy_policy?: any;
  figma_master_reference?: any;
};

type SearchResult = {
  type: string;
  key: string;
  label: string;
  status?: string;
  description?: string;
  item: any;
};

type NodeBox = {
  id: string;
  label: string;
  x: number;
  y: number;
  status: string;
  links: string[];
  url?: string;
};

type LocalFileInfo = {
  name: string;
  path: string;
  kind: "page" | "component" | "api" | "db" | "style" | "config" | "other";
  routeGuess: string;
  size?: number;
  content?: string;
};

type DeployState = {
  changeSummary: string;
  selectedFile: LocalFileInfo | null;
  preflight: any | null;
  deployReceipt: any | null;
  busy: boolean;
  confirmedFirst: boolean;
};

const snap = 8;

function classifyFile(path: string): LocalFileInfo["kind"] {
  const p = path.toLowerCase();
  if (p.includes("/app/api/") || p.includes("\\app\\api\\") || p.includes("/pages/api/") || p.endsWith("route.ts") || p.endsWith("route.tsx")) return "api";
  if (p.includes("/app/") || p.includes("\\app\\") || p.includes("/pages/") || p.endsWith("page.tsx") || p.endsWith("page.jsx") || p.endsWith(".php")) return "page";
  if (p.includes("/components/") || p.includes("\\components\\")) return "component";
  if (p.endsWith(".sql") || p.includes("database") || p.includes("db")) return "db";
  if (p.endsWith(".css") || p.endsWith(".scss")) return "style";
  if (p.endsWith("package.json") || p.endsWith("next.config.js") || p.endsWith("next.config.mjs") || p.endsWith("tsconfig.json")) return "config";
  return "other";
}

function routeGuess(path: string): string {
  let p = path.replaceAll("\\", "/");
  const app = p.match(/(?:^|\/)app\/(.+?)\/page\.(tsx|jsx|ts|js)$/);
  if (app) return "/" + app[1].replace(/\/\(.*?\)/g, "").replace(/\/index$/, "");
  const api = p.match(/(?:^|\/)app\/api\/(.+?)\/route\.(tsx|ts|js)$/);
  if (api) return "/api/" + api[1];
  const pages = p.match(/(?:^|\/)pages\/(.+?)\.(tsx|jsx|ts|js)$/);
  if (pages) return "/" + pages[1].replace(/index$/, "").replace(/\/index$/, "");
  const php = p.match(/([^/]+\.php)$/);
  if (php) return "/app/" + php[1];
  return "";
}

async function scanDirectory(handle: any, prefix = "", depth = 0): Promise<LocalFileInfo[]> {
  const out: LocalFileInfo[] = [];
  if (depth > 6) return out;

  for await (const [name, entry] of handle.entries()) {
    if (name === "node_modules" || name === ".next" || name === ".git" || name === "vendor") continue;
    const path = prefix ? `${prefix}/${name}` : name;

    if (entry.kind === "directory") {
      out.push(...await scanDirectory(entry, path, depth + 1));
    } else {
      const lower = name.toLowerCase();
      const allowed = [".tsx", ".jsx", ".ts", ".js", ".php", ".css", ".scss", ".sql", ".json", ".md"];
      if (!allowed.some((ext) => lower.endsWith(ext))) continue;
      const file = await entry.getFile();
      let content = "";
      if (file.size < 600000) {
        content = await file.text().catch(() => "");
      }
      out.push({
        name,
        path,
        kind: classifyFile(path),
        routeGuess: routeGuess(path),
        size: file.size,
        content
      });
    }
  }

  return out;
}

export default function CollectiumDeveloperBuilder() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [selectedPageKey, setSelectedPageKey] = useState("collectium_katalog");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [active, setActive] = useState<SearchResult | null>(null);
  const [drag, setDrag] = useState<null | { id: string; ox: number; oy: number }>(null);
  const [nodes, setNodes] = useState<NodeBox[]>([]);
  const [guides, setGuides] = useState<{ x?: number; y?: number; label?: string } | null>(null);
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Se alle frontend-designs, last inn lokal mappe, velg aktiv fil og bruk preflight før mock deploy." }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [localFiles, setLocalFiles] = useState<LocalFileInfo[]>([]);
  const [localProjectName, setLocalProjectName] = useState("");
  const [activeTab, setActiveTab] = useState<"map" | "allPages" | "local" | "frontDesigns" | "deploy">("frontDesigns");
  const [folderStatus, setFolderStatus] = useState("");
  const [deploy, setDeploy] = useState<DeployState>({
    changeSummary: "",
    selectedFile: null,
    preflight: null,
    deployReceipt: null,
    busy: false,
    confirmedFirst: false
  });

  useEffect(() => {
    fetch("/api/control/manifest")
      .then((r) => r.json())
      .then((data: Manifest) => {
        setManifest(data);
        setNodes((data.pages ?? []).map((p) => ({
          id: p.page_key,
          label: p.name,
          x: p.x ?? 80,
          y: p.y ?? 80,
          status: p.status ?? "unknown",
          links: p.links ?? [],
          url: p.url
        })));
      });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/control/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((data) => setResults(data.results ?? []))
        .catch(() => setResults([]));
    }, 120);
    return () => clearTimeout(t);
  }, [query]);

  const selectedPage = useMemo(() => manifest?.pages?.find((p) => p.page_key === selectedPageKey), [manifest, selectedPageKey]);
  const selectedComponents = useMemo(() => {
    if (!manifest || !selectedPage) return [];
    return (manifest.components ?? []).filter((c) => (c.used_on ?? []).includes(selectedPage.page_key) || (c.used_on ?? []).includes("all"));
  }, [manifest, selectedPage]);

  const localCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const file of localFiles) counts[file.kind] = (counts[file.kind] ?? 0) + 1;
    return counts;
  }, [localFiles]);

  const frontDesigns = useMemo(() => {
    const manifestDesigns = (manifest?.pages ?? []).map((p) => ({
      source: "manifest",
      title: p.name,
      key: p.page_key,
      route: p.url,
      status: p.status,
      role: p.role,
      file: null as LocalFileInfo | null
    }));
    const localDesigns = localFiles
      .filter((f) => f.kind === "page" || f.kind === "component" || f.kind === "style")
      .map((f) => ({
        source: "local",
        title: f.name,
        key: f.path,
        route: f.routeGuess || f.path,
        status: "loaded",
        role: f.kind,
        file: f
      }));
    return [...manifestDesigns, ...localDesigns];
  }, [manifest, localFiles]);

  function startDrag(e: React.MouseEvent, id: string) {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    setSelectedPageKey(id);
    setDrag({ id, ox: e.clientX - node.x, oy: e.clientY - node.y });
  }

  function move(e: React.MouseEvent) {
    if (!drag) return;
    const moving = nodes.find((n) => n.id === drag.id);
    if (!moving) return;
    let nx = Math.round(e.clientX - drag.ox);
    let ny = Math.round(e.clientY - drag.oy);
    let guide: { x?: number; y?: number; label?: string } | null = null;

    for (const other of nodes) {
      if (other.id === drag.id) continue;
      if (Math.abs(nx - other.x) < snap) {
        nx = other.x;
        guide = { x: other.x, label: "samme X" };
      }
      if (Math.abs(ny - other.y) < snap) {
        ny = other.y;
        guide = { ...(guide ?? {}), y: other.y, label: guide?.label ? `${guide.label} + samme Y` : "samme Y" };
      }
    }

    setGuides(guide);
    setNodes((list) => list.map((n) => n.id === drag.id ? { ...n, x: nx, y: ny } : n));
  }

  function endDrag() {
    setDrag(null);
    setGuides(null);
  }

  function chooseResult(r: SearchResult) {
    setActive(r);
    if (r.type === "page") {
      setSelectedPageKey(r.key);
      setActiveTab("map");
    }
    setAiMessages((m) => [...m, { role: "assistant", content: `Aktiv ${r.type}: ${r.label}\n\nStatus: ${r.status ?? "-"}\n${r.description ?? ""}` }]);
  }

  function chooseLocalFile(file: LocalFileInfo) {
    const result: SearchResult = {
      type: `local-${file.kind}`,
      key: file.path,
      label: file.name,
      status: "loaded",
      description: file.routeGuess || file.path,
      item: file
    };
    setActive(result);
    setDeploy((d) => ({ ...d, selectedFile: file, preflight: null, deployReceipt: null, confirmedFirst: false }));
    setActiveTab(file.kind === "page" || file.kind === "component" || file.kind === "style" ? "frontDesigns" : "local");
    setAiMessages((m) => [...m, { role: "assistant", content: `Aktiv lokal fil: ${file.name}\n\nType: ${file.kind}\nPath: ${file.path}\nRoute guess: ${file.routeGuess || "-"}` }]);
  }

  async function loadLocalFolder() {
    try {
      const picker = (window as any).showDirectoryPicker;
      if (typeof picker !== "function") {
        setFolderStatus("Browseren støtter ikke direkte mappevalg. Bruk Chrome eller Edge.");
        return;
      }
      const handle = await picker({ mode: "read" });
      setLocalProjectName(handle.name);
      setFolderStatus("Scanner mappe...");
      const files = await scanDirectory(handle);
      setLocalFiles(files.sort((a, b) => a.kind.localeCompare(b.kind) || a.path.localeCompare(b.path)));
      setActiveTab("frontDesigns");
      setFolderStatus(`Lastet ${files.length} filer fra ${handle.name}`);
      setAiMessages((m) => [...m, { role: "assistant", content: `Lokal mappe lastet: ${handle.name}\nFiler: ${files.length}\nSider: ${files.filter(f => f.kind === "page").length}\nAPI-er: ${files.filter(f => f.kind === "api").length}\nDB: ${files.filter(f => f.kind === "db").length}` }]);
    } catch {
      setFolderStatus("Mappevalg ble avbrutt eller blokkert.");
    }
  }

  function sendAi(prompt?: string) {
    const text = (prompt ?? aiInput).trim();
    if (!text) return;
    const found = results.slice(0, 5).map((r) => `${r.type}: ${r.key} (${r.status})`).join("\n");
    const activeText = active ? JSON.stringify(active.item, null, 2) : "Ingen aktiv valgt.";
    const localSummary = localFiles.length ? `Lokalt prosjekt: ${localProjectName}\nFiler: ${localFiles.length}\nPages: ${localCounts.page ?? 0}\nAPI: ${localCounts.api ?? 0}\nDB: ${localCounts.db ?? 0}` : "Ingen lokal mappe lastet.";
    setAiMessages((m) => [...m, { role: "user", content: text }, {
      role: "assistant",
      content: `Jeg bruker aktiv visning, søkeresultater, deploystatus og lokal mappeoversikt.\n\n${localSummary}\n\nAktiv:\n${activeText}\n\nTopp treff:\n${found || "Ingen treff ennå."}\n\nDeployregel: første bekreftelse kjører preflight. Andre bekreftelse gjør bare mock/staging deploy i denne versjonen.`
    }]);
    setAiInput("");
  }

  async function runPreflight() {
    const file = deploy.selectedFile;
    if (!file) {
      setDeploy((d) => ({ ...d, preflight: { status: "blocked", findings: [{ level: "blocker", title: "Ingen fil valgt", detail: "Velg en lokal frontfil først." }] } }));
      setActiveTab("deploy");
      return;
    }

    setDeploy((d) => ({ ...d, busy: true, preflight: null, deployReceipt: null, confirmedFirst: false }));
    try {
      const res = await fetch("/api/deploy/preflight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file, content: file.content ?? "", changes: deploy.changeSummary, context: { active, selectedPage, localProjectName } })
      });
      const data = await res.json();
      setDeploy((d) => ({ ...d, busy: false, preflight: data, confirmedFirst: !!data.canDeploy, deployReceipt: null }));
      setActiveTab("deploy");
    } catch {
      setDeploy((d) => ({ ...d, busy: false, preflight: { status: "blocked", findings: [{ level: "blocker", title: "Preflight-feil", detail: "Kunne ikke kjøre preflight." }] }, confirmedFirst: false }));
    }
  }

  async function mockDeploy() {
    if (!deploy.preflight?.canDeploy || !deploy.confirmedFirst || !deploy.selectedFile) return;
    const confirmText = window.confirm("Andre bekreftelse: Vil du kjøre mock/staging deploy? Ingen live filer skrives.");
    if (!confirmText) return;

    setDeploy((d) => ({ ...d, busy: true }));
    try {
      const res = await fetch("/api/deploy/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmed: true, preflightId: deploy.preflight.preflightId, file: deploy.selectedFile, changeSummary: deploy.changeSummary })
      });
      const data = await res.json();
      setDeploy((d) => ({ ...d, busy: false, deployReceipt: data }));
      setActiveTab("deploy");
    } catch {
      setDeploy((d) => ({ ...d, busy: false, deployReceipt: { ok: false, status: "error", message: "Mock deploy feilet." } }));
    }
  }

  if (!manifest) return <main className="devLoading">Laster Collectium Developer Builder...</main>;

  return (
    <div className="devShell">
      <header className="devTopbar">
        <div className="devBrand"><span>C</span><strong>Collectium Developer Builder</strong></div>
        <button onClick={() => setActiveTab("frontDesigns")}>Se frontdesign</button>
        <button onClick={() => setActiveTab("allPages")}>Se alle sider</button>
        <button onClick={loadLocalFolder}>Last inn lokal mappe</button>
        <button onClick={() => setActiveTab("deploy")}>Deploy</button>
        <button onClick={() => setQuery("route_whitelist")}>Route whitelist</button>
        <button onClick={() => setQuery("denomination_issue_raw_no")}>Valørutgave / serie</button>
      </header>

      <aside className="devLeft">
        <section className="devPanel">
          <h2>Søk i API-er og brytere</h2>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Søk: API, bryter, felt, page_key..." />
          <div className="resultList">
            {results.map((r) => (
              <button key={`${r.type}:${r.key}`} className={active?.key === r.key ? "active" : ""} onClick={() => chooseResult(r)}>
                <span>{r.type}</span>
                <strong>{r.label}</strong>
                <em>{r.status}</em>
              </button>
            ))}
          </div>
        </section>

        <section className="devPanel">
          <h2>Front / deploy</h2>
          <button className="primaryAction" onClick={() => setActiveTab("frontDesigns")}>Se alle frontdesign</button>
          <button className="primaryAction" onClick={loadLocalFolder}>Last inn lokal mappe</button>
          <button className="primaryAction" onClick={runPreflight}>1. AI-sjekk / preflight</button>
          <button className="primaryAction deployBtn" disabled={!deploy.preflight?.canDeploy} onClick={mockDeploy}>2. Deploy mock</button>
          <p className="hint">Deploy er mock/staging i v1.5. Live deploy må senere kobles til godkjent serverroute.</p>
          {folderStatus && <p className="statusLine">{folderStatus}</p>}
        </section>

        <section className="devPanel">
          <h2>Sider</h2>
          {manifest.pages.map((p) => (
            <button key={p.page_key} className={`pagePick ${p.page_key === selectedPageKey ? "active" : ""}`} onClick={() => { setSelectedPageKey(p.page_key); setActiveTab("map"); }}>
              <strong>{p.name}</strong>
              <span>{p.page_key}</span>
            </button>
          ))}
        </section>
      </aside>

      <main className="devMain" onMouseMove={move} onMouseUp={endDrag} onMouseLeave={endDrag}>
        {activeTab === "frontDesigns" && (
          <section className="frontDesignView">
            <h1>Alle frontdesign</h1>
            <p>Manifest-sider og lokale frontendfiler. Velg en lokal fil for preflight/deploy.</p>
            <div className="frontDesignGrid">
              {frontDesigns.map((d) => (
                <button key={`${d.source}:${d.key}`} className={`frontCard source-${d.source}`} onClick={() => d.file ? chooseLocalFile(d.file) : (setSelectedPageKey(d.key), setActive({ type: "page", key: d.key, label: d.title, status: d.status, description: d.role, item: manifest.pages.find((p) => p.page_key === d.key) }))}>
                  <span>{d.source}</span>
                  <strong>{d.title}</strong>
                  <em>{d.status}</em>
                  <code>{d.route}</code>
                  <p>{d.role}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeTab === "deploy" && (
          <section className="deployView">
            <h1>Deploy med dobbelbekreftelse</h1>
            <p>Først må AI/preflight sjekke filen. Deretter kan mock/staging deploy kjøres med andre bekreftelse.</p>
            <div className="deployGrid">
              <section className="deployPanel">
                <h2>Aktiv fil</h2>
                {deploy.selectedFile ? (
                  <>
                    <strong>{deploy.selectedFile.name}</strong>
                    <code>{deploy.selectedFile.path}</code>
                    <span>{deploy.selectedFile.kind} · {deploy.selectedFile.routeGuess || "ingen route"}</span>
                  </>
                ) : <p>Velg en lokal frontendfil fra “Se frontdesign”.</p>}
                <label>Endringsbeskrivelse<textarea value={deploy.changeSummary} onChange={(e) => setDeploy((d) => ({ ...d, changeSummary: e.target.value }))} placeholder="Beskriv hva du har endret og hvorfor..." /></label>
                <button onClick={runPreflight} disabled={deploy.busy}>1. Kjør AI-sjekk / preflight</button>
                <button className="deployBtn" onClick={mockDeploy} disabled={!deploy.preflight?.canDeploy || deploy.busy}>2. Deploy mock/staging</button>
              </section>
              <section className="deployPanel">
                <h2>Preflight-resultat</h2>
                {deploy.preflight ? (
                  <>
                    <p className={`deployStatus status-${deploy.preflight.status}`}>Status: {deploy.preflight.status}</p>
                    {(deploy.preflight.findings ?? []).map((f: any, i: number) => (
                      <div key={i} className={`finding level-${f.level}`}>
                        <strong>{f.title}</strong>
                        <p>{f.detail}</p>
                      </div>
                    ))}
                    <h3>AI-notat</h3>
                    <pre>{deploy.preflight.aiNote}</pre>
                  </>
                ) : <p>Ingen preflight kjørt.</p>}
              </section>
              <section className="deployPanel">
                <h2>Deploy-receipt</h2>
                {deploy.deployReceipt ? <pre>{JSON.stringify(deploy.deployReceipt, null, 2)}</pre> : <p>Ingen deploy kjørt.</p>}
              </section>
            </div>
          </section>
        )}

        {activeTab === "allPages" && (
          <section className="allPagesView">
            <h1>Alle sider</h1>
            <p>Manifest-sider og lokale sider fra valgt prosjektmappe.</p>
            <div className="allPageGrid">
              {manifest.pages.map((p) => (
                <button key={p.page_key} onClick={() => { setSelectedPageKey(p.page_key); setActiveTab("map"); }}>
                  <strong>{p.name}</strong>
                  <span>{p.page_key}</span>
                  <em>{p.status}</em>
                  <code>{p.url}</code>
                </button>
              ))}
              {localFiles.filter((f) => f.kind === "page").map((f) => (
                <button key={f.path} onClick={() => chooseLocalFile(f)}>
                  <strong>{f.name}</strong>
                  <span>local page</span>
                  <em>loaded</em>
                  <code>{f.routeGuess || f.path}</code>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeTab === "local" && (
          <section className="localProjectView">
            <h1>Aktivt lokalt prosjekt</h1>
            <p>{localProjectName ? `Mappe: ${localProjectName}` : "Ingen mappe er lastet ennå."}</p>
            <div className="localToolbar">
              <button onClick={loadLocalFolder}>Last inn / bytt mappe</button>
              <span>{folderStatus}</span>
            </div>
            <div className="localFileGrid">
              {localFiles.map((file) => (
                <button key={file.path} className={`fileKind-${file.kind}`} onClick={() => chooseLocalFile(file)}>
                  <span>{file.kind}</span>
                  <strong>{file.name}</strong>
                  <em>{file.routeGuess || file.path}</em>
                  <code>{file.path}</code>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeTab === "map" && (
          <>
            <section className="mapToolbar">
              <h1>Sidekart / funksjonskart</h1>
              <p>Dra sidene. Røde linjer viser X/Y-posisjon når sider/brytere står på linje.</p>
            </section>

            <div className="pageMap">
              <svg className="linkLayer">
                {nodes.flatMap((node) => (node.links ?? []).map((link) => {
                  const target = nodes.find((n) => n.id === link);
                  if (!target) return null;
                  return <line key={`${node.id}-${link}`} x1={node.x + 120} y1={node.y + 38} x2={target.x + 120} y2={target.y + 38} />;
                }))}
              </svg>

              {guides?.x !== undefined && <div className="guideX" style={{ left: guides.x }}><span>{guides.label}</span></div>}
              {guides?.y !== undefined && <div className="guideY" style={{ top: guides.y }}><span>{guides.label}</span></div>}

              {nodes.map((node) => (
                <div key={node.id} className={`pageNode status-${node.status} ${node.id === selectedPageKey ? "selected" : ""}`} style={{ left: node.x, top: node.y }} onMouseDown={(e) => startDrag(e, node.id)}>
                  <strong>{node.label}</strong>
                  <span>{node.id}</span>
                  <em>{node.status}</em>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <aside className="devRight">
        <section className="devPanel activeView">
          <h2>Aktiv visning</h2>
          {active ? (
            <>
              <p className="typeBadge">{active.type}</p>
              <h3>{active.label}</h3>
              <p>{active.description}</p>
              <pre>{JSON.stringify(active.item, null, 2)}</pre>
            </>
          ) : selectedPage ? (
            <>
              <p className="typeBadge">page</p>
              <h3>{selectedPage.name}</h3>
              <p>{selectedPage.role}</p>
              <div className="kv"><span>URL</span><strong>{selectedPage.url}</strong></div>
              <div className="kv"><span>Status</span><strong>{selectedPage.status}</strong></div>
              <h4>API-er</h4>
              {selectedPage.apis.map((api: string) => <code key={api}>{api}</code>)}
              <h4>DB</h4>
              {selectedPage.db.map((db: string) => <code key={db}>{db}</code>)}
              <h4>Komponenter på siden</h4>
              {selectedComponents.map((c) => <button key={c.component_key} onClick={() => chooseResult({ type: "component", key: c.component_key, label: c.name, status: c.status, description: c.type, item: c })}>{c.name}</button>)}
            </>
          ) : null}
        </section>

        <section className="devPanel aiPanel">
          <h2>AI chat</h2>
          <div className="aiQuick">
            <button onClick={() => sendAi("Finn alle API-er og brytere for valgt side eller aktiv lokal fil.")}>API/brytere</button>
            <button onClick={() => sendAi("Kontroller om aktiv bryter har DB og API kobling.")}>Kontroller bryter</button>
            <button onClick={() => sendAi("Se på aktiv fil og foreslå feil før deploy.")}>Sjekk fil</button>
          </div>
          <div className="aiMessages">
            {aiMessages.map((m, i) => <div key={i} className={`aiMsg ${m.role}`}><b>{m.role === "user" ? "Du" : "AI"}</b><p>{m.content}</p></div>)}
          </div>
          <textarea value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Søk/spør om frontend, API, bryter, DB, aktiv fil eller deploy..." />
          <button onClick={() => sendAi()}>Send</button>
        </section>

        <section className="devPanel">
          <h2>Deploy-policy</h2>
          <pre>{JSON.stringify(manifest.deploy_policy ?? {}, null, 2)}</pre>
        </section>
      </aside>
    </div>
  );
}
