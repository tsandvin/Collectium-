import { ctOk, ctFail } from '@/lib/response';
import { ctLogError } from '@/lib/logger';
import { getCatalogFilters } from '@/db/queries/catalog';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sourceKey = url.searchParams.get('source_key') ?? 'norske_sedler';
  const objectGroup = url.searchParams.get('object_group') ?? 'banknote';
  try {
    const filters = await getCatalogFilters(sourceKey, objectGroup);
    return ctOk(filters, { source_key: sourceKey, object_group: objectGroup });
  } catch (error) {
    ctLogError('api.catalog.filter', error);
    return ctFail('CATALOG_FILTER_FAILED', 'Kunne ikke hente katalogfilter.', 500);
  }
}
