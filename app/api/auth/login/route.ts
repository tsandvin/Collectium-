import { ctFail } from '@/lib/response';

export async function POST() {
  return ctFail('AUTH_NOT_IMPLEMENTED', 'Login-rute er opprettet, men må kobles til ct_users og session-logikk.', 501);
}
