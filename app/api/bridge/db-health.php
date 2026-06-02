<?php
/**
 * COLLECTIUM FILE HEADER
 * Overskrift: DB health bridge endpoint
 * Definering / formål: Tester at PHP på Domeneshop kan lese MariaDB.
 * Bruksområde: Next.js og manuell kontroll av API-bridge.
 * Berørte DB-brytere/feature_keys: system.database.connect
 * Berørte tabeller/views: ct_app_pages
 * Versjon: CT-BRIDGE-HEALTH-0001
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

try {
    $pdo = ct_bridge_pdo($ctConfig);
    $database = $pdo->query('SELECT DATABASE() AS db_name')->fetch();
    $pages = $pdo->query('SELECT COUNT(*) AS count_pages FROM ct_app_pages')->fetch();

    ct_bridge_json([
        'ok' => true,
        'data' => [
            'database' => $database['db_name'] ?? null,
            'ct_app_pages' => (int)($pages['count_pages'] ?? 0),
        ],
    ]);
} catch (Throwable $e) {
    ct_bridge_json(['ok' => false, 'error' => ['code' => 'DB_ERROR', 'message' => $e->getMessage()]], 500);
}
