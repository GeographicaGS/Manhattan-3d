import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as mapstyle from '../../assets/mapstyle/style.json';
import { DataService } from '../data.service';

declare const cartodb: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild('mapContainer') mapContainer;
  map: any;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }


  private initMap() {
    const _mapstyle = JSON.parse(JSON.stringify(mapstyle));
    _mapstyle['sprite'] = window.location.origin + mapstyle['sprite'];
    _mapstyle['sources']['openmaptiles']['url'] = window.location.origin + mapstyle['sources']['openmaptiles']['url'];
    mapboxgl.accessToken = 'pk.eyJ1IjoicGFkYXdhbm5uIiwiYSI6ImNqM2Q0aXQ1YjAwMWYyd3FvZWFtNWhzcWkifQ.RoQyI1QgQHNeztjjCnNIwg';
    this.map = new mapboxgl.Map({
        container: this.mapContainer.nativeElement,
        style: _mapstyle,
        center: [-74.000271, 40.7191704],
        zoom: 14,
        pitch: 60
    });

    this.map.on('load', () => {
      // this.dataService.getBuilds().subscribe(data => {
      //   debugger;
      // });

      const layerData = {
      user_name: 'cayetano',
      sublayers: [{
        sql: `SELECT the_geom_webmercator,cartodb_id,numfloors * 4 as height,yearbuilt, address
        FROM cayetano.mnmappluto where not landuse IN ('09','07')`,
        cartocss: '{}'
      }],
      maps_api_template: 'https://cayetano.carto.com' // Optional
    };
    cartodb.Tiles.getTiles(layerData, (result, error) => {
      if (result == null) {
        return;
      }
      const tiles = result.tiles.map((tileUrl) => {
        return tileUrl
            .replace('{s}', 'a')
            .replace(/\.png/, '.mvt');
      });
      this.map.addSource('buildings_source', { type: 'vector', tiles: tiles });
      this.map.addLayer({
        id: 'buildings',
        // type: 'line',
        'type': 'fill-extrusion',
        'source': 'buildings_source',
        'source-layer': 'layer0',
        'paint': {
          'fill-extrusion-height': {
            'property': 'height',
            'type': 'identity'
          },
          // 'fill-extrusion-color': 'navajowhite',
          'fill-extrusion-color': {
            'property': 'yearbuilt',
            'type': 'exponential',
            'stops': [
              [1940, '#ffffcc'] , [1960, '#c2e699'] , [1980, '#78c679'] , [2000, '#31a354'] , [2020, '#006837']
            ]
          },
           'fill-extrusion-opacity': 0.5
        }
      });

    });

    });
  }

}
