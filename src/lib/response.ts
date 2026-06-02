import { NextResponse } from 'next/server';

export function ctOk<T>(data: T, meta: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: true, data, meta });
}

export function ctFail(code: string, message: string, status = 400, details: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, error: { code, message, details } }, { status });
}
