import { ctOk } from '@/lib/response';

export async function POST() {
  return ctOk({ logged_out: true });
}
