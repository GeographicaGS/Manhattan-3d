DROP TABLE IF EXISTS manhatan_pluto_14_17;

CREATE TABLE manhatan_pluto_14_17 As
(
  (
    SELECT
        the_geom, numfloors * 4 as height,
        yearbuilt, assesstot / bldgarea as assess_val_norm,
        2017::integer as pub_date
    FROM mnmappluto2017
    WHERE NOT landuse IN ('09','07')
      AND (bldgarea IS NOT NULL AND bldgarea > 0)
      AND (assesstot IS NOT NULL)
      AND (yearbuilt IS NOT NULL AND yearbuilt > 0)
  )
  UNION ALL
  (
    SELECT
        the_geom, numfloors * 4 as height,
        yearbuilt, assesstot / bldgarea as assess_val_norm,
        2016::integer as pub_date
    FROM mnmappluto2016
    WHERE NOT landuse IN ('09','07')
      AND (bldgarea IS NOT NULL AND bldgarea > 0)
      AND (assesstot IS NOT NULL)
      AND (yearbuilt IS NOT NULL AND yearbuilt > 0)
  )
  UNION ALL
  (
    SELECT
        the_geom, numfloors * 4 as height,
        yearbuilt, assesstot / bldgarea as assess_val_norm,
        2015::integer as pub_date
    FROM mnmappluto2015
    WHERE NOT landuse IN ('09','07')
      AND (bldgarea IS NOT NULL AND bldgarea > 0)
      AND (assesstot IS NOT NULL)
      AND (yearbuilt IS NOT NULL AND yearbuilt > 0)
  )
  UNION ALL
  (
    SELECT
        the_geom, numfloors * 4 as height,
        yearbuilt, assesstot / bldgarea as assess_val_norm,
        2014::integer as pub_date
    FROM mnmappluto2014
    WHERE NOT landuse IN ('09','07')
      AND (bldgarea IS NOT NULL AND bldgarea > 0)
      AND (assesstot IS NOT NULL)
      AND (yearbuilt IS NOT NULL AND yearbuilt > 0)
  )
);

SELECT CDB_CartodbfyTable('cayetano', 'manhatan_pluto_14_17');

CREATE INDEX mn_pluto14_17_yearb_idx ON manhatan_pluto_14_17(yearbuilt);
