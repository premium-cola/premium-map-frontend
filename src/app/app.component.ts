import { Component } from '@angular/core';
import { SearchService, SearchResult, Item } from './search.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import * as L from 'leaflet';
import 'leaflet.markercluster';

/**
 * TODO:
 * - Deactivate "zoom on current location" if a manual zoom in/out was triggered
 * - Open Popup if a Marker on the map is clicked
 * - Make top bar responsive
 * - Remember active and inactive filter in localStorage
 * - Filter icon should be visually disabled if the filter itself is disabled
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private map: L.Map;
  private markerClusterGroup: L.MarkerClusterGroup;
  private defaultHomePosition: L.LatLng = L.latLng(50.93766174471314, 9.777832031250002);
  private defaultZoomLevel: number = 7;

  // State of the shop types in the top bar
  public shopTypesState = {
    laeden: false,
    haendler: false,
    sprecher: false,
    webshop: false
  }
  private itemList: any[];
  
  public debounceSearchInput: Subject<string> = new Subject();
  public searchResults: SearchResult[];

  public legendOpen: boolean = false;
  public imprintOpen: boolean = false;

  constructor(
    private searchService: SearchService,
  ) {}

  async ngOnInit() {
    this.initalizeMap();

    this.searchService.itemList(this.enabledShopTypes()).subscribe(itemList => {
      this.itemList = itemList;
      this.updateMarker();
    });

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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Add zoom control to the bottom left
    L.control.zoom({
      position: 'bottomleft',
    }).addTo(this.map);

    // Add imprint control button
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
   * This firstly adds a MarkerClusterGroup where the actual markers are then added.
   * Finally the MarkerClusterGroup is added to the map.
   */
  private async updateMarker() {
    if(this.markerClusterGroup && this.markerClusterGroup.getLayers().length) {
      this.markerClusterGroup.clearLayers();
    }

    this.markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 60,
      polygonOptions: {
        fillColor: '#000',
        color: '#000',
        weight: 4,
        opacity: 0.5,
        fillOpacity: 0.2
      }
    });

    this.itemList.map((item: any[]) => {
      let marker: CustomMarker;
      marker = new CustomMarker(item[0], L.latLng(item[1][0], item[1][1]), {
        icon: L.icon({
          iconUrl: `assets/img/marker/${this.searchService.mapShopTypesToImage(item[2])}`,
          iconSize: [36, 42],
        })
      });

      // TODO: Add loading spinner
      marker.bindPopup((item) => {
        console.log(item);
        return '';
      });

      // TODO: Load content from endpoint
      marker.addEventListener('click', (event: L.LeafletEvent) => {
        let marker: CustomMarker = event.target as CustomMarker;
        this.searchService.itemDetails(marker.getId()).subscribe((item: Item) => {
          console.log(item);
        });
      })

      marker.addTo(this.markerClusterGroup);
    });

    this.markerClusterGroup.addTo(this.map);
  }

  /**
   * Recenters the map to the current position of the user.
   */
  private centerPositionOnMap() {
    var lastCurrentPosition: Position = JSON.parse(localStorage.getItem('lastCurrentPosition'));

    /**
     * Checks if the last saved position is no older than 30 minutes.
     * If it isn't oldet than 30 minutes then the location is used immediately instead of requesting it 
     * through the browser API.
     */
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
    this.searchService.search(searchKeyword).subscribe((searchResults: SearchResult[]) => {
      this.searchResults = searchResults;
    })
  }

  /**
   * Enabled or disabled a specific shop type filter. The more shop type filters are enabled
   * the more specific the results are.
   * 
   * @param keyword A shop type that should be included or excluded from the filter list
   */
  public async toggleFilter(keyword: string) {
    this.shopTypesState[keyword] = !this.shopTypesState[keyword];
    this.searchService.itemList(this.enabledShopTypes()).subscribe(itemList => {
      this.itemList = itemList;
      this.updateMarker();
    });
  }

  /**
   * Returns a list of strings of enabled "shop types" which are essentially categories.
   * 
   * All enabled shop types are shown in the UI as buttons that have a dark text color.
   * Buttons with light text color represents disabled shop types.
   */
  public enabledShopTypes(): Array<string> {
    let enabledShopTypes = [];
    for(let shopType in this.shopTypesState) {
      if(!this.shopTypesState[shopType]) enabledShopTypes.push(shopType);
    }
    return enabledShopTypes;
  }

  /**
   * Show details in a popup windows about a specific shop
   * 
   * @param searchResult detailed information about a shop
   */
  public showDetails(searchResult: SearchResult) {
    console.log(searchResult);
  
  }

  /**
   * Open/Closes the legend popup
   */
  public toggleLegend() {
    this.legendOpen = !this.legendOpen;
  }

  /**
   * Open/Closes the imprint popup
   */
  public toggleImprint() {
    this.imprintOpen = !this.imprintOpen;
  }

  public clearSearchResults() {
    // this.searchResults = [];
    // this.debounceSearchInput.next();
  }
}

export class CustomMarker extends L.Marker {
  private id: number;

  constructor(id: number, latlng: L.LatLngExpression, options?: L.MarkerOptions) {
    super(latlng, options);
    this.id = id;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number) {
    this.id = id;
  }
}