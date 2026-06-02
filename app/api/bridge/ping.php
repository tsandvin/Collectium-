<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/bootstrap.php';

try {
    $pdo = ct_bridge_pdo($ctConfig);
    $stmt = $pdo->query('SELECT 1 AS ping_result');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    ct_bridge_json([
        'ok' => true,
        'file' => 'db-ping.php',
        'db_host' => $ctConfig['db_host'],
        'db_name' => $ctConfig['db_name'],
        'db_user' => $ctConfig['db_user'],
        'data' => $row,
    ]);
} catch (Throwable $e) {
    ct_bridge_json_error(
        'DB_PING_FAILED',
        $e->getMessage(),
        500,
        [
            'db_host' => $ctConfig['db_host'] ?? null,
            'db_name' => $ctConfig['db_name'] ?? null,
            'db_user' => $ctConfig['db_user'] ?? null,
        ]
    );
}