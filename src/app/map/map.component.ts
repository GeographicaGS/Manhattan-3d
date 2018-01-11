import { Component, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as positronMapstyle from '../../assets/mapstyle/positron/style.json';
import * as darkmatterMapstyle from '../../assets/mapstyle/darkmatter/style.json';
import { formatNumber } from '../utils';

declare const cartodb: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild('mapContainer') mapContainer;
  interval: any;
  map: any;
  config = {
    year_built: {
      title: 'Year built',
      subtitle: 'The year construction of the building was completed.',
      property: 'yearbuilt',
      positron: {
        stops: [[1940, '#EA7C81'] , [1960, '#F4B0A4'] , [1980, '#FFE4C7'] , [2000, '#B3CCB2'] , [2020, '#B3CCB2']]
      },
      darkmatter: {
        stops: [[1940, '#f26078'] , [1960, '#ef957c'] , [1980, '#ecca80'] , [2000, '#98d392'] , [2020, '#43dca3']]
      },
      legend: [
        {title: '< 1940', filter: ['>', 'yearbuilt', 1940], active: true},
        {title: '1940 - 1960', filter: ['any', ['<', 'yearbuilt', 1940], ['>', 'yearbuilt', 1960]], active: true},
        {title: '1960 - 1980', filter: ['any', ['<', 'yearbuilt', 1960], ['>', 'yearbuilt', 1980]], active: true},
        {title: '1980 - 2000', filter: ['any', ['<', 'yearbuilt', 1980], ['>', 'yearbuilt', 2000]], active: true},
        {title: '> 2000', filter: ['<', 'yearbuilt', 2000], active: true}
      ]
    },
    assesed_value: {
      title: 'Assesed value',
      subtitle: 'Tentative assessed total value for Fiscal Year per total building area.',
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
      },
      legend: [
        {title: '< $50 per sq ft', filter: ['>', 'assess_val_norm', 50], active: true},
        {title: '$50 - $100 per sq ft', filter: ['any', ['<', 'assess_val_norm', 50], ['>', 'assess_val_norm', 100]], active: true},
        {title: '$100 - $150 per sq ft', filter: ['any', ['<', 'assess_val_norm', 100], ['>', 'assess_val_norm', 150]], active: true},
        {title: '$150 - $200 per sq ft', filter: ['any', ['<', 'assess_val_norm', 150], ['>', 'assess_val_norm', 200]], active: true},
        {title: '> $200 per sq ft', filter: ['<', 'assess_val_norm', 200], active: true}
      ]
    }
  };

  currentBaseMap = 'darkmatter';
  currentConfig = this.config['year_built'];
  currentYear = 2017;
  marker: any;

  @HostListener('click')
  onClick() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

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
    this.setMapStyle(darkmatterMapstyle);
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    this.map.on('load', () => {

    let bearing = 0;
    this.interval = setInterval(() => {
      this.map.flyTo({bearing: bearing});
      bearing += 0.15;
      if (bearing > 360) {
        bearing = 0;
      }
    }, 200);
    this.map.on('drag', () => {
      clearInterval(this.interval);
    });
    this.map.on('zoom', () => {
      clearInterval(this.interval);
    });

    const el = document.createElement('div');
    el.className = 'marker';
    this.marker = new mapboxgl.Marker(el).setLngLat([0, 0]).addTo(this.map);

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
    const layers = this.map.getStyle().layers;
    const mapstyle = value === 'moon' ? darkmatterMapstyle : positronMapstyle;
    for (const l of layers) {
      const newLayer = mapstyle['layers'].find(_layer => _layer.id === l.id );
      if (newLayer && l.id !== 'buildings') {
        l.type = newLayer.type;
        for (const key in l.paint) {
          if (l.paint[key]) {
            const type = Object.prototype.toString.call(this.map.getPaintProperty(l.id, key));
            if (type === '[object String]') {
              this.map.setPaintProperty(l.id, key, 'transparent');
            }else if (type === '[object Boolean]') {
              this.map.setPaintProperty(l.id, key, false);
            }else if (type === '[object Object]') {
              this.map.setPaintProperty(l.id, key, null);
            }else if (type !== '[object Array]') {
              this.map.setPaintProperty(l.id, key, 0);
            }
          }
        }
        for (const key in newLayer.paint) {
          if (newLayer.paint[key]) {
            this.map.setPaintProperty(l.id, key, newLayer.paint[key]);
          }
        }
      }
    }
  }

  loadBuildingsLayer() {
    const layerData = {
      user_name: 'cayetano',
      sublayers: [{
        sql: `SELECT the_geom_webmercator,cartodb_id,height,yearbuilt, assess_val_norm, address
        FROM cayetano.manhattan_pluto_09_17 WHERE pub_date=${this.currentYear}`,
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
      this.filterByLegend();
      this.map.on('mouseover', 'buildings', (e) => {
        this.map.getCanvas().style.cursor = 'pointer';
        this.marker.setLngLat(e.lngLat);
        const property = e.features[0].properties[this.currentConfig.property];
        const color = this.currentConfig[this.currentBaseMap].stops.find(s => s[0] >= property)[1];
        document.getElementsByClassName('marker')[0].innerHTML = `
          <div>
            <h3>${e.features[0].properties.address}</h3>
            <h4 style="color:${color};">${formatNumber(property)}</h4>
          </div>
        `;
      });
      this.map.on('mouseleave', 'buildings', (e) => {
        this.map.getCanvas().style.cursor = '';
        this.marker.setLngLat([0, 0]);
      });
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

    this.map.setFilter('buildings', null);
    this.currentConfig.legend.filter(l => !l.active).map(l => l.active = true);

    this.currentConfig = this.config[selector];
    this.setLayerPaintProperties();
  }

  yearChange(year) {
    this.currentYear = year;
    this.map.removeLayer('buildings');
    this.map.removeSource('buildings_source');
    this.loadBuildingsLayer();
  }

  filterByLegend(elem = null) {
    if (elem) {
      elem.active = !elem.active;
    }
    const filterList: Array<any> = this.currentConfig.legend.filter(l => !l.active).map(l => l.filter);
    filterList.unshift('all');
    this.map.setFilter('buildings', filterList);
  }

}
