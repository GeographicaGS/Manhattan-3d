import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as positronMapstyle from '../../assets/mapstyle/positron/style.json';
import * as darkmatterMapstyle from '../../assets/mapstyle/darkmatter/style.json';

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
      subtitle: '',
      property: 'yearbuilt',
      positron: {
        stops: [[1940, '#EA7C81'] , [1960, '#F4B0A4'] , [1980, '#FFE4C7'] , [2000, '#B3CCB2'] , [2020, '#B3CCB2']]
      },
      darkmatter: {
        stops: [[1940, '#f26078'] , [1960, '#ef957c'] , [1980, '#ecca80'] , [2000, '#98d392'] , [2020, '#43dca3']]
      }
    },
    assesed_value: {
      title: 'Assesed value',
      subtitle: '',
      property: 'assess_val_norm',
      positron: {
        stops: [
          [50, '#6FB6C7'],
          [100, '#84C4B3'],
          [150, '#AFDCAE'],
          [200, '#ECDE80'],
          [18209700, '#F2C56E']
        ]
      },
      darkmatter: {
        stops: [
          [50, '#3a92aa'],
          [100, '#60ac98'],
          [150, '#86c685'],
          [200, '#c0c46f'],
          [18209700, '#fcbd40']
        ]
      }
    }
  };

  currentBaseMap = 'positron';
  currentConfig = this.config['year_built'];
  currentYear = 2017;

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }


  private initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoicGFkYXdhbm5uIiwiYSI6ImNqM2Q0aXQ1YjAwMWYyd3FvZWFtNWhzcWkifQ.RoQyI1QgQHNeztjjCnNIwg';
    this.map = new mapboxgl.Map({
        container: this.mapContainer.nativeElement,
        center: [-74.000271, 40.7191704],
        zoom: 14,
        pitch: 60
    });
    this.setMapStyle(positronMapstyle);
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    this.map.on('load', () => {

    this.loadBuildingsLayer();

    this.map.on('style.load', () => {
      this.loadBuildingsLayer();
    });

    });

  }

  setMapStyle(mapstyle) {
    const _mapstyle = JSON.parse(JSON.stringify(mapstyle));
    _mapstyle['sprite'] = window.location.origin + mapstyle['sprite'];
    _mapstyle['sources']['openmaptiles']['url'] = window.location.origin + mapstyle['sources']['openmaptiles']['url'];
    this.map.setStyle(_mapstyle);
  }

  baseMapChanged(value) {
    this.map.style._loaded = false;
    this.currentBaseMap = value === 'moon' ? 'darkmatter' : 'positron';
    this.setMapStyle(value === 'moon' ? darkmatterMapstyle : positronMapstyle);
  }

  loadBuildingsLayer() {
    const layerData = {
      user_name: 'cayetano',
      sublayers: [{
        sql: `SELECT the_geom_webmercator,cartodb_id,height,yearbuilt, assess_val_norm
        FROM cayetano.manhatan_pluto_14_17 WHERE pub_date=${this.currentYear}`,
        cartocss: '{}'
      }],
      maps_api_template: 'https://cayetano.carto.com'
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
      this.setLayerPaintProperties();
      // this.map.on('mouseover', 'buildings', (e) => {
      //   console.log('ENTRO');
      // });
    });
  }

  setLayerPaintProperties() {
    this.map.setPaintProperty('buildings', 'fill-extrusion-color', {
      'property': this.currentConfig.property,
      'type': 'exponential',
      'stops': this.currentConfig[this.currentBaseMap].stops
    });
  }

  thematicChanged(selector) {
    if (this.currentYear !== 2017) {
      this.currentYear = 2017;
      this.yearChange(this.currentYear);
    }
    this.currentConfig = this.config[selector];
    this.setLayerPaintProperties();
  }

  yearChange(year) {
    this.currentYear = year;
    this.map.removeLayer('buildings');
    this.map.removeSource('buildings_source');
    this.loadBuildingsLayer();
  }

}
