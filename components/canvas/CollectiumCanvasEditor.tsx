"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CollectiumCatalogPage, type CatalogObject } from "@/components/frontend/CollectiumCatalogPage";
import { objectFilterOrder } from "@/lib/specs/collectiumSpecs";
import "./canvas.css";

type Kind = "box" | "text" | "button" | "card" | "image" | "object" | "tabs" | "filter";
type El = {
  id:string; kind:Kind; name:string; x:number; y:number; w:number; h:number; z:number;
  text:string; subtext?:string; bg:string; color:string; fontSize:number; fontWeight:number; padding:number;
  visible:boolean; locked:boolean; imageSrc?:string;
  outerEnabled:boolean; outerShape:string; outerLine:string; outerColor:string; outerWidth:number; outerRadius:number;
  innerEnabled:boolean; innerMode:string; innerColor:string; innerFade:number;
  sigEnabled:boolean; sigText:string; sigColor:string; sigFade:number;
  fontFamily:string;
};
type Frame = {
  id:string; title:string; x:number; y:number; w:number; h:number; bg:string;
  outerColor:string; outerWidth:number; outerRadius:number; sigText:string; sigColor:string; sigFade:number;
  elements:El[];
};
type Menu = {x:number;y:number;target:"canvas"|"frame"|"element";elementId?:string}|null;
type AiMessage = { role:"user"|"assistant"; content:string };

const base = {
  bg:"#fff", color:"#102A43", fontSize:13, fontWeight:600, padding:14,
  visible:true, locked:false, outerEnabled:true, outerShape:"soft", outerLine:"solid", outerColor:"#DCE6F0", outerWidth:1, outerRadius:18,
  innerEnabled:true, innerMode:"signature-corner", innerColor:"#8FB9DD", innerFade:42,
  sigEnabled:true, sigText:"Collectium", sigColor:"#8FB9DD", sigFade:58,
  fontFamily:"Segoe UI"
};

function make(kind:Kind, x=100, y=100, z=1): El {
  const common = { ...base, id:`${kind}-${Date.now()}-${Math.floor(Math.random()*9999)}`, kind, x, y, z };
  if(kind==="text") return {...common,name:"Tekst",w:330,h:60,text:"Rediger tekst",bg:"transparent",fontSize:22,fontWeight:800,outerEnabled:false,innerEnabled:false,sigEnabled:false};
  if(kind==="button") return {...common,name:"Knapp",w:190,h:48,text:"PrimÃ¦r handling",bg:"#1E5845",color:"#fff",fontWeight:900,outerColor:"#1E5845",outerRadius:10,innerEnabled:false,sigEnabled:false};
  if(kind==="card") return {...common,name:"Kort",w:350,h:200,text:"Katalogkort",subtext:"Objekt, historikk og verdi",fontSize:17,fontWeight:800,padding:20};
  if(kind==="image") return {...common,name:"Bilde",w:390,h:260,text:"Bilde",padding:0,sigEnabled:false};
  if(kind==="object") return {...common,name:"Datakort",w:760,h:260,text:"10 kroner 1949 A",subtext:"Resolved objektdata",fontSize:22,fontWeight:900,outerShape:"archive"};
  if(kind==="tabs") return {...common,name:"Folder/tabs",w:580,h:150,text:"Samler|Historie|Finans",fontWeight:900,sigEnabled:false};
  if(kind==="filter") return {...common,name:"Filter",w:720,h:160,text:"Objektfilter",fontWeight:800,innerMode:"fade-line"};
  return {...common,name:"Boks",w:280,h:150,text:""};
}

const initialFrame: Frame = {
  id:"main", title:"Ferdig Collectium frontendside", x:40, y:40, w:1280, h:840, bg:"#FFFDF8",
  outerColor:"#E4D4BD", outerWidth:2, outerRadius:24, sigText:"Collectium", sigColor:"#A78705", sigFade:92,
  elements:[
    {...make("text",42,52,1),id:"title",text:"COLLECTIUM",fontSize:38,fontWeight:800,color:"#1E5845",w:420,h:65,fontFamily:"Comfortaa"},
    {...make("object",42,150,2),id:"object-card",w:780,h:280,text:"10 kroner 1949 A",subtext:"norske_sedler Â· banknote Â· NO-BN-1949-10-A",outerColor:"#E4D4BD",innerColor:"#A78705",sigColor:"#A78705",fontFamily:"Comfortaa"},
    {...make("tabs",850,150,3),id:"tabs",w:360,h:140,text:"Samler|Historie|Finans",fontFamily:"Comfortaa"},
    {...make("card",850,330,4),id:"market",w:320,h:180,text:"Marked",subtext:"15 000 NOK Â· â–² 12% / 12 mnd",bg:"#FFF8ED",outerColor:"#E7D1A8",innerMode:"corners",innerColor:"#A78705"}
  ]
};

