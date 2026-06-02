export async function collectiumApiGet<T = unknown>(
  path: string,
  fallback?: T
): Promise<T> {
  return fallback as T;
}
