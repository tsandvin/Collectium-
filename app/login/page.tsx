/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Login page v13
 *
 * Definering / formål:
 * Offentlig innloggingsside for Collectium. Selve autentisering kobles senere mot API.
 *
 * Bruksområde:
 * Route: /login
 *
 * Berørte sider / routes:
 * - /login
 *
 * Berørte DB-brytere / feature_keys:
 * - auth.login
 * - auth.session.create
 *
 * Berørte API-ruter:
 * - POST /api/auth/login
 * - GET /api/auth/session
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: auth
 * log_action: login.page_view
 */

import AuthPageClient from "../../components/auth/AuthPageClient";

export default function LoginPage() {
  return <AuthPageClient mode="login" />;
}
