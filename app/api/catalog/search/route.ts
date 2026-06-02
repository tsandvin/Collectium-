import { ctOk, ctFail } from '@/lib/response';
import { ctLogError } from '@/lib/logger';
import { searchCatalogObjects } from '@/db/queries/catalog';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sourceKey = url.searchParams.get('source_key') ?? 'norske_sedler';
  const objectGroup = url.searchParams.get('object_group') ?? 'banknote';
  const q = url.searchParams.get('q') ?? '';
  try {
    const objects = await searchCatalogObjects(sourceKey, objectGroup, q);
    return ctOk(objects, { source_key: sourceKey, object_group: objectGroup, q });
  } catch (error) {
    ctLogError('api.catalog.search', error);
    return ctFail('CATALOG_SEARCH_FAILED', 'Kunne ikke hente katalogobjekter.', 500);
  }
}
