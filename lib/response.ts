/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * lib/response
 *
 * Definering / formål:
 * Standard JSON-respons for Collectium API-ruter.
 * Støtter både ny og eldre ctFail-signatur:
 * - ctFail(message, status, errors, meta)
 * - ctFail(errorCode, message, status)
 *
 * Berørte API-ruter:
 * - /api/catalog/*
 * - /api/admin/*
 *
 * Dataretning:
 * API/backend -> JSON response
 */

import { NextResponse } from "next/server";

type CtResponseMeta = Record<string, unknown>;

export function ctOk<TData = unknown>(data: TData, meta: CtResponseMeta = {}) {
  return NextResponse.json({
    ok: true,
    source: "collectium-api",
    data,
    meta,
    errors: [],
  });
}

export function ctFail(
  codeOrMessage = "Collectium API error",
  messageOrStatus: string | number = 500,
  statusOrErrors: number | unknown[] = [],
  meta: CtResponseMeta = {}
) {
  let errorCode = "COLLECTIUM_API_ERROR";
  let message = "Collectium API error";
  let status = 500;
  let errors: unknown[] = [];

  if (typeof messageOrStatus === "string") {
    // Legacy/current route usage:
    // ctFail(errorCode, message, status)
    errorCode = codeOrMessage;
    message = messageOrStatus;
    status = typeof statusOrErrors === "number" ? statusOrErrors : 500;
    errors = Array.isArray(statusOrErrors) ? statusOrErrors : [];
  } else {
    // Fallback/new usage:
    // ctFail(message, status, errors, meta)
    message = codeOrMessage;
    status = messageOrStatus;
    errors = Array.isArray(statusOrErrors) ? statusOrErrors : [];
  }

  return NextResponse.json(
    {
      ok: false,
      source: "collectium-api",
      error_code: errorCode,
      message,
      data: null,
      meta,
      errors,
    },
    { status }
  );
}
