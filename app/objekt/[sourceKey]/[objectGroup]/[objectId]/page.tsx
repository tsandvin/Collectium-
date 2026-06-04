// app/objekt/[sourceKey]/[objectGroup]/[objectId]/page.tsx
//
// Locked Next.js route:
//   /objekt/[sourceKey]/[objectGroup]/[objectId]
//
// Server component — resolves params, calls the API, renders the
// skin-aware client component. Skin/template is set globally on
// <html data-template="..."> by v5's Design mega menu — this page
// inherits it automatically.

import { notFound } from "next/navigation";
import ObjectPresentation from "./ObjectPresentation";
import { mockObjectData } from "./mock-data";
import type {
  ObjectGroup,
  ObjectPresentationData,
  Segment,
  ViewMode,
} from "./types";

type PageParams = {
  sourceKey: string;
  objectGroup: string;
  objectId: string;
};

type PageSearch = {
  segment?: string;
  view?: string;
  from?: string;
};

function isObjectGroup(s: string): s is ObjectGroup {
  return s === "banknote" || s === "coin" || s === "collectible";
}

function isSegment(s: string | undefined): s is Segment {
  return s === "samler" || s === "historie" || s === "finans" || s === "minsamling";
}

function isViewMode(s: string | undefined): s is ViewMode {
  return s === "horizontal" || s === "museum" || s === "compact";
}

async function fetchObjectData(
  sourceKey: string,
  objectGroup: ObjectGroup,
  objectId: number,
): Promise<ObjectPresentationData | null> {
  // PRODUCTION: replace with real API call.
  //
  //   const res = await fetch(
  //     `${process.env.API_BASE}/api/object/presentation?` +
  //       new URLSearchParams({
  //         source_key: sourceKey,
  //         object_group: objectGroup,
  //         object_id: String(objectId),
  //       }),
  //     { next: { revalidate: 60 } },
  //   );
  //   if (res.status === 404) return null;
  //   if (!res.ok) throw new Error(`API ${res.status}`);
  //   return (await res.json()) as ObjectPresentationData;

  return mockObjectData({
    source_key: sourceKey,
    object_group: objectGroup,
    object_id: objectId,
  });
}

export default async function ObjectPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearch>;
}) {
  const { sourceKey, objectGroup, objectId } = await params;
  const sp = await searchParams;

  if (!isObjectGroup(objectGroup)) notFound();
  const idNum = parseInt(objectId, 10);
  if (!Number.isFinite(idNum)) notFound();

  const data = await fetchObjectData(sourceKey, objectGroup, idNum);
  if (!data) notFound();

  return (
    <ObjectPresentation
      data={data}
      initialSegment={isSegment(sp.segment) ? sp.segment : "samler"}
      initialView={isViewMode(sp.view) ? sp.view : "horizontal"}
      from={typeof sp.from === "string" ? sp.from : "katalog"}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { sourceKey, objectGroup, objectId } = await params;
  return {
    title: `Objekt · ${objectId} · Collectium`,
    description: `Objektpresentasjon i ${sourceKey} (${objectGroup}).`,
  };
}
