USE collectiumno01;

SELECT 'ct_app_pages' AS table_name, COUNT(*) AS rows_count FROM ct_app_pages
UNION ALL
SELECT 'ct_app_features', COUNT(*) FROM ct_app_features
UNION ALL
SELECT 'ct_app_page_features', COUNT(*) FROM ct_app_page_features
UNION ALL
SELECT 'ct_feature_access_rules', COUNT(*) FROM ct_feature_access_rules
UNION ALL
SELECT 'ct_feature_action_routes', COUNT(*) FROM ct_feature_action_routes;

SELECT * FROM ct_feature_action_routes ORDER BY feature_key LIMIT 100;
