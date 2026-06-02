/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * lib/logger
 *
 * Definering / formål:
 * Midlertidig logger for Collectium API-feil.
 * Skal senere kobles til MariaDB/DB 8.4 loggtabeller.
 *
 * Dataretning:
 * API/backend -> logg fallback
 */

export async function ctLogError(context: string, error: unknown) {
  console.error("[Collectium]", context, error);
}
