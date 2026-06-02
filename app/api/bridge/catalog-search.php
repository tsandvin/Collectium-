<?php
/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Catalog search bridge endpoint
 *
 * Definering / formål:
 * Returnerer katalogobjekter fra ct_v_catalog_objects_resolved via PHP/API bridge.
 *
 * Bruksområde:
 * Brukes av lokal/ekstern Next.js når direkte MariaDB-port 3306 ikke er tilgjengelig.
 *
 * Berørte sider / routes:
 * - Next.js /katalog
 * - Next.js /api/catalog/search
 * - /app/api/bridge/catalog-search.php
 *
 * Berørte DB-brytere / feature_keys:
 * - catalog.search
 *
 * Berørte tabeller / views:
 * - ct_v_catalog_objects_resolved
 *
 * Dataretning:
 * Next.js -> HTTPS bridge -> PHP -> MariaDB -> JSON
 *
 * Versjon:
 * CT-BRIDGE-CATALOG-SEARCH-0002
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$sourceKey = isset($_GET['source_key']) ? trim((string) $_GET['source_key']) : 'norske_sedler';
$objectGroup = isset($_GET['object_group']) ? trim((string) $_GET['object_group']) : 'banknote';
$q = isset($_GET['q']) ? trim((string) $_GET['q']) : '';

$limitRaw = isset($_GET['limit']) ? (int) $_GET['limit'] : 50;
$limit = max(1, min($limitRaw, 100));

$filterField = isset($_GET['filter_field']) ? trim((string) $_GET['filter_field']) : '';
$filterValue = isset($_GET['filter_value']) ? trim((string) $_GET['filter_value']) : '';

$allowedFilterColumns = [
    'country' => 'country',
    'producer' => 'producer',
    'issuer' => 'issuer',
    'denomination' => 'denomination',
    'variant' => 'variant',
    'litra' => 'litra',
    'ruler' => 'ruler',
    'historical_period' => 'historical_period',
    'material' => 'material',
    'year_label' => 'year_label',
    'value' => 'value_label',
];

try {
    if ($sourceKey === '' || $objectGroup === '') {
        ct_bridge_json_error(
            'BAD_REQUEST',
            'source_key and object_group are required.',
            400
        );
    }

    $pdo = ct_bridge_pdo($ctConfig);

    $sql = "
        SELECT
            object_id,
            source_key,
            object_group,
            source_catalog_number,
            title_no,
            frontend_title,
            country,
            producer,
            issuer,
            denomination,
            variant,
            litra,
            ruler,
            historical_period,
            material,
            year_label,
            market_value_low,
            market_value_high,
            value_label
        FROM ct_v_catalog_objects_resolved
        WHERE source_key = :source_key
          AND object_group = :object_group
    ";

    $params = [
        ':source_key' => $sourceKey,
        ':object_group' => $objectGroup,
    ];

    if ($q !== '') {
        $sql .= "
          AND (
            CAST(object_id AS CHAR) LIKE :q
            OR COALESCE(frontend_title, '') LIKE :q
            OR COALESCE(title_no, '') LIKE :q
            OR COALESCE(source_catalog_number, '') LIKE :q
            OR COALESCE(denomination, '') LIKE :q
            OR COALESCE(variant, '') LIKE :q
            OR COALESCE(litra, '') LIKE :q
            OR COALESCE(ruler, '') LIKE :q
            OR COALESCE(year_label, '') LIKE :q
          )
        ";

        $params[':q'] = '%' . $q . '%';
    }

    if ($filterField !== '' && $filterValue !== '' && isset($allowedFilterColumns[$filterField])) {
        $column = $allowedFilterColumns[$filterField];

        $sql .= "
          AND COALESCE($column, '') = :filter_value
        ";

        $params[':filter_value'] = $filterValue;
    }

    $sql .= "
        ORDER BY object_id ASC
        LIMIT $limit
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    ct_bridge_json([
        'ok' => true,
        'data' => [
            'objects' => $rows,
        ],
        'meta' => [
            'source_key' => $sourceKey,
            'object_group' => $objectGroup,
            'q' => $q,
            'filter_field' => $filterField,
            'filter_value' => $filterValue,
            'limit' => $limit,
            'count' => count($rows),
        ],
        'errors' => [],
    ]);
} catch (Throwable $e) {
    ct_bridge_json_error(
        'CATALOG_SEARCH_BRIDGE_FAILED',
        $e->getMessage(),
        500
    );
}