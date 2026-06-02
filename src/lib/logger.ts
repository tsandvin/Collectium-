export function ctLogError(scope: string, error: unknown) {
  console.error(`[Collectium:${scope}]`, error);
}
