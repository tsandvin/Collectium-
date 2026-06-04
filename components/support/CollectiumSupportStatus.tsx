"use client";

import { useState } from "react";
import styles from "./CollectiumSupportStatus.module.css";

const commonIssues = [
  {
    title: "Passord fungerer ikke",
    text: "Bruk passordreset først. Kontroller at e-post er riktig skrevet og at kontoen ikke er låst etter for mange forsøk.",
  },
  {
    title: "Innlogging stopper",
    text: "Sjekk om nettleseren blokkerer cookies, om session er utløpt, eller om brukeren mangler verifisert e-post.",
  },
  {
    title: "Verifikasjon mangler",
    text: "Be om ny verifikasjonslenke. Dersom lenken er eldre enn gyldighetsperioden må den regenereres.",
  },
  {
    title: "Profil låst",
    text: "Profil kan låses ved sikkerhetsvarsel, manglende KYC, adminvedtak eller ufullstendig brukerdata.",
  },
  {
    title: "Katalog viser ikke data",
    text: "Dette kan skyldes midlertidig API-/databasefeil, manglende tilgang i medlemskap eller filter som ikke gir treff.",
  },
];

export default function CollectiumSupportStatus() {
  const [openIssue, setOpenIssue] = useState(0);

  return (
    <section className={styles.supportPage}>
      <div className={styles.headerPanel}>
        <p className={styles.eyebrow}>Collectium support</p>
        <h1>Status for nettsiden og din bruker</h1>
        <p>
          Her samles driftstatus, brukerstatus, typiske feil og direkte melding til admin. Siden skal være fast lenke fra sidemenyen.
        </p>
      </div>

      <div className={styles.statusGrid}>
        <article className={styles.statusCard}>
          <span className={styles.statusOk}>OK</span>
          <h2>Nettside</h2>
          <p>Frontend svarer normalt.</p>
        </article>
        <article className={styles.statusCard}>
          <span className={styles.statusWarn}>Sjekk</span>
          <h2>Katalog/API</h2>
          <p>Vis siste kjente status fra API og database når dette kobles til backend.</p>
        </article>
        <article className={styles.statusCard}>
          <span className={styles.statusOk}>OK</span>
          <h2>Brukerstatus</h2>
          <p>Innlogging, e-post, profil, medlemskap og tilgang vises her.</p>
        </article>
      </div>

      <div className={styles.contentGrid}>
        <section className={styles.issuePanel}>
          <p className={styles.eyebrow}>Typiske problemer</p>
          <h2>Feil og løsninger</h2>
          <div className={styles.issueList}>
            {commonIssues.map((issue, index) => (
              <article className={styles.issueItem} key={issue.title}>
                <button type="button" onClick={() => setOpenIssue(index)}>
                  {issue.title}
                </button>
                {openIssue === index ? <p>{issue.text}</p> : null}
              </article>
            ))}
          </div>
        </section>

        <section className={styles.chatPanel}>
          <p className={styles.eyebrow}>Melding til admin</p>
          <h2>Chat / supportmelding</h2>
          <label>
            Hva gjelder saken?
            <select defaultValue="login">
              <option value="login">Innlogging</option>
              <option value="password">Passord</option>
              <option value="verification">Verifikasjon</option>
              <option value="profile">Profil låst</option>
              <option value="catalog">Katalog/API</option>
            </select>
          </label>
          <label>
            Beskrivelse
            <textarea placeholder="Skriv hva som skjer, og hva du prøvde å gjøre." />
          </label>
          <button type="button">Send til admin</button>
        </section>
      </div>
    </section>
  );
}
