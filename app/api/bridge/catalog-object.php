<?php
/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Catalog object bridge endpoint
 *
 * Definering / formål:
 * Returnerer ett eksakt katalogobjekt fra MariaDB. Objektoppslaget bruker
 * source_key + object_group + katalognummer + overskrift/tittel + variantutgave
 * når disse finnes, slik at katalognummer ikke forveksles med intern object_id.
 *
 * Bruksområde:
 * Brukes av Next.js objektpresentasjon:
 * /objekt/[sourceKey]/[objectGroup]/[objectIdOrCatalogNumber]
 *
 * Berørte sider/routes:
 * - /objekt/[sourceKey]/[objectGroup]/[objectId]
 * - /katalog når bruker klikker Vis detaljer / Se objektkort
 *
 * Berørte DB-brytere/feature_keys:
 * - catalog.object.open
 * - object.presentation.view
 *
 * Berørte tabeller/views:
 * - ct_v_catalog_objects_resolved
 *
 * Dataretning:
 * Next.js -> HTTPS bridge -> PHP -> MariaDB -> JSON
 *
 * Logging:
 * log_category: catalog
 * log_action: object.open
 *
 * Versjon:
 * CT-BRIDGE-CATALOG-OBJECT-0002
 *
 * Endringsregel:
 * Objektoppslag skal ikke bruke fritekstsøk.
 * Objekt skal være source/object_group-scoped og identifiseres med katalognummer,
 * tittel og variantutgave når dette finnes.
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

/**
 * ------------------------------------------------------------
 * 1. Input
 * ------------------------------------------------------------
 */

$sourceKey = trim((string) ($_GET['source_key'] ?? ''));
$objectGroup = trim((string) ($_GET['object_group'] ?? ''));

$objectId = trim((string) ($_GET['object_id'] ?? ''));
$catalogNumber = trim((string) ($_GET['catalog_number'] ?? $_GET['source_catalog_number'] ?? ''));
$title = trim((string) ($_GET['title'] ?? $_GET['object_title'] ?? $_GET['frontend_title'] ?? ''));
$denominationIssue = trim((string) ($_GET['denomination_issue'] ?? $_GET['variant_issue'] ?? ''));
$variant = trim((string) ($_GET['variant'] ?? $_GET['variant_type'] ?? ''));

if ($sourceKey === '' || $objectGroup === '') {
    ct_bridge_json_error(
        'MISSING_OBJECT_SCOPE',
        'Mangler source_key eller object_group.',
        400,
        [
            'required' => [
                'source_key',
                'object_group',
            ],
        ]
    );
}

if ($objectId === '' && $catalogNumber === '' && $title === '') {
    ct_bridge_json_error(
        'MISSING_OBJECT_IDENTIFIER',
        'Mangler object_id eller katalognummer/tittel.',
        400,
        [
            'required_one_of' => [
                'object_id',
                'catalog_number + title',
            ],
        ]
    );
}

if (!preg_match('/^[A-Za-z0-9_\-]+$/', $sourceKey)) {
    ct_bridge_json_error(
        'INVALID_SOURCE_KEY',
        'source_key har ugyldig format.',
        400,
        ['source_key' => $sourceKey]
    );
}

if (!preg_match('/^[A-Za-z0-9_\-]+$/', $objectGroup)) {
    ct_bridge_json_error(
        'INVALID_OBJECT_GROUP',
        'object_group har ugyldig format.',
        400,
        ['object_group' => $objectGroup]
    );
}

if ($objectId !== '' && !preg_match('/^[A-Za-z0-9_\-:.]+$/', $objectId)) {
    ct_bridge_json_error(
        'INVALID_OBJECT_ID',
        'object_id har ugyldig format.',
        400,
        ['object_id' => $objectId]
    );
}

/**
 * ------------------------------------------------------------
 * 2. Hjelpere
 * ------------------------------------------------------------
 */

function ct_catalog_object_response(
    array $object,
    array $meta
): void {
    ct_bridge_json([
        'ok' => true,
        'source' => 'mariadb',
        'route' => '/app/api/bridge/catalog-object.php',
        'data' => $object,
        'error' => null,
        'errors' => [],
        'meta' => array_merge([
            'read_view' => 'ct_v_catalog_objects_resolved',
            'feature_key' => 'catalog.object.open',
            'generated_at' => date(DATE_ATOM),
        ], $meta),
    ]);
}

function ct_fetch_one(PDO $pdo, string $sql, array $params): ?array
{
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $row = $stmt->fetch();

    return is_array($row) ? $row : null;
}

/**
 * ------------------------------------------------------------
 * 3. Objektoppslag
 * ------------------------------------------------------------
 */

