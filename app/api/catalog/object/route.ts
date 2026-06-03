import { ctOk, ctFail } from "@/lib/response";
import { ctLogError } from "@/lib/logger";
import { getCatalogObject } from "@/db/queries/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source_key = searchParams.get("source_key") ?? "norske_sedler";
  const object_group = searchParams.get("object_group") ?? "banknote";
  const object_id = searchParams.get("object_id");

  if (!object_id) {
    return ctFail("CATALOG_OBJECT_ID_REQUIRED", "object_id mangler.", 400);
  }

  try {
    const object = await getCatalogObject(source_key, object_group, object_id);

    if (!object) {
      return ctFail("CATALOG_OBJECT_NOT_FOUND", "Fant ikke katalogobjektet.", 404);
    }

    return ctOk(object, { source_key, object_group, object_id });
  } catch (error) {
    ctLogError("api.catalog.object", error);
    return ctFail("CATALOG_OBJECT_FAILED", "Kunne ikke hente katalogobjekt.", 500);
  }
}
