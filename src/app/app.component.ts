import { Component } from '@angular/core';
import { SearchService } from './search.service';
import { Subject } from 'rxjs';

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

  // State of the shop types in the top bar
  public shopTypesState = {
    laeden: false,
    haendler: false,
    sprecher: false,
    webshop: false
  }
  private itemList: Array<any>;
  
  public debounceSearchInput: Subject<string> = new Subject();
  public searchResults: Array<any>;

  public legendOpen: boolean = false;
  public imprintOpen: boolean = false;

  constructor(
    private searchService: SearchService,
  ) {}

  async ngOnInit() {
    this.itemList = await this.searchService.itemList(this.enabledShopTypes());

    this.initalizeMap();
    this.centerPositionOnMap();

    this.debounceSearchInput.debounceTime(200).subscribe((searchKeyword: string) => {
      this.search(searchKeyword);
    })
  }

  private initalizeMap() {
    this.map = L.map('map', {
      maxZoom: 19,
      zoomControl: false,
    });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Add zoom control to the bottom left
    L.control.zoom({
      position: 'bottomleft',
    }).addTo(this.map);

    let imprintControl = L.Control.extend({
      options: {
        position: 'bottomright' 
      },
      onAdd: (map) => {
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.width = '30px';
        container.style.height = '30px';
        container.innerText = 'i';
        container.style.fontFamily = 'icomoon';
        container.style.fontSize = '100%';
        container.style.textAlign = 'center';
        container.style.fontWeight = '700';
        container.style.fontSize = '20px';
        container.style.cursor = 'pointer';
        container.onclick = () => {
          this.toggleImprint();
        }
        return container;
      },
    });

    this.map.addControl(new imprintControl());
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

  public async search(searchKeyword: string) {
    let searchResults = await this.searchService.search(searchKeyword);
    this.searchResults = searchResults.json().data.items;
  }

  public toggleFilter(keyword: string) {
    this.shopTypesState[keyword] = !this.shopTypesState[keyword];
  }

  public enabledShopTypes(): Array<string> {
    let enabledShopTypes = [];
    for(let shopType in this.shopTypesState) {
      if(!this.shopTypesState[shopType]) enabledShopTypes.push(shopType);
    }
    return enabledShopTypes;
  }

  public toggleLegend() {
    this.legendOpen = !this.legendOpen;
  }

  public toggleImprint() {
    this.imprintOpen = !this.imprintOpen;
  }
}
