# Data

## Buiding datasets

1) Load datasets in data/geodata to Carto.

2) Load an execute this function in Carto:

```sql
SELECT mnh3d_prepare_pluto_datasets(
  2009, 2017, 'cayetano', ARRAY['07', '09']
);
```

3) Generated Carto table must be public (```manhattan_pluto_09_17```).

## Data source

Datasets in data/geodata are Manhattan subsets from PLUTO Data:

https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-pluto-mappluto.page

NYC Department of City Planning
