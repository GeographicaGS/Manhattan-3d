DROP TABLE IF EXISTS manhattan_pluto_09_17;

CREATE TABLE manhattan_pluto_09_17 As
(
  (
    SELECT
        the_geom, numfloors * 4 as  height, address,
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
        the_geom, numfloors * 4 as  height, address,
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
        the_geom, numfloors * 4 as  height, address,
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
        the_geom, numfloors * 4 as  height, address,
        yearbuilt, assesstot / bldgarea as assess_val_norm,
        2014::integer as pub_date
    FROM mnmappluto2014
    WHERE NOT landuse IN ('09','07')
      AND (bldgarea IS NOT NULL AND bldgarea > 0)
      AND (assesstot IS NOT NULL)
      AND (yearbuilt IS NOT NULL AND yearbuilt > 0)
  )
  UNION ALL
  (
    SELECT
        the_geom, numfloors * 4 as  height, address,
        yearbuilt, assesstot / bldgarea as assess_val_norm,
        2013::integer as pub_date
    FROM mnmappluto2013
    WHERE NOT landuse IN ('09','07')
      AND (bldgarea IS NOT NULL AND bldgarea > 0)
      AND (assesstot IS NOT NULL)
      AND (yearbuilt IS NOT NULL AND yearbuilt > 0)
  )
  UNION ALL
  (
    SELECT
        the_geom, numfloors * 4 as  height, address,
        yearbuilt, assesstot / bldgarea as assess_val_norm,
        2012::integer as pub_date
    FROM mnmappluto2012
    WHERE NOT landuse IN ('09','07')
      AND (bldgarea IS NOT NULL AND bldgarea > 0)
      AND (assesstot IS NOT NULL)
      AND (yearbuilt IS NOT NULL AND yearbuilt > 0)
  )
  UNION ALL
  (
    SELECT
        the_geom, numfloors * 4 as  height, address,
        yearbuilt, assesstot / bldgarea as assess_val_norm,
        2011::integer as pub_date
    FROM mnmappluto2011
    WHERE NOT landuse IN ('09','07')
      AND (bldgarea IS NOT NULL AND bldgarea > 0)
      AND (assesstot IS NOT NULL)
      AND (yearbuilt IS NOT NULL AND yearbuilt > 0)
  )
  UNION ALL
  (
    SELECT
        the_geom, numfloors * 4 as  height, address,
        yearbuilt, assesstot / bldgarea as assess_val_norm,
        2010::integer as pub_date
    FROM mnmappluto2010
    WHERE NOT landuse IN ('09','07')
      AND (bldgarea IS NOT NULL AND bldgarea > 0)
      AND (assesstot IS NOT NULL)
      AND (yearbuilt IS NOT NULL AND yearbuilt > 0)
  )
  UNION ALL
  (
    SELECT
        the_geom, numfloors * 4 as  height, address,
        yearbuilt, assesstot / bldgarea as assess_val_norm,
        2009::integer as pub_date
    FROM mnmappluto2009
    WHERE NOT landuse IN ('09','07')
      AND (bldgarea IS NOT NULL AND bldgarea > 0)
      AND (assesstot IS NOT NULL)
      AND (yearbuilt IS NOT NULL AND yearbuilt > 0)
  )
);

SELECT CDB_CartodbfyTable('cayetano', 'manhattan_pluto_09_17');

DROP INDEX mn_pluto14_17_yearb_idx;
CREATE INDEX mn_pluto14_17_yearb_idx ON manhattan_pluto_09_17(yearbuilt);
