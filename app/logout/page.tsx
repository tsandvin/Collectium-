"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    async function runLogout() {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } finally {
        window.location.href = "/login";
      }
    }

    runLogout();
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#ffffff", color: "#061827", padding: "32px" }}>
      <p style={{ margin: "0 0 12px", fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Collectium
      </p>
      <h1 style={{ margin: "0 0 12px", fontSize: "32px" }}>Logger ut</h1>
      <p>Du sendes tilbake til innlogging.</p>
    </main>
  );
}