export default function CollectiumCanvasEditor() {
  const [frame,setFrame] = useState<Frame>(initialFrame);
  const [selectedId,setSelectedId] = useState<string|null>("object-card");
  const [zoom,setZoom] = useState(.72);
  const [drag,setDrag] = useState<null|{id:string;ox:number;oy:number}>(null);
  const [menu,setMenu] = useState<Menu>(null);
  const [styleClip,setStyleClip] = useState<Partial<El>|null>(null);
  const [catalogObject,setCatalogObject] = useState<CatalogObject|null>(null);
  const [objects,setObjects] = useState<CatalogObject[]>([]);
  const [previewMode,setPreviewMode] = useState<"canvas"|"frontend">("canvas");
  const [aiMessages,setAiMessages] = useState<AiMessage[]>([{role:"assistant",content:"Hei. Jeg kan hjelpe med UI, tekst, React, lag, kilde/database og eksport. Velg et element eller et kildeobjekt og spÃ¸r meg."}]);
  const [aiInput,setAiInput] = useState("");
  const [aiBusy,setAiBusy] = useState(false);
  const [exportStatus,setExportStatus] = useState("");
  const fileRef = useRef<HTMLInputElement|null>(null);
  const selected = useMemo(()=>frame.elements.find(e=>e.id===selectedId)||null,[frame,selectedId]);

  useEffect(()=>{fetch("/api/catalog/object").then(r=>r.json()).then(d=>{setCatalogObject(d.object);setObjects(d.objects??[]);}).catch(()=>{});},[]);

  function patchEl(id:string,p:Partial<El>){setFrame(f=>({...f,elements:f.elements.map(e=>e.id===id?{...e,...p}:e)}));}
  function patchFrame(p:Partial<Frame>){setFrame(f=>({...f,...p}));}
  function add(kind:Kind){const z=Math.max(0,...frame.elements.map(e=>e.z))+1; const e=make(kind,120+z*8,120+z*8,z); setFrame(f=>({...f,elements:[...f.elements,e]})); setSelectedId(e.id);}
  function del(id=selectedId){if(!id)return; setFrame(f=>({...f,elements:f.elements.filter(e=>e.id!==id)})); if(selectedId===id)setSelectedId(null);}
  function dup(id=selectedId){const e=frame.elements.find(x=>x.id===id); if(!e)return; const z=Math.max(0,...frame.elements.map(x=>x.z))+1; const c={...e,id:`${e.kind}-${Date.now()}`,name:e.name+" kopi",x:e.x+28,y:e.y+28,z}; setFrame(f=>({...f,elements:[...f.elements,c]})); setSelectedId(c.id);}
  function layerMove(id:string,mode:"up"|"down"|"front"|"back"){const e=frame.elements.find(x=>x.id===id);if(!e)return;const zs=frame.elements.map(x=>x.z);const z=mode==="front"?Math.max(...zs)+1:mode==="back"?1:mode==="up"?e.z+1:Math.max(1,e.z-1);patchEl(id,{z});}
  function toggleVisible(id:string){const e=frame.elements.find(x=>x.id===id);if(e)patchEl(id,{visible:!e.visible});}
  function toggleLocked(id:string){const e=frame.elements.find(x=>x.id===id);if(e)patchEl(id,{locked:!e.locked});}
  function copyStyle(e:El){const {bg,color,fontSize,fontWeight,padding,outerEnabled,outerShape,outerLine,outerColor,outerWidth,outerRadius,innerEnabled,innerMode,innerColor,innerFade,sigEnabled,sigText,sigColor,sigFade,fontFamily}=e;setStyleClip({bg,color,fontSize,fontWeight,padding,outerEnabled,outerShape,outerLine,outerColor,outerWidth,outerRadius,innerEnabled,innerMode,innerColor,innerFade,sigEnabled,sigText,sigColor,sigFade,fontFamily});}

  function applyObject(o:CatalogObject){
    setCatalogObject(o);
    const obj=frame.elements.find(e=>e.id==="object-card");
    const market=frame.elements.find(e=>e.id==="market");
    if(obj)patchEl(obj.id,{text:o.title,subtext:`${o.source_key} Â· ${o.object_group} Â· ${o.object_id}`});
    if(market)patchEl(market.id,{text:"Marked",subtext:`${Number(o.market_value??0).toLocaleString("nb-NO")} ${o.currency??"NOK"} Â· ${Number(o.trend_percent_12m??0)>=0?"â–²":"â–¼"} ${o.trend_percent_12m??0}% / 12 mnd`});
  }
  function context(action:string){
    if(!menu)return; const e=menu.elementId?frame.elements.find(x=>x.id===menu.elementId):null;
    if(action==="delete"&&e)del(e.id); if(action==="duplicate"&&e)dup(e.id); if(action==="front"&&e)layerMove(e.id,"front"); if(action==="back"&&e)layerMove(e.id,"back");
    if(action==="copy"&&e)copyStyle(e); if(action==="paste"&&e&&styleClip)patchEl(e.id,styleClip);
    if(action==="white"){e?patchEl(e.id,{bg:"#fff"}):patchFrame({bg:"#fff"});} if(action==="soft"){e?patchEl(e.id,{bg:"#F7FBFF"}):patchFrame({bg:"#F7FBFF"});} if(action==="cream"){e?patchEl(e.id,{bg:"#FFFDF8"}):patchFrame({bg:"#FFFDF8"});}
    if(action.startsWith("add-"))add(action.replace("add-","") as Kind); if(action==="import")fileRef.current?.click(); setMenu(null);
  }
  function startEl(ev:React.MouseEvent,e:El){if(e.locked)return;ev.stopPropagation();setSelectedId(e.id);setDrag({id:e.id,ox:ev.clientX/zoom-e.x,oy:ev.clientY/zoom-e.y});}
  function move(ev:React.MouseEvent){if(!drag)return;const e=frame.elements.find(x=>x.id===drag.id);if(!e||e.locked)return;patchEl(e.id,{x:Math.max(0,Math.round(ev.clientX/zoom-drag.ox)),y:Math.max(0,Math.round(ev.clientY/zoom-drag.oy))});}
  async function importFile(file:File){const z=Math.max(0,...frame.elements.map(e=>e.z))+1;const n=file.name.toLowerCase();if(n.endsWith(".json")){try{const d=JSON.parse(await file.text());if(d.frame)setFrame(d.frame)}catch{}return;}if(file.type.startsWith("image/")||/\.(png|jpg|jpeg|webp|svg)$/.test(n)){const src=await readData(file);const e={...make("image",120,120,z),name:file.name,text:file.name,imageSrc:src,w:520,h:340};setFrame(f=>({...f,elements:[...f.elements,e]}));setSelectedId(e.id);}}
  function exportJson(){download(new Blob([JSON.stringify({frame,catalogObject},null,2)],{type:"application/json"}),"collectium-v09.json");}


  function projectPayload() {
    return {
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      frame,
      selectedElement: selected,
      catalogObject,
      objects,
      notes: "Collectium Canvas Pro export. React/Next.js is frontend only. MariaDB/API is source of truth."
    };
  }

  async function sendAI(prompt?: string) {
    const content = (prompt ?? aiInput).trim();
    if (!content || aiBusy) return;
    const nextMessages: AiMessage[] = [...aiMessages, { role: "user", content }];
    setAiMessages(nextMessages);
    setAiInput("");
    setAiBusy(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          context: {
            selectedElement: selected,
            selectedObject: catalogObject,
            frameTitle: frame.title,
            layerCount: frame.elements.length,
            filterOrder: objectFilterOrder
          }
        })
      });
      const data = await response.json();
      setAiMessages([...nextMessages, { role: "assistant", content: data.reply ?? "Ingen respons." }]);
    } catch {
      setAiMessages([...nextMessages, { role: "assistant", content: "Jeg fikk ikke kontakt med AI-ruten. Editor og eksport fungerer fortsatt lokalt." }]);
    } finally {
      setAiBusy(false);
    }
  }

  function frontendComponentSource() {
    return `import { CollectiumCatalogPage } from "@/components/frontend/CollectiumCatalogPage";\n\nconst object = ${JSON.stringify(catalogObject, null, 2)};\n\nexport default function ExportedCollectiumPage() {\n  return <CollectiumCatalogPage object={object} />;\n}\n`;
  }

  async function exportProjectFolder() {
    const folderName = `Collectium-export-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}`;
    const payload = projectPayload();

    try {
      const picker = (window as any).showDirectoryPicker;
      if (typeof picker !== "function") {
        download(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), `${folderName}.json`);
        setExportStatus("Browseren stÃ¸tter ikke direkte mappeeksport. Jeg lastet ned JSON som fallback.");
        return;
      }

      const rootHandle = await picker({ mode: "readwrite" });
      const projectHandle = await rootHandle.getDirectoryHandle(folderName, { create: true });

      await writeFile(projectHandle, "project.json", JSON.stringify(payload, null, 2));
      await writeFile(projectHandle, "current-object.json", JSON.stringify(catalogObject, null, 2));
      await writeFile(projectHandle, "frame.json", JSON.stringify(frame, null, 2));
      await writeFile(projectHandle, "ExportedCollectiumPage.tsx", frontendComponentSource());
      await writeFile(projectHandle, "README.md", [
        "# Collectium export",
        "",
        "Denne mappen ble eksportert fra Collectium Canvas Pro v1.0.",
        "",
        "Filer:",
        "- project.json: hele editorprosjektet",
        "- frame.json: gjeldende canvas/frame",
        "- current-object.json: valgt kilde/databaseobjekt",
        "- ExportedCollectiumPage.tsx: enkel Next.js/React-side basert pÃ¥ valgt objekt",
        "",
        "Regel: React/Next.js er frontend. MariaDB/API er source of truth.",
        ""
      ].join("\\n"));

      setExportStatus(`Eksportert til egen mappe: ${folderName}`);
    } catch (error) {
      setExportStatus("Eksport avbrutt eller blokkert av browseren.");
    }
  }

  async function writeFile(dirHandle: any, name: string, content: string) {
    const fileHandle = await dirHandle.getFileHandle(name, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  return <div className="ctApp" onClick={()=>setMenu(null)}>
    <header className="ctTopbar">
      <div className="ctBrand"><span className="ctMark">C</span><span>Collectium</span></div><span className="ctPill">v1.0</span>
      <button className={`ctBtn ${previewMode==="canvas"?"active":""}`} onClick={()=>setPreviewMode("canvas")}>Canvas</button>
      <button className={`ctBtn ${previewMode==="frontend"?"active":""}`} onClick={()=>setPreviewMode("frontend")}>Ferdig frontend</button>
      <button className="ctBtn" onClick={()=>setZoom(Math.max(.22,zoom-.08))}>-</button><span className="ctZoom">{Math.round(zoom*100)}%</span><button className="ctBtn" onClick={()=>setZoom(Math.min(1.8,zoom+.08))}>+</button>
      <span className="ctGrow"/><input ref={fileRef} hidden type="file" accept=".json,.png,.jpg,.jpeg,.webp,.svg" onChange={e=>e.target.files?.[0]&&importFile(e.target.files[0])}/><button className="ctBtn import" onClick={()=>fileRef.current?.click()}>Importer</button><button className="ctBtn gold" onClick={exportJson}>Eksporter JSON</button><button className="ctBtn green" onClick={exportProjectFolder}>Eksporter mappe</button>
    </header>
    <aside className="ctSide"><div className="ctPanelHead">Elementer</div><div className="ctSideScroll"><p className="ctHelp">Kilde/database + lagpanel + AI-chat + eksport til egen mappe.</p><div className="ctElementGrid">{(["box","text","button","card","tabs","image","object","filter"] as Kind[]).map(k=><button key={k} className="ctLibItem compact" onClick={()=>add(k)}><b>{k}</b><span>legg til</span></button>)}</div><DataSourcePanel objects={objects} selected={catalogObject} onSelect={applyObject}/><LayerPanel frame={frame} selectedId={selectedId} onSelect={setSelectedId} onVisible={toggleVisible} onLocked={toggleLocked} onUp={id=>layerMove(id,"up")} onDown={id=>layerMove(id,"down")} onFront={id=>layerMove(id,"front")} onBack={id=>layerMove(id,"back")} onDuplicate={dup} onDelete={del}/></div></aside>
    <main className="ctCanvas" onWheel={e=>{e.preventDefault();setZoom(Math.min(1.8,Math.max(.22,zoom+(e.deltaY<0?.07:-.07))))}} onMouseMove={move} onMouseUp={()=>setDrag(null)} onMouseLeave={()=>setDrag(null)} onContextMenu={e=>{e.preventDefault();setMenu({x:e.clientX,y:e.clientY,target:"canvas"})}}>
      {previewMode==="frontend"&&catalogObject?<div className="frontendPreview"><CollectiumCatalogPage object={catalogObject}/></div>:<div className="ctCanvasInner" style={{transform:`scale(${zoom})`}}><section className="ctFrame" style={frameStyle(frame)} onContextMenu={e=>{e.preventDefault();e.stopPropagation();setMenu({x:e.clientX,y:e.clientY,target:"frame"})}}><div className="ctFrameHeader"><span>{frame.title}</span><em>{frame.w} x {frame.h}</em></div><div className="ctFrameBody"><InnerFrame v={frame}/><LockedSignature text={frame.sigText} color={frame.sigColor} fade={frame.sigFade}/>{[...frame.elements].filter(e=>e.visible).sort((a,b)=>a.z-b.z).map(e=><div key={e.id} className={`editableElement ${e.id===selectedId?"selectedElement":""} ${e.locked?"locked":""}`} style={style(e)} onMouseDown={ev=>startEl(ev,e)} onContextMenu={ev=>{ev.preventDefault();ev.stopPropagation();setSelectedId(e.id);setMenu({x:ev.clientX,y:ev.clientY,target:"element",elementId:e.id})}}><InnerFrame v={e}/>{render(e,catalogObject)}{e.sigEnabled&&<LockedSignature text={e.sigText} color={e.sigColor} fade={e.sigFade}/>}</div>)}</div></section></div>}
    </main>
    <aside className="ctInspector"><div className="ctPanelHead">Egenskaper + AI</div><div className="ctInspectorBody">{selected?<Inspector e={selected} patch={p=>patchEl(selected.id,p)} del={()=>del()} dup={()=>dup()}/>:<FrameInspector frame={frame} patch={patchFrame}/>}<AiChat messages={aiMessages} input={aiInput} busy={aiBusy} exportStatus={exportStatus} onInput={setAiInput} onSend={()=>sendAI()} onPrompt={sendAI}/></div></aside>
    {menu&&<ContextMenu menu={menu} hasElement={!!menu.elementId} hasStyle={!!styleClip} onAction={context}/>}
  </div>;
}


function AiChat({messages,input,busy,exportStatus,onInput,onSend,onPrompt}:{messages:AiMessage[];input:string;busy:boolean;exportStatus:string;onInput:(value:string)=>void;onSend:()=>void;onPrompt:(value:string)=>void}) {
  return <section className="aiPanel">
    <div className="ctPanelHead small">AI chat</div>
    <div className="aiQuick">
      <button onClick={()=>onPrompt("Analyser valgt element og foreslÃ¥ bedre UI.")}>Analyser element</button>
      <button onClick={()=>onPrompt("Lag React-komponent av valgt design og valgt kildeobjekt.")}>Lag React</button>
      <button onClick={()=>onPrompt("ForeslÃ¥ database/API-felt for denne frontendsiden.")}>DB/API</button>
      <button onClick={()=>onPrompt("Skriv bedre tekst for valgt Collectium-side.")}>Tekst</button>
    </div>
    <div className="aiMessages">
      {messages.map((message,index)=><div key={index} className={`aiMsg ${message.role}`}><b>{message.role==="user"?"Du":"AI"}</b><p>{message.content}</p></div>)}
      {busy && <div className="aiMsg assistant"><b>AI</b><p>Skriver...</p></div>}
    </div>
    <textarea value={input} onChange={e=>onInput(e.target.value)} placeholder="SpÃ¸r som i ChatGPT: lag komponent, rydd layout, koble DB-felt, skriv tekst..." onKeyDown={e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey))onSend();}}/>
    <button className="ctBtn green full" onClick={onSend} disabled={busy}>{busy?"Jobber...":"Send"}</button>
    {exportStatus && <p className="exportStatus">{exportStatus}</p>}
  </section>;
}

