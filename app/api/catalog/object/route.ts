import { ctOk, ctFail } from '@/lib/response';
import { ctLogError } from '@/lib/logger';
import { getCatalogObject } from '@/db/queries/catalog';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sourceKey = url.searchParams.get('source_key');
  const objectGroup = url.searchParams.get('object_group');
  const objectId = url.searchParams.get('object_id');
  if (!sourceKey || !objectGroup || !objectId) return ctFail('MISSING_OBJECT_KEY', 'Mangler source_key, object_group eller object_id.', 422);
  try {
    const object = await getCatalogObject(sourceKey, objectGroup, objectId);
    if (!object) return ctFail('OBJECT_NOT_FOUND', 'Objektet finnes ikke.', 404);
    return ctOk(object, { source_key: sourceKey, object_group: objectGroup, object_id: objectId });
  } catch (error) {
    ctLogError('api.catalog.object', error);
    return ctFail('CATALOG_OBJECT_FAILED', 'Kunne ikke hente objekt.', 500);
  }
}
