/*
* Function to prepare and build PLUTO datasets.
*
*/

--------------------------------------------------------------------------------
-- HOW TO USE:
--    SELECT mnh3d_prepare_pluto_datasets(
--      2009, 2012, 'cayetano', ARRAY['07', '09']
--    );
--------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS mnh3d_prepare_pluto_datasets(integer, integer, text,
  text[], text);

CREATE OR REPLACE FUNCTION mnh3d_prepare_pluto_datasets(
    year_min integer,
    year_max integer,
    carto_user text,
    excl_landuses text[],
    table_name text DEFAULT 'mnmappluto'
  )
  RETURNS void AS
  $$
DECLARE
  _tb_name text;
  _year record;
  _yr_qry text;
  _yrs_qry text;
  _fn_qry text;
BEGIN

  _tb_name = format('manhattan_pluto_%s_%s',
    substring(year_min::text from '..$'),
    substring(year_max::text from '..$')
  );

  FOR _year IN year_min .. year_max
    LOOP
      _yr_qry = format('
        (
          SELECT
              the_geom, numfloors * 4 as height, address,
              yearbuilt, assesstot / bldgarea as assess_val_norm,
              %2$s::integer as pub_date
          FROM %1$s%2$s
          WHERE NOT landuse = ANY( %3$L )
            AND (bldgarea IS NOT NULL AND bldgarea > 0)
            AND (assesstot IS NOT NULL)
            AND (yearbuilt IS NOT NULL AND yearbuilt > 0)
        )', table_name, _year, excl_landuses);

        IF _year < year_max then
          _yr_qry = format('%s UNION ALL', _yr_qry);
        END IF;

        _yrs_qry = format('%s %s', _yrs_qry, _yr_qry);

    END LOOP;

    _fn_qry = format('
      DROP TABLE IF EXISTS %1$I;

      CREATE TABLE %1$I As
      (
        %2$s
      );

      SELECT CDB_CartodbfyTable(%3$L, %1$L);

      DROP INDEX IF EXISTS %1$s_yearb_idx;

      CREATE INDEX %1$s_yearb_idx ON %1$I (yearbuilt);
      ', _tb_name, _yrs_qry, carto_user
      );

    EXECUTE _fn_qry;

END;
$$ LANGUAGE plpgsql;
