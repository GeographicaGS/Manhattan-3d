import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  getBuilds() {
    return this.http.get(
      `https://cayetano.carto.com/api/v2/sql/?q=
      SELECT json_agg(data.geojson) as geojson FROM (
        SELECT json_build_object('properties',
          json_build_object(
            'gid', cartodb_id,
            'address', address,
            'numfloors', numfloors,
            'yearbuilt', yearbuilt),
            'geometry', cast(ST_AsGeoJSON (the_geom) AS json)
        ) as geojson FROM mnmappluto
        WHERE NOT landuse IN ('09','07')
      ) data;
      `
    );
  }

}
