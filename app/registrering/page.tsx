/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Registration page v13
 *
 * Definering / formål:
 * Offentlig registreringsside for Collectium. Registrering kobles senere mot API og medlemskap.
 *
 * Bruksområde:
 * Route: /registrering
 *
 * Berørte sider / routes:
 * - /registrering
 *
 * Berørte DB-brytere / feature_keys:
 * - auth.register
 * - auth.email.verify
 * - auth.membership.create
 *
 * Berørte API-ruter:
 * - POST /api/auth/register
 * - GET /api/membership/plans
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: auth
 * log_action: register.page_view
 */

import AuthPageClient from "../../components/auth/AuthPageClient";

export default function RegistrationPage() {
  return <AuthPageClient mode="register" />;
}
