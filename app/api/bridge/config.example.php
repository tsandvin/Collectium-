<?php
/**
 * COLLECTIUM FILE HEADER
 * Overskrift: Collectium API bridge config example
 * Definering / formål: Eksempelkonfig for PHP API-bridge mellom Next.js og MariaDB hos Domeneshop.
 * Bruksområde: Kopier til config.php og fyll inn ekte DB-passord på server.
 * Berørte sider/routes: /app/api/bridge/*
 * Berørte DB-brytere/feature_keys: system.database.connect
 * Versjon: CT-BRIDGE-CONFIG-0001
 */

declare(strict_types=1);

return [
    'db_host' => 'collectiumno01.mysql.domeneshop.no',
    'db_port' => 3306,
    'db_name' => 'collectiumno01',
    'db_user' => 'collectiumno01',
    'db_password' => 'SETT_INN_PASSORD_HER',
    'cors_allow_origin' => 'http://localhost:3000',
    'api_key' => 'SETT_INN_LANG_HEMMELIG_API_NOKKEL_HER',
];
