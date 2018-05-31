import { Component, OnInit } from "@angular/core";
import { SearchService, SearchResult, Item } from "../search.service";
import { Subject } from "rxjs/Subject";
import { map, debounceTime } from "rxjs/operators";
import { SelectItem } from "../dropdown/dropdown.component";

import * as L from "leaflet";
import "leaflet.markercluster";
import { ActivatedRoute, Router, Params } from "@angular/router";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  public itemList: any[];

  constructor(public searchService: SearchService) {}

  ngOnInit() {
    this.searchService.itemAll().subscribe(items => {
      this.itemList = items;
    });
  }
}
