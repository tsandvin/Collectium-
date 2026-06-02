<?php
/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Bridge DB ping endpoint
 *
 * Definering / formål:
 * Tester at PHP/API-bridge kan koble til MariaDB og returnere SELECT 1.
 *
 * Bruksområde:
 * Midlertidig feilsøking av MariaDB-tilkobling fra webhotellet.
 *
 * Berørte sider / routes:
 * - /app/api/bridge/db-ping.php
 *
 * Berørte DB-brytere / feature_keys:
 * - database.connection
 *
 * Berørte tabeller / views:
 * - SELECT 1 AS ping_result
 *
 * Versjon:
 * CT-BRIDGE-DB-PING-0001
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

try {
    require __DIR__ . '/bootstrap.php';

    $pdo = ct_bridge_pdo($ctConfig);
    $stmt = $pdo->query('SELECT 1 AS ping_result');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    ct_bridge_json([
        'ok' => true,
        'file' => 'db-ping.php',
        'db_host' => $ctConfig['db_host'] ?? null,
        'db_port' => $ctConfig['db_port'] ?? null,
        'db_name' => $ctConfig['db_name'] ?? null,
        'db_user' => $ctConfig['db_user'] ?? null,
        'data' => $row,
        'errors' => [],
    ]);
} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        'ok' => false,
        'file' => 'db-ping.php',
        'data' => null,
        'error' => [
            'code' => 'DB_PING_FAILED',
            'message' => $e->getMessage(),
        ],
        'errors' => [
            [
                'code' => 'DB_PING_FAILED',
                'message' => $e->getMessage(),
            ],
        ],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

    exit;
}