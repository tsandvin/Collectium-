<?php
/**
 * COLLECTIUM FILE HEADER
 * Overskrift: Catalog filter bridge endpoint
 * Definering / formål: Returnerer source-scoped katalogfilter fra MariaDB via PHP/API.
 * Berørte sider/routes: Next.js /api/catalog/filter og /katalog
 * Berørte DB-brytere/feature_keys: catalog.filters
 * Berørte tabeller/views: ct_v_catalog_filter_values
 * Versjon: CT-BRIDGE-CATALOG-FILTER-0001
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$sourceKey = $_GET['source_key'] ?? 'norske_sedler';
$objectGroup = $_GET['object_group'] ?? 'banknote';

try {
    $pdo = ct_bridge_pdo($ctConfig);
    $stmt = $pdo->prepare("
        SELECT source_key, object_group, filter_field, filter_value, filter_label, object_count
        FROM ct_v_catalog_filter_values
        WHERE source_key = :source_key
          AND object_group = :object_group
        ORDER BY filter_field, filter_label
        LIMIT 500
    ");
    $stmt->execute(['source_key' => $sourceKey, 'object_group' => $objectGroup]);

    ct_bridge_json([
        'ok' => true,
        'data' => $stmt->fetchAll(),
        'meta' => ['source_key' => $sourceKey, 'object_group' => $objectGroup],
    ]);
} catch (Throwable $e) {
    ct_bridge_json(['ok' => false, 'error' => ['code' => 'DB_ERROR', 'message' => $e->getMessage()]], 500);
}
