import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PopUpService } from './pop-up.service';

import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  private capitals = '/assets/data/usa-capitals.geojson';

  constructor(
    private http: HttpClient,
    private popupService: PopUpService) {
  }

  makeCapitalMarkers(map: L.map, stateFilter: string): void {
    this.http.get(this.capitals).subscribe((res: any) => {
      const featureFound = res.features.find(
        feature => stateFilter === feature.properties.state
      );
      if (featureFound) {
        this.makePopup(featureFound, map);
      }
    });
  }

  private makePopup(c: any, map: any) {
    L.marker([c.geometry.coordinates[1], c.geometry.coordinates[0]])
      .bindPopup(this.popupService.makePopupWithTitle(c.properties.name, 'Capital'))
      .addTo(map);
  }

  makeCapitalCircleMarkers(map: L.map): void {
    this.http.get(this.capitals).subscribe((res: any) => {
      for (const c of res.features) {
        const lat = c.geometry.coordinates[0];
        const lon = c.geometry.coordinates[1];
        L.circleMarker([lon, lat], {
          stroke: true,
          weight: 1,
          radius: 10
        })
        .bindTooltip(this.popupService.makePopupWithTitle(c.properties.name, 'Capital'))
        .addTo(map);
      }
    });
  }

}