function DataSourcePanel({objects,selected,onSelect}:{objects:CatalogObject[];selected:CatalogObject|null;onSelect:(o:CatalogObject)=>void}){return <section className="dataPanel"><div className="ctPanelHead small">Kilde / database</div><p>Resolved mockdata. Senere byttes dette mot MariaDB/API.</p><select value={selected?.object_id??""} onChange={e=>{const o=objects.find(x=>x.object_id===e.target.value);if(o)onSelect(o)}}>{objects.map(o=><option key={o.object_id} value={o.object_id}>{o.title}</option>)}</select>{selected&&<div className="dataCard"><b>{selected.title}</b><span>{selected.source_key} Â· {selected.object_group}</span><span>{selected.object_id}</span></div>}<div className="filterMap">{objectFilterOrder.slice(0,5).map(f=><span key={f.field}>{f.label}</span>)}</div></section>}
function LayerPanel({frame,selectedId,onSelect,onVisible,onLocked,onUp,onDown,onFront,onBack,onDuplicate,onDelete}:{frame:Frame;selectedId:string|null;onSelect:(id:string)=>void;onVisible:(id:string)=>void;onLocked:(id:string)=>void;onUp:(id:string)=>void;onDown:(id:string)=>void;onFront:(id:string)=>void;onBack:(id:string)=>void;onDuplicate:(id:string)=>void;onDelete:(id:string)=>void}){return <section className="layerPanel"><div className="ctPanelHead small">Lag</div>{[...frame.elements].sort((a,b)=>b.z-a.z).map(e=><div key={e.id} className={`layerRow ${e.id===selectedId?"active":""} ${!e.visible?"hiddenLayer":""}`} onClick={()=>onSelect(e.id)}><div className="layerMain"><b>{e.name}</b><span>{e.kind} Â· z {e.z}</span></div><div className="layerBtns"><button onClick={ev=>{ev.stopPropagation();onVisible(e.id)}}>{e.visible?"ðŸ‘":"â€”"}</button><button onClick={ev=>{ev.stopPropagation();onLocked(e.id)}}>{e.locked?"ðŸ”’":"ðŸ”“"}</button><button onClick={ev=>{ev.stopPropagation();onUp(e.id)}}>â†‘</button><button onClick={ev=>{ev.stopPropagation();onDown(e.id)}}>â†“</button><button onClick={ev=>{ev.stopPropagation();onFront(e.id)}}>F</button><button onClick={ev=>{ev.stopPropagation();onBack(e.id)}}>B</button><button onClick={ev=>{ev.stopPropagation();onDuplicate(e.id)}}>â§‰</button><button className="danger" onClick={ev=>{ev.stopPropagation();onDelete(e.id)}}>Ã—</button></div></div>)}</section>}
function ContextMenu({menu,hasElement,hasStyle,onAction}:{menu:NonNullable<Menu>;hasElement:boolean;hasStyle:boolean;onAction:(a:string)=>void}){return <div className="contextMenu" style={{left:menu.x,top:menu.y}} onClick={e=>e.stopPropagation()}><div className="contextMenu__title">{menu.target}</div><button onClick={()=>onAction("add-box")}>+ Legg til boks</button><button onClick={()=>onAction("add-text")}>+ Legg til tekst</button><button onClick={()=>onAction("add-button")}>+ Legg til knapp</button><button onClick={()=>onAction("add-card")}>+ Legg til kort</button><button onClick={()=>onAction("import")}>Importer bilde</button><div className="contextMenu__sep"/><button onClick={()=>onAction("white")}>Bakgrunn: hvit</button><button onClick={()=>onAction("soft")}>Bakgrunn: soft blÃ¥</button><button onClick={()=>onAction("cream")}>Bakgrunn: krem</button>{hasElement&&<><div className="contextMenu__sep"/><button onClick={()=>onAction("duplicate")}>Dupliser</button><button onClick={()=>onAction("front")}>Send foran</button><button onClick={()=>onAction("back")}>Send bak</button><button onClick={()=>onAction("copy")}>Kopier style</button><button disabled={!hasStyle} onClick={()=>onAction("paste")}>Lim inn style</button><button className="danger" onClick={()=>onAction("delete")}>Slett</button></>}</div>}
function Inspector({e,patch,del,dup}:{e:El;patch:(p:Partial<El>)=>void;del:()=>void;dup:()=>void}){return <div className="ctProps"><h3>{e.name}</h3><details open><summary>Basis</summary><label>Navn<input value={e.name} onChange={x=>patch({name:x.target.value})}/></label><label>Tekst<textarea value={e.text} onChange={x=>patch({text:x.target.value})}/></label><label>Undertekst<textarea value={e.subtext||""} onChange={x=>patch({subtext:x.target.value})}/></label><div className="ctGrid4"><Num l="X" v={e.x} c={x=>patch({x})}/><Num l="Y" v={e.y} c={y=>patch({y})}/><Num l="B" v={e.w} c={w=>patch({w})}/><Num l="H" v={e.h} c={h=>patch({h})}/></div><Color l="Bakgrunn" v={e.bg} c={bg=>patch({bg})}/><label className="check"><input type="checkbox" checked={e.visible} onChange={x=>patch({visible:x.target.checked})}/> Synlig</label><label className="check"><input type="checkbox" checked={e.locked} onChange={x=>patch({locked:x.target.checked})}/> LÃ¥st</label></details><TextSection v={e} patch={patch}/><FrameSections v={e} patch={patch}/><button className="ctBtn full" onClick={dup}>Dupliser</button><button className="ctBtn danger full" onClick={del}>Slett</button></div>}
function FrameInspector({frame,patch}:{frame:Frame;patch:(p:Partial<Frame>)=>void}){return <div className="ctProps"><h3>{frame.title}</h3><details open><summary>Frame</summary><label>Tittel<input value={frame.title} onChange={e=>patch({title:e.target.value})}/></label><div className="ctGrid4"><Num l="X" v={frame.x} c={x=>patch({x})}/><Num l="Y" v={frame.y} c={y=>patch({y})}/><Num l="B" v={frame.w} c={w=>patch({w})}/><Num l="H" v={frame.h} c={h=>patch({h})}/></div><Color l="Bakgrunn" v={frame.bg} c={bg=>patch({bg})}/></details></div>}
function TextSection<T extends {color:string;fontSize:number;fontWeight:number;fontFamily:string} & Record<string, any>>({v,patch}:{v:T;patch:(p:Partial<T>)=>void}){return <details open><summary>Tekst / skrift</summary><Color l="Tekstfarge" v={v.color} c={color=>patch({color} as unknown as Partial<T>)}/><Select label="Skrift" value={v.fontFamily} options={["Segoe UI","Comfortaa","Inter","Georgia","Cascadia Code"]} onChange={fontFamily=>patch({fontFamily} as unknown as Partial<T>)}/><div className="ctGrid3"><Num l="Font" v={v.fontSize} c={fontSize=>patch({fontSize} as unknown as Partial<T>)}/><Num l="Vekt" v={v.fontWeight} c={fontWeight=>patch({fontWeight} as unknown as Partial<T>)}/><Num l="Pad" v={v.padding??0} c={padding=>patch({padding} as unknown as Partial<T>)}/></div></details>}
function FrameSections<T extends Record<string, any>>({v,patch}:{v:T;patch:(p:Partial<T>)=>void}){return <><details open><summary>Ytre ramme</summary><label className="check"><input type="checkbox" checked={v.outerEnabled} onChange={e=>patch({outerEnabled:e.target.checked} as unknown as Partial<T>)}/> Bruk ytre ramme</label><Select label="Fasong" value={v.outerShape} options={["rect","soft","archive","folder","cut-corner","museum-label"]} onChange={outerShape=>patch({outerShape} as unknown as Partial<T>)}/><Select label="Strek" value={v.outerLine} options={["solid","dashed","dotted","double","fade","inner-shadow"]} onChange={outerLine=>patch({outerLine} as unknown as Partial<T>)}/><Color l="Farge" v={v.outerColor} c={outerColor=>patch({outerColor} as unknown as Partial<T>)}/><div className="ctGrid2"><Num l="Tykkelse" v={v.outerWidth} c={outerWidth=>patch({outerWidth} as unknown as Partial<T>)}/><Num l="Radius" v={v.outerRadius} c={outerRadius=>patch({outerRadius} as unknown as Partial<T>)}/></div></details><details open><summary>Indre ramme</summary><label className="check"><input type="checkbox" checked={v.innerEnabled} onChange={e=>patch({innerEnabled:e.target.checked} as unknown as Partial<T>)}/> Bruk indre ramme</label><Select label="Modus" value={v.innerMode} options={["none","full","top","right","bottom","left","top-bottom","left-right","corners","signature-corner","fade-line"]} onChange={innerMode=>patch({innerMode} as unknown as Partial<T>)}/><Color l="Farge" v={v.innerColor} c={innerColor=>patch({innerColor} as unknown as Partial<T>)}/><Num l="Fade" v={v.innerFade} c={innerFade=>patch({innerFade} as unknown as Partial<T>)}/></details><details open><summary>Signatur</summary><label className="check"><input type="checkbox" checked={v.sigEnabled} onChange={e=>patch({sigEnabled:e.target.checked} as unknown as Partial<T>)}/> Bruk signatur</label><label>Signaturtekst<input value={v.sigText} onChange={e=>patch({sigText:e.target.value} as unknown as Partial<T>)}/></label><Color l="Farge" v={v.sigColor} c={sigColor=>patch({sigColor} as unknown as Partial<T>)}/><Num l="Fade" v={v.sigFade} c={sigFade=>patch({sigFade} as unknown as Partial<T>)}/></details></>}
function Num({l,v,c}:{l:string;v:number;c:(n:number)=>void}){return <label>{l}<input type="number" value={Math.round(v)} onChange={e=>c(Number(e.target.value))}/></label>}
function Select({label,value,options,onChange}:{label:string;value:string;options:string[];onChange:(v:string)=>void}){return <label>{label}<select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select></label>}
function Color({l,v,c}:{l:string;v:string;c:(s:string)=>void}){return <label>{l}<div className="colorRow"><input type="color" value={/^#[0-9A-Fa-f]{6}$/.test(v)?v:"#ffffff"} onChange={e=>c(e.target.value)}/><input value={v} onChange={e=>c(e.target.value)}/></div></label>}
function frameStyle(f:Frame):React.CSSProperties{return{left:f.x,top:f.y,width:f.w,height:f.h,background:f.bg,border:`${f.outerWidth}px solid ${f.outerColor}`,borderRadius:f.outerRadius,boxShadow:"0 18px 46px rgba(16,42,67,.10)",fontFamily:"Comfortaa, Segoe UI, system-ui"}}
function style(e:El):React.CSSProperties{return{left:e.x,top:e.y,width:e.w,height:e.h,zIndex:e.z,background:e.bg,color:e.color,border:e.outerEnabled?`${e.outerWidth}px solid ${e.outerColor}`:"0",borderRadius:e.outerRadius,fontSize:e.fontSize,fontWeight:e.fontWeight,padding:e.padding,boxShadow:"0 16px 34px rgba(16,42,67,.12)",fontFamily:e.fontFamily==="Comfortaa"?"Comfortaa, Segoe UI, system-ui":e.fontFamily}}
function InnerFrame({v}:{v:any}){if(!v.innerEnabled||v.innerMode==="none")return null;return <span className={`innerFrame mode-${v.innerMode}`} style={{"--innerColor":v.innerColor,"--innerFade":v.innerFade/100} as React.CSSProperties}/>}
function LockedSignature({text,color,fade}:{text:string;color:string;fade:number}){return <span className="lockedSignature" style={{"--sigColor":color,"--sigFade":fade/100} as React.CSSProperties}><span>{text}</span></span>}
function render(e:El,data:CatalogObject|null){if(e.kind==="image")return e.imageSrc?<img className="importedImage" src={e.imageSrc} alt={e.text}/>:<div className="imageElement">â—‡<span>{e.text}</span></div>;if(e.kind==="tabs")return <div className="tabElement">{e.text.split("|").map((t,i)=><span key={t} className={i===0?"active":""}>{t}</span>)}</div>;if(e.kind==="object")return <div className="objectElement"><div className="notePreview">10<br/><small>{data?.issuer_raw_no??"NORGES BANK"}</small></div><div><h2>{data?.title??e.text}</h2><p>{e.subtext}</p><div className="chips"><span>{data?.source_key}</span><span>{data?.object_group}</span><span>{data?.litra_raw_no}</span></div><strong>{Number(data?.market_value??0).toLocaleString("nb-NO")} {data?.currency??"NOK"}</strong></div></div>;if(e.kind==="filter")return <div className="filterElement"><b>{e.text}</b><div>{objectFilterOrder.slice(0,6).map((f,i)=><span key={f.field}>{i+1}. {f.label}</span>)}</div></div>;if(e.kind==="card")return <div className="cardElement"><h3>{e.text}</h3><p>{e.subtext}</p></div>;if(e.kind==="button")return <button className="buttonElement">{e.text}</button>;return <div className="plainElement">{e.text}</div>}
function readData(file:File){return new Promise<string>((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result));r.onerror=rej;r.readAsDataURL(file)})}
function download(blob:Blob,name:string){const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}


