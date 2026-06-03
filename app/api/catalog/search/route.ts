import { ctOk, ctFail } from '@/lib/response';
import { ctLogError } from '@/lib/logger';
import { searchCatalogObjects } from '@/db/queries/catalog';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sourceKey = url.searchParams.get('source_key') ?? 'norske_sedler';
  const objectGroup = url.searchParams.get('object_group') ?? 'banknote';
  const q = url.searchParams.get('q') ?? '';
  const filterField = url.searchParams.get('filter_field') ?? undefined;
  const filterValue = url.searchParams.get('filter_value') ?? undefined;
  try {
    const objects = await searchCatalogObjects(sourceKey, objectGroup, q, { filterField, filterValue });
    return ctOk(objects, { source_key: sourceKey, object_group: objectGroup, q, filter_field: filterField, filter_value: filterValue });
  } catch (error) {
    ctLogError('api.catalog.search', error);
    return ctFail('CATALOG_SEARCH_FAILED', 'Kunne ikke hente katalogobjekter.', 500);
  }
}
