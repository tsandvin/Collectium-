"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Logger inn...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setMessage("Innlogging feilet.");
        return;
      }

      window.location.href = "/";
    } catch {
      setMessage("Kunne ikke kontakte login API.");
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#ffffff", color: "#061827", padding: "32px" }}>
      <section style={{ maxWidth: "420px" }}>
        <p style={{ margin: "0 0 12px", fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Collectium
        </p>

        <h1 style={{ margin: "0 0 16px", fontSize: "34px", lineHeight: 1.1 }}>
          Logg inn
        </h1>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "12px" }}>
            <span style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 700 }}>E-post</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              required
              style={{ width: "100%", minHeight: "40px", border: "1px solid #cbd5df", padding: "0 10px", background: "#ffffff", color: "#061827" }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "16px" }}>
            <span style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 700 }}>Passord</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="current-password"
              required
              style={{ width: "100%", minHeight: "40px", border: "1px solid #cbd5df", padding: "0 10px", background: "#ffffff", color: "#061827" }}
            />
          </label>

          <button type="submit" style={{ minHeight: "40px", border: "1px solid #061827", background: "#061827", color: "#ffffff", padding: "0 16px", fontWeight: 800, cursor: "pointer" }}>
            Logg inn
          </button>
        </form>

        {message ? <p style={{ marginTop: "16px", fontSize: "14px" }}>{message}</p> : null}

        <p style={{ marginTop: "24px", fontSize: "14px" }}>
          <Link href="/" style={{ color: "#061827", textDecoration: "underline" }}>
            Til forsiden
          </Link>
        </p>
      </section>
    </main>
  );
}
