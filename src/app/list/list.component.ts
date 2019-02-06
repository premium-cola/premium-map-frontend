import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';

import 'leaflet.markercluster';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
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