try {
    $pdo = ct_bridge_pdo($ctConfig);

    /**
     * 3A. Beste oppslag:
     * source_key + object_group + katalognummer + tittel + variant/valørutgave.
     *
     * Dette hindrer at katalognummer 12 tolkes som intern object_id 12.
     */
    if ($catalogNumber !== '' && $title !== '') {
        $sql = "
            SELECT *
            FROM ct_v_catalog_objects_resolved
            WHERE source_key = :source_key
              AND object_group = :object_group
              AND CAST(source_catalog_number AS CHAR) = :catalog_number
              AND (
                    title_no = :title_exact
                 OR frontend_title = :title_exact
                 OR object_title_no = :title_exact
              )
        ";

        $params = [
            'source_key' => $sourceKey,
            'object_group' => $objectGroup,
            'catalog_number' => $catalogNumber,
            'title_exact' => $title,
        ];

        if ($denominationIssue !== '') {
            $sql .= "
              AND (
                    denomination_issue = :denomination_issue
                 OR denomination_issue_raw_no = :denomination_issue
                 OR edition = :denomination_issue
                 OR edition_period = :denomination_issue
              )
            ";
            $params['denomination_issue'] = $denominationIssue;
        }

        if ($variant !== '') {
            $sql .= "
              AND (
                    variant = :variant
                 OR variant_raw_no = :variant
                 OR variant_type_raw_no = :variant
              )
            ";
            $params['variant'] = $variant;
        }

        $sql .= " LIMIT 1";

        $object = ct_fetch_one($pdo, $sql, $params);

        if ($object) {
            ct_catalog_object_response($object, [
                'lookup_mode' => 'catalog_number_title_variant',
                'source_key' => $sourceKey,
                'object_group' => $objectGroup,
                'catalog_number' => $catalogNumber,
                'title' => $title,
                'denomination_issue' => $denominationIssue,
                'variant' => $variant,
                'resolved_object_id' => $object['object_id'] ?? null,
            ]);
        }
    }

    /**
     * 3B. Nest beste:
     * source_key + object_group + katalognummer + tittel.
     */
    if ($catalogNumber !== '' && $title !== '') {
        $sql = "
            SELECT *
            FROM ct_v_catalog_objects_resolved
            WHERE source_key = :source_key
              AND object_group = :object_group
              AND CAST(source_catalog_number AS CHAR) = :catalog_number
              AND (
                    title_no = :title_exact
                 OR frontend_title = :title_exact
                 OR object_title_no = :title_exact
              )
            LIMIT 1
        ";

        $object = ct_fetch_one($pdo, $sql, [
            'source_key' => $sourceKey,
            'object_group' => $objectGroup,
            'catalog_number' => $catalogNumber,
            'title_exact' => $title,
        ]);

        if ($object) {
            ct_catalog_object_response($object, [
                'lookup_mode' => 'catalog_number_title',
                'source_key' => $sourceKey,
                'object_group' => $objectGroup,
                'catalog_number' => $catalogNumber,
                'title' => $title,
                'resolved_object_id' => $object['object_id'] ?? null,
            ]);
        }
    }

    /**
     * 3C. Fallback:
     * intern object_id, men bare når katalognummer/tittel ikke traff.
     */
    if ($objectId !== '') {
        $sql = "
            SELECT *
            FROM ct_v_catalog_objects_resolved
            WHERE source_key = :source_key
              AND object_group = :object_group
              AND CAST(object_id AS CHAR) = :object_id
            LIMIT 1
        ";

        $object = ct_fetch_one($pdo, $sql, [
            'source_key' => $sourceKey,
            'object_group' => $objectGroup,
            'object_id' => $objectId,
        ]);

        if ($object) {
            ct_catalog_object_response($object, [
                'lookup_mode' => 'object_id_fallback',
                'source_key' => $sourceKey,
                'object_group' => $objectGroup,
                'object_id' => $objectId,
                'catalog_number' => $catalogNumber,
                'title' => $title,
                'resolved_object_id' => $object['object_id'] ?? null,
            ]);
        }
    }

    ct_bridge_json([
        'ok' => false,
        'source' => 'mariadb',
        'route' => '/app/api/bridge/catalog-object.php',
        'data' => null,
        'error' => [
            'code' => 'OBJECT_NOT_FOUND',
            'message' => 'Objektet finnes ikke for valgt source_key, object_group, katalognummer, tittel og variant.',
        ],
        'errors' => [
            [
                'code' => 'OBJECT_NOT_FOUND',
                'message' => 'Objektet finnes ikke for valgt source_key, object_group, katalognummer, tittel og variant.',
            ],
        ],
        'meta' => [
            'source_key' => $sourceKey,
            'object_group' => $objectGroup,
            'object_id' => $objectId,
            'catalog_number' => $catalogNumber,
            'title' => $title,
            'denomination_issue' => $denominationIssue,
            'variant' => $variant,
            'read_view' => 'ct_v_catalog_objects_resolved',
        ],
    ], 404);
} catch (Throwable $e) {
    ct_bridge_json_error(
        'CATALOG_OBJECT_BRIDGE_FAILED',
        $e->getMessage(),
        500,
        [
            'source_key' => $sourceKey,
            'object_group' => $objectGroup,
            'object_id' => $objectId,
            'catalog_number' => $catalogNumber,
            'title' => $title,
            'denomination_issue' => $denominationIssue,
            'variant' => $variant,
            'read_view' => 'ct_v_catalog_objects_resolved',
        ]
    );
}