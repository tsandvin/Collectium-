import sourceData from "@/data/collectium_sources.json";

export type CollectiumResolvedObject = typeof sourceData.sources[number]["objects"][number];

export function getSources() {
  return sourceData.sources.map(({ source_key, source_label, object_group }) => ({ source_key, source_label, object_group }));
}

export function getResolvedObjects() {
  return sourceData.sources.flatMap((source) => source.objects);
}

export function getResolvedObject(source_key = "norske_sedler", object_group = "banknote", object_id = "NO-BN-1949-10-A") {
  return getResolvedObjects().find((object) =>
    object.source_key === source_key &&
    object.object_group === object_group &&
    object.object_id === object_id
  ) ?? getResolvedObjects()[0];
}
