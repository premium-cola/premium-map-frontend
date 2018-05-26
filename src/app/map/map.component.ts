import { Component, OnInit } from "@angular/core";
import { SearchService, SearchResult, Item } from "../search.service";
import { Subject } from "rxjs/Subject";
import { map, debounceTime } from "rxjs/operators";

import * as L from "leaflet";
import "leaflet.markercluster";
import { ActivatedRoute, Router, Params } from "@angular/router";

/**
 * TODO:
 * - Make top bar responsive
 * - Remember active and inactive filter in localStorage
 * - Filter icon should be visually disabled if the filter itself is disabled
 */
@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit {
  private map: L.Map;
  private markerClusterGroup: L.MarkerClusterGroup;
  private defaultHomePosition: L.LatLng = L.latLng(
    50.93766174471314,
    9.777832031250002
  );
  private defaultZoomLevel = 7;

  // State of the shop types in the top bar
  public shopTypesState = {
    laeden: false,
    haendler: false,
    sprecher: false,
    webshop: false
  };
  private itemList: any[];

  public debounceSearchInput: Subject<string> = new Subject();
  public searchResults: SearchResult[];

  public legendOpen = false;
  public imprintOpen = false;
  public feedbackOpen = false;

  public selectedItem: Item;

  public feedbackEmail = "";
  public feedbackText = "";
  public feedbackSentMessage;

  constructor(
    private route: ActivatedRoute,
    public searchService: SearchService,
    public router: Router
  ) {}

  async ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment === "feedback") {
        this.feedbackOpen = true;
      }
    });
    this.initalizeMap();

    this.searchService.itemList(this.enabledShopTypes()).subscribe(itemList => {
      this.itemList = itemList;
      this.updateMarker(() => {
        this.route.params.subscribe((params: Params) => {
          if (params.item) {
            this.showDetails(params.item);
          }
        });
      });
    });

    this.centerPositionOnMap();

    this.debounceSearchInput
      .pipe(debounceTime(200))
      .subscribe((searchKeyword: string) => {
        this.search(searchKeyword);
      });
  }

  private initalizeMap() {
    this.map = L.map("map", {
      maxZoom: 19,
      zoomControl: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
    }).addTo(this.map);

    // Add zoom control to the bottom left
    L.control
      .zoom({
        position: "bottomleft"
      })
      .addTo(this.map);

    // Add imprint control button
    const imprintControl = L.Control.extend({
      options: {
        position: "bottomright"
      },
      onAdd: () => {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control leaflet-control-custom"
        );
        container.style.backgroundColor = "white";
        container.style.width = "30px";
        container.style.height = "30px";
        container.innerText = "i";
        container.style.fontFamily = "icomoon";
        container.style.fontSize = "100%";
        container.style.textAlign = "center";
        container.style.fontWeight = "700";
        container.style.fontSize = "20px";
        container.style.cursor = "pointer";
        container.onclick = () => {
          this.toggleImprint();
        };
        return container;
      }
    });

    this.map.addControl(new imprintControl());
  }

  /**
   * This firstly adds a MarkerClusterGroup where the actual markers are then added.
   * Finally the MarkerClusterGroup is added to the map.
   */
  private async updateMarker(complete?: () => void) {
    if (this.markerClusterGroup && this.markerClusterGroup.getLayers().length) {
      this.markerClusterGroup.clearLayers();
    }

    this.markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 60,
      polygonOptions: {
        fillColor: "#000",
        color: "#000",
        weight: 4,
        opacity: 0.5,
        fillOpacity: 0.2
      }
    });

    this.itemList.map((item: any[]) => {
      let marker: CustomMarker;
      marker = new CustomMarker(item[0], L.latLng(item[1][0], item[1][1]), {
        icon: L.icon({
          iconUrl: `assets/img/marker/${this.searchService.mapShopTypesToImage(
            item[2]
          )}`,
          iconSize: [36, 42],
          popupAnchor: [0, -20]
        })
      });

      marker.bindPopup(() => {
        return "Lade Daten...";
      });

      marker.off("click");
      marker.addEventListener("click", (event: L.LeafletEvent) => {
        const eventMarker: CustomMarker = event.target as CustomMarker;
        if (this.router.isActive(`${eventMarker.getId()}`, true)) {
          eventMarker.togglePopup();
        } else {
          this.router.navigate([eventMarker.getId()]);
        }
      });

      marker.addEventListener("popupopen", (event: L.LeafletEvent) => {
        const eventMarker: CustomMarker = event.target as CustomMarker;
        this.searchService
          .itemDetails(marker.getId())
          .subscribe((itemDetails: Item) => {
            this.selectedItem = itemDetails;
            marker.setPopupContent(`
              <h2>${itemDetails.name}</h2>
              <small>${itemDetails.offertypes.join(", ")} für</small>
              <small>${itemDetails.products.join(", ")}</small>
              <br>
              <p>
                ${itemDetails.street}<br>
                ${itemDetails.zip} ${itemDetails.city}
              </p>
              <p>
                ${
                  itemDetails.email
                    ? "<i class='fa fa-envelope' aria-hidden='true'></i> <a href='mailto:" +
                      itemDetails.email +
                      "'>" +
                      itemDetails.email +
                      "</a>"
                    : ""
                }<br>
                ${
                  itemDetails.phone
                    ? "<i class='fa fa-phone' aria-hidden='true'></i> <a href='tel:'" +
                      itemDetails.phone +
                      "'>" +
                      itemDetails.phone +
                      "</a>"
                    : ""
                }
              </p>
              <p>
                <i class="fa fa-bullhorn" aria-hidden="true"></i>
                <a href="${
                  itemDetails.id
                }#feedback">Feedback zu diesem Eintrag?</a>
              </p>
              <p>
                <small>
                  Achtung: vor dem Losfahren bitte anrufen und fragen ob das gewünschte Produkt verfügbar ist.
                  Falls nicht, bitten wir um ein kurzes Feedback
                </small>
              </p>
            `);
          });
      });

      marker.addTo(this.markerClusterGroup);
    });

    this.markerClusterGroup.addTo(this.map);

    if (complete) {
      complete();
    }
  }

  /**
   * Recenters the map to the current position of the user.
   */
  private centerPositionOnMap() {
    const lastCurrentPosition: Position = JSON.parse(
      localStorage.getItem("lastCurrentPosition")
    );

    /**
     * Checks if the last saved position is no older than 30 minutes.
     * If it isn't oldet than 30 minutes then the location is used immediately instead of requesting it
     * through the browser API.
     */
    if (
      lastCurrentPosition &&
      Math.floor(new Date().getTime() / 1000) - lastCurrentPosition.timestamp <=
        1800
    ) {
      this.map.setView(
        L.latLng(
          lastCurrentPosition.coords.latitude,
          lastCurrentPosition.coords.longitude
        ),
        10
      );
    } else {
      this.map.setView(this.defaultHomePosition, this.defaultZoomLevel);

      navigator.geolocation.getCurrentPosition((position: Position) => {
        localStorage.setItem(
          "lastCurrentPosition",
          JSON.stringify({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            timestamp: position.timestamp
          })
        );
        this.map.setView(
          L.latLng(position.coords.latitude, position.coords.longitude),
          10
        );
      });
    }
  }

  public async search(searchKeyword: string) {
    this.searchService
      .search(searchKeyword)
      .subscribe((searchResults: SearchResult[]) => {
        this.searchResults = searchResults;
      });
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
    const enabledShopTypes = [];
    for (const shopType in this.shopTypesState) {
      if (!this.shopTypesState[shopType]) {
        enabledShopTypes.push(shopType);
      }
    }
    return enabledShopTypes;
  }

  /**
   * Show details in a popup window about a specific shop
   *
   * @param itemId
   */
  public showDetails(itemId: number | string) {
    if (typeof itemId === "string") {
      itemId = parseInt(itemId, 10);
    }
    if (this.searchResults) {
      this.clearSearchResults();
    }
    const targetMarker: L.Layer = this.markerClusterGroup
      .getLayers()
      .find((layer: CustomMarker) => {
        return itemId === layer.getId();
      });
    const marker = targetMarker as CustomMarker;
    const bounds = L.latLngBounds([marker.getLatLng()]);
    this.map.fitBounds(bounds, {
      maxZoom: 18
    });
    // this.map.panTo(marker.getLatLng(), {});
    marker.openPopup();
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

  public toggleFeedback() {
    this.feedbackOpen = !this.feedbackOpen;
    if (!this.feedbackOpen) {
      window.location.hash = "";
      this.feedbackSentMessage = null;
    }
  }

  public sendFeedback() {
    this.searchService
      .sendFeedback(this.selectedItem, this.feedbackEmail, this.feedbackText)
      .subscribe((response: { status: number; data: { msg: string } }) => {
        this.feedbackSentMessage = response.data.msg;
        this.feedbackEmail = "";
        this.feedbackText = "";
      });
  }

  public clearSearchResults() {
    this.searchResults = [];
    this.debounceSearchInput.next();
  }
}

export class CustomMarker extends L.Marker {
  private id: number;

  constructor(
    id: number,
    latlng: L.LatLngExpression,
    options?: L.MarkerOptions
  ) {
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
