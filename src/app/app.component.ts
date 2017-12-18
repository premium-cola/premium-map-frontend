import { Component } from '@angular/core';

import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private map: L.Map;
  private defaultHomePosition: L.LatLng = L.latLng(50.93766174471314, 9.777832031250002);
  private defaultZoomLevel: number = 7;

  ngOnInit() {
    this.map = L.map('map', {
      maxZoom: 19
    });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.centerPositionOnMap();
  }

  /**
   * Sets the current position to the center of the map
   */
  private centerPositionOnMap() {
    var lastCurrentPosition: Position = JSON.parse(localStorage.getItem('lastCurrentPosition'));

    // Checks if the last saved position is no older than 30 minutes
    if(lastCurrentPosition && ((Math.floor((new Date()).getTime() / 1000) - lastCurrentPosition.timestamp) <= 1800)) {
      this.map.setView(L.latLng(lastCurrentPosition.coords.latitude, lastCurrentPosition.coords.longitude), 14);
    } else {
      this.map.setView(this.defaultHomePosition, this.defaultZoomLevel);      
    }

    navigator.geolocation.getCurrentPosition((position: Position) => {
      localStorage.setItem('lastCurrentPosition', JSON.stringify({coords: { latitude: position.coords.latitude, longitude: position.coords.longitude}, timestamp: position.timestamp}));
      this.map.setView(L.latLng(position.coords.latitude, position.coords.longitude), 14);
    })
  }

}
