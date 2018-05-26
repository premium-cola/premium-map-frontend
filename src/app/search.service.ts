import { Injectable, keyframes } from "@angular/core";
import { HttpClient, HttpResponse, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

@Injectable()
export class SearchService {
  private host = "http://localhost:8085";
  // private host = "https://cola.gacrux.uberspace.de";
  private searchPath = "/search";
  private itemListPath = "/item/list";
  private itemDetailsPath = "/item";
  private feedbackPath = "/feedback";

  constructor(private http: HttpClient) {}

  /**
   * @param keyword the keyword to search for
   */
  public search(keyword: string): Observable<SearchResult[]> {
    let url = `${this.host}${this.searchPath}`;
    if (keyword !== "") {
      url += `/${keyword}`;
    }
    return this.http
      .get<any>(url)
      .pipe(map(res => res.data.items as SearchResult[]));
  }

  public itemDetails(id: number): Observable<Item> {
    const url = `${this.host}${this.itemDetailsPath}/${id}`;
    return this.http.get<any>(url).pipe(map(res => res.data as Item));
  }

  // https://<host>/item/list?types[]=haendler&types[]=sprecher&types[]=webshop
  public itemList(types: string[], countries: string[]): Observable<any[]> {
    let url = `${this.host}${this.itemListPath}`;
    url += `?types[]=${types.join("&types[]=")}`;
    url += `&countries[]=${countries.join("&countries[]=")}`;
    return this.http
      .get<any>(url)
      .pipe(map(itemList => itemList.data as any[]));
  }

  public sendFeedback(
    item: Item,
    email: string,
    feedback: string
  ): Observable<any> {
    const url = `${this.host}${this.feedbackPath}`;
    const body = new URLSearchParams();
    body.set("email", email);
    body.set("feedback", feedback);
    body.set("id", `${item.id}`);
    body.set("zip", item.zip);
    return this.http.post(url, body.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
  }

  /**
   * This function returns the svg filename for the specified shop type list
   * which is than used in the search result.
   *
   * @param shopTypes A list of shop types e.g.: ["3", "2"]
   */
  public mapShopTypesToImage(shopTypes: Array<string>) {
    const normalizedShopTypes = [];
    shopTypes.map(item => {
      normalizedShopTypes.push(`${item}`);
    });

    let abbriviation = "";

    // s = Sprecher/lokaler Kontakt, l = Laden
    if (
      normalizedShopTypes.indexOf("3") > -1 &&
      normalizedShopTypes.indexOf("1") > -1
    ) {
      abbriviation = "sl";
      // s = Sprecher/lokaler Kontakt, h = Haendler
    } else if (
      normalizedShopTypes.indexOf("3") > -1 &&
      normalizedShopTypes.indexOf("2") > -1
    ) {
      abbriviation = "sh";
      // l = Laden, h = Haendler
    } else if (
      normalizedShopTypes.indexOf("1") > -1 &&
      normalizedShopTypes.indexOf("2") > -1
    ) {
      abbriviation = "h";
      // l = Laden
    } else if (
      normalizedShopTypes.indexOf("1") > -1 &&
      normalizedShopTypes.length === 1
    ) {
      abbriviation = "l";
      // h = Haendler
    } else if (
      normalizedShopTypes.indexOf("2") > -1 &&
      normalizedShopTypes.length === 1
    ) {
      abbriviation = "h";
      // s = Sprecher/lokaler Kontakt
    } else if (
      normalizedShopTypes.indexOf("3") > -1 &&
      normalizedShopTypes.length === 1
    ) {
      abbriviation = "s";
      // o = Onlinehandel
    } else if (
      normalizedShopTypes.indexOf("4") > -1 &&
      normalizedShopTypes.length === 1
    ) {
      abbriviation = "o";
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
  id: number;
  name: string;
  street: string;
  products: string[];
  offertypes: string[];
  city: string;
  zip: string;
  web: string;
  email: string;
  phone: string;
  uri: string;
}

export enum ShopType {
  Laden = 1,
  Haendler = 2,
  LokalerKontakt = 3,
  Onlinehandel = 4
}
