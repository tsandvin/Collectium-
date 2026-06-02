import { ctFail } from '@/lib/response';

export async function POST() {
  return ctFail('REGISTER_NOT_IMPLEMENTED', 'Registrering er opprettet, men må kobles til ct_users og medlemskap.', 501);
}
