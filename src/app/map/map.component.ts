import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as mapstyle from '../../assets/mapstyle/style.json';

declare const cartodb: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild('mapContainer') mapContainer;
  map: any;
  config = {
    year_built: {
      title: 'Year built',
      property: 'yearbuilt',
      stops: [[1940, '#E5E4C7'] , [1960, '#C9DAC1'] , [1980, '#AED0BA'] , [2000, '#92C6B3'] , [2020, '#76BCAD']]
    },
    assesed_value: {
      title: 'Assesed value',
      property: 'assesstot',
      stops: [
        [3285000, '#8297BB'],
        [13497300, '#959DA3'],
        [41744250, '#A8A28B'],
        [123781050, '#BBA873'],
        [3401719200, '#CEAD5B']
      ]
    }
  };

  currentConfig = this.config['year_built'];

  constructor() { }

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

    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    this.map.on('load', () => {
      const layerData = {
      user_name: 'cayetano',
      sublayers: [{
        sql: `SELECT the_geom_webmercator,cartodb_id,numfloors * 4 as height,yearbuilt, assesstot
        FROM cayetano.mnmappluto_red2`,
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
        'type': 'fill-extrusion',
        'source': 'buildings_source',
        'source-layer': 'layer0',
        'paint': {
          'fill-extrusion-height': {
            'property': 'height',
            'type': 'identity'
          },
          'fill-extrusion-opacity': 0.85
        }
      });
      this.setLayerPaintProperties('year_built');
    });

    });
  }

  setLayerPaintProperties(selector) {
    this.currentConfig = this.config[selector];
    this.map.setPaintProperty('buildings', 'fill-extrusion-color', {
      'property': this.config[selector].property,
      'type': 'exponential',
      'stops': this.config[selector].stops
    });
  }

}
