import { ctOk } from '@/lib/response';

export async function GET(request: Request) {
  const url = new URL(request.url);
  return ctOk([], {
    source_key: url.searchParams.get('source_key'),
    object_group: url.searchParams.get('object_group'),
    object_id: url.searchParams.get('object_id'),
    note: 'Endpoint scaffold. Koble mot riktig ct_v_catalog_* view.'
  });
}
