<?php
/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Bridge DB debug endpoint
 *
 * Definering / formål:
 * Viser hvilken DB-konfig PHP-bridge faktisk bruker, uten å vise passord.
 *
 * Bruksområde:
 * Midlertidig feilsøking av PHP/API-bridge og MariaDB-tilkobling.
 *
 * Berørte sider / routes:
 * - /app/api/bridge/db-debug.php
 *
 * Berørte DB-brytere / feature_keys:
 * - database.connection
 *
 * Berørte tabeller / views:
 * - Ingen direkte spørring. Viser kun konfig.
 *
 * Versjon:
 * CT-BRIDGE-DB-DEBUG-0001
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/bootstrap.php';

ct_bridge_json([
    'ok' => true,
    'file' => 'db-debug.php',
    'debug' => 'db config loaded',
    'db_host' => $ctConfig['db_host'] ?? null,
    'db_port' => $ctConfig['db_port'] ?? null,
    'db_name' => $ctConfig['db_name'] ?? null,
    'db_user' => $ctConfig['db_user'] ?? null,
    'password_set' => !empty($ctConfig['db_password']),
    'php_version' => PHP_VERSION,
    'time' => date('c'),
]);