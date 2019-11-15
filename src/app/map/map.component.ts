import { AfterViewInit, Component } from '@angular/core';

import { MarkerService } from '../_services/marker.service';
import { ShapeService } from '../_services/shape.service';

import { ShapeConstants } from '../_services/shape.constants';

import * as L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  private map;
  private states;

  selectedState: string;
  randomState: string;
  correctStates = [];

  constructor(
    private markerService: MarkerService,
    private shapeService: ShapeService
    ) {
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.shapeService.getStateShapes().subscribe(states => {
      this.states = states;
      this.initStatesLayer();
      this.randomState = this.generateRandomState();
    });
  }

  private generateRandomState(): string {
    const stateNames: [] = this.states.features.map(
      feature => feature.properties.NAME
    );
    const maxNumStates: number = (stateNames && stateNames.length) || 0;
    const indexState = Math.floor(Math.random() * (maxNumStates));
    return stateNames[indexState];
  }

  private initMap(): void {
    this.map = L.map('map-id', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
  }

  private initStatesLayer() {
    const stateLayer = L.geoJSON(this.states, {
      style: () => (ShapeConstants.DEFAULT_STYLE),
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => e.target.setStyle(ShapeConstants.HIGHLIGHT_STYLE),
          mouseout: (e) => e.target.setStyle(ShapeConstants.DEFAULT_STYLE),
          click: () => (
            this.handleSelectedState(feature)
          )
        })
      ),
    });
    this.map.addLayer(stateLayer);
    stateLayer.bringToBack();
  }

  private handleSelectedState(feature) {
    this.selectedState = feature.properties.NAME;
    if (this.selectedState === this.randomState) {
      this.initStateSelectorTimer();
    }
  }

  private initStateSelectorTimer() {
    setTimeout(
      () => {
        const currentState = this.selectedState;
        const capitalRendered = this.correctStates.find(
          state => currentState === state
        );
        if (!capitalRendered) {
          this.markerService.makeCapitalMarkers(this.map, currentState);
          this.correctStates.push(currentState);
        }
        this.randomState = this.generateRandomState();
        this.selectedState = null;
      },
      2000
    );
  }

  setMyStyles() {
    return {
      color: this.selectedState === this.randomState
        ? 'green'
        : 'red'
    };
  }

}
