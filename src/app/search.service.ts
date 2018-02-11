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
}
