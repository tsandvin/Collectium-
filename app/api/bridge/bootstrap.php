<?php
/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Collectium API bridge bootstrap
 *
 * Definering / formål:
 * Felles oppstart, CORS, API-nøkkelkontroll, JSON-respons og PDO-kobling
 * for PHP/API-bridge mellom Next.js og MariaDB.
 *
 * Bruksområde:
 * Inkluderes av bridge-endpoints i /app/api/bridge/, for eksempel:
 * - catalog-search.php
 * - ping.php
 * - senere catalog-filter.php, catalog-object.php, admin-status.php
 *
 * Berørte sider / routes:
 * - Next.js /katalog
 * - Next.js /api/catalog/search
 * - /app/api/bridge/catalog-search.php
 *
 * Berørte DB-brytere / feature_keys:
 * - database.connection
 * - catalog.search
 * - catalog.filters
 *
 * Berørte tabeller / views:
 * - MariaDB via endpoint-filene som inkluderer bootstrap.php
 *
 * Dataretning:
 * Next.js -> HTTPS bridge -> PHP -> MariaDB -> JSON
 *
 * Versjon:
 * CT-BRIDGE-BOOTSTRAP-0001
 */

declare(strict_types=1);

/**
 * ------------------------------------------------------------
 * 1. Grunnoppsett
 * ------------------------------------------------------------
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Collectium-Api-Key');
header('Access-Control-Max-Age: 86400');

/**
 * Tillat bare nødvendige origins.
 * Under utvikling kan localhost være med.
 * Senere kan localhost fjernes i produksjon.
 */
$allowedOrigins = [
    'https://www.collectium.no',
    'https://collectium.no',
    'http://localhost:3000',
    'http://localhost:3001',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

/**
 * OPTIONS brukes av browser/preflight.
 */
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/**
 * Ikke vis PHP-feil som HTML til klienten.
 * Feil returneres som JSON via try/catch i endpoint eller ct_bridge_json_error.
 */
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(E_ALL);


/**
 * ------------------------------------------------------------
 * 2. Konfigurasjon
 * ------------------------------------------------------------
 *
 * BYTT api_key og db_password på serveren.
 * API-nøkkelen må være identisk med COLLECTIUM_API_KEY i lokal .env.local.  'db_host' => 'collectiumno01.mysql.domeneshop.no',  'db_host' => 'localhost','db_host' => '127.0.0.1',
 */

$ctConfig = [
    'api_key' => 'Marius2007_Elli1808_Collectium007',

    'db_host' => 'collectiumno01.mysql.domeneshop.no',
    'db_port' => 3306,
    'db_name' => 'collectiumno01',
    'db_user' => 'collectiumno01',
    'db_password' => 'Freiagutten2007?',

    'db_charset' => 'utf8mb4',
];


/**
 * ------------------------------------------------------------
 * 3. JSON helpers
 * ------------------------------------------------------------
 */

function ct_bridge_json(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);

    echo json_encode(
        $payload,
        JSON_UNESCAPED_UNICODE
        | JSON_UNESCAPED_SLASHES
        | JSON_PRETTY_PRINT
    );

    exit;
}

function ct_bridge_json_error(
    string $code,
    string $message,
    int $statusCode = 500,
    array $extra = []
): void {
    ct_bridge_json([
        'ok' => false,
        'data' => null,
        'error' => array_merge([
            'code' => $code,
            'message' => $message,
        ], $extra),
        'errors' => [
            array_merge([
                'code' => $code,
                'message' => $message,
            ], $extra),
        ],
    ], $statusCode);
}


/**
 * ------------------------------------------------------------
 * 4. API-nøkkelkontroll
 * ------------------------------------------------------------
 */

function ct_bridge_get_header(string $name): string
{
    $serverKey = 'HTTP_' . strtoupper(str_replace('-', '_', $name));

    if (isset($_SERVER[$serverKey])) {
        return trim((string) $_SERVER[$serverKey]);
    }

    if (function_exists('getallheaders')) {
        $headers = getallheaders();

        foreach ($headers as $key => $value) {
            if (strtolower((string) $key) === strtolower($name)) {
                return trim((string) $value);
            }
        }
    }

    return '';
}

function ct_bridge_require_api_key(array $ctConfig): void
{
    $expectedKey = (string) ($ctConfig['api_key'] ?? '');
    $providedKey = ct_bridge_get_header('X-Collectium-Api-Key');

    if ($expectedKey === '') {
        ct_bridge_json_error(
            'BRIDGE_CONFIG_ERROR',
            'API-nøkkel mangler i serverens bridge-konfig.',
            500
        );
    }

    if ($providedKey === '' || !hash_equals($expectedKey, $providedKey)) {
        ct_bridge_json_error(
            'ACCESS_DENIED',
            'Ugyldig API-nøkkel.',
            403
        );
    }
}


/**
 * ------------------------------------------------------------
 * 5. PDO / MariaDB
 * ------------------------------------------------------------
 */

function ct_bridge_pdo(array $ctConfig): PDO
{
    $host = (string) $ctConfig['db_host'];
    $port = (int) $ctConfig['db_port'];
    $dbName = (string) $ctConfig['db_name'];
    $charset = (string) ($ctConfig['db_charset'] ?? 'utf8mb4');

    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $host,
        $port,
        $dbName,
        $charset
    );

    return new PDO(
        $dsn,
        (string) $ctConfig['db_user'],
        (string) $ctConfig['db_password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
}


/**
 * ------------------------------------------------------------
 * 6. Standard sikkerhet
 * ------------------------------------------------------------
 *
 * Alle bridge-endpoints som inkluderer bootstrap.php krever API-nøkkel.
 * Hvis du vil ha offentlige testfiler, bruk egne filer som ikke inkluderer
 * bootstrap.php, for eksempel ping.php.
 */

ct_bridge_require_api_key($ctConfig);