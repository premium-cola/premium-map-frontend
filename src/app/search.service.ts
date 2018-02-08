import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class SearchService {

  private host = 'http://localhost:8085';
  private searchPath = '/search';

  constructor(
    private http: Http,
  ) { }

  public search(keyword: string): Promise<Response> {
    return this.http.get(`${this.host}${this.searchPath}/${keyword}`).toPromise();
  }
}
