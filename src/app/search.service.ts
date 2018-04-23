import { Injectable, keyframes } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SearchService {

  // private host = 'http://localhost:8085';
  private host = 'https://cola.gacrux.uberspace.de';
  private searchPath = '/search';
  private itemListPath = '/item/list';
  private itemDetailsPath = '/item';

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * @param keyword the keyword to search for
   */
  public search(keyword: string): Observable<SearchResult[]> {
    let url = `${this.host}${this.searchPath}`;
    if(keyword !== "") url += `/${keyword}`;
    return this.http.get<any>(url).pipe(map(res => res.data.items as SearchResult[]));
  }

  public itemDetails(id: number): Observable<Item> {
    const url = `${this.host}${this.itemDetailsPath}/${id}`;
    return this.http.get<any>(url).pipe(map((res) => res.data as Item));
  }

  // https://<host>/item/list?types[]=haendler&types[]=sprecher&types[]=webshop
  public itemList(types: string[]): Observable<any[]> {
    let url = `${this.host}${this.itemListPath}`;
    url += `?types[]=${types.join('&types[]=')}`;
    return this.http.get<any>(url).pipe(map(itemList => itemList.data as any[]));
  }

  /**
   * This function returns the svg filename for the specified shop type list
   * which is than used in the search result.
   * 
   * @param shopTypes A list of shop types e.g.: ["3", "2"]
   */
  public mapShopTypesToImage(shopTypes: Array<string>) {
    let normalizedShopTypes = [];
    shopTypes.map(item => {
      normalizedShopTypes.push(`${item}`);
    });

    let abbriviation = "";

    // s = Sprecher/lokaler Kontakt, l = Laden
    if(normalizedShopTypes.indexOf("3") && normalizedShopTypes.indexOf("1")) {
      abbriviation = "sl";
    // s = Sprecher/lokaler Kontakt, l = Laden
    } else if(normalizedShopTypes.indexOf("3") && normalizedShopTypes.indexOf("2")) {
      abbriviation = "sh";
    // l = Laden
    } else if(normalizedShopTypes.indexOf("1") && normalizedShopTypes.length == 1) {
      abbriviation = "l";
    // h = Haendler
    } else if(normalizedShopTypes.indexOf("2") && normalizedShopTypes.length == 1) {
      abbriviation = "h";
    // s = Sprecher/lokaler Kontakt
    } else if(normalizedShopTypes.indexOf("3") && normalizedShopTypes.length == 1) {
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

export interface Item {
  id: number,
  name: string,
  street: string,
  products: string[],
  offertypes: string[],
  city: string,
  zip: string,
  web: string,
  email: string,
  phone: string,
  uri: string
}

export enum ShopType {
  Laden = 1,
  Haendler = 2,
  LokalerKontakt = 3,
  Onlinehandel = 4
}