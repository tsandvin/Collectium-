USE collectiumno01;

SELECT source_key, object_group, COUNT(*) AS object_count
FROM ct_v_catalog_objects_resolved
GROUP BY source_key, object_group
ORDER BY object_count DESC;

SELECT source_key, object_group, filter_field, COUNT(*) AS value_count
FROM ct_v_catalog_filter_values
WHERE source_key = 'norske_sedler' AND object_group = 'banknote'
GROUP BY source_key, object_group, filter_field
ORDER BY filter_field;
