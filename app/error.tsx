"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <main style={{padding:40}}><h1>Collectium-feil</h1><p>{error.message}</p><button onClick={reset}>Prøv igjen</button></main>;
}
