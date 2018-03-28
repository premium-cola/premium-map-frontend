import { Injectable, keyframes } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpResponse } from 'selenium-webdriver/http';

import "rxjs/add/operator/map";

@Injectable()
export class SearchService {

  // private host = 'http://localhost:8085';
  private host = 'https://cola.gacrux.uberspace.de';
  private searchPath = '/search';
  private itemListPath = '/item/list';

  constructor(
    private http: Http,
  ) { }

  /**
   * TODO: Map directly to JSON instead of doing that in the app.components.ts
   * 
   * @param keyword 
   */
  public search(keyword: string): Promise<Response> {
    let url = `${this.host}${this.searchPath}`;
    if(keyword !== "") url += `/${keyword}`;
    return this.http.get(url).toPromise();
  }

  // https://<host>/item/list?types[]=haendler&types[]=sprecher&types[]=webshop
  public itemList(types: Array<string>): Promise<Array<any>> {
    let url = `${this.host}${this.itemListPath}`;
    url += `?types[]=${types.join('&types[]=')}`;
    return this.http.get(url).map(itemList => itemList.json().data).toPromise();
  }

  public mapShopTypesToImage(shopTypes: Array<string>) {
    let abbriviation = "";

    // s = Sprecher/lokaler Kontakt, l = Laden
    if(shopTypes.indexOf("3") && shopTypes.indexOf("1")) {
      abbriviation = "sl";
    // s = Sprecher/lokaler Kontakt, l = Laden
    } else if(shopTypes.indexOf("3") && shopTypes.indexOf("2")) {
      abbriviation = "sh";
    // l = Laden
    } else if(shopTypes.indexOf("1") && shopTypes.length == 1) {
      abbriviation = "l";
    // h = Haendler
    } else if(shopTypes.indexOf("2") && shopTypes.length == 1) {
      abbriviation = "h";
    // s = Sprecher/lokaler Kontakt
    } else if(shopTypes.indexOf("3") && shopTypes.length == 1) {
      abbriviation = "s";
    }

    return `${["marker-icon", abbriviation].join("-")}.svg`;
  }
}

export interface SearchResult {
  id: number;
  email: string;
  lat: string;
  lng: string;
  name: string;
  offertypes: Array<string>;
  phone: string;
  uri: string;
  web: string;
  city: string;
  street: string;
  zip: string;
}

export enum ShopType {
  Laden = 1,
  Haendler = 2,
  LokalerKontakt = 3,
  Onlinehandel = 4
}