import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from './search.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  // private host = "http://localhost:8085";
  private host = 'https://api.landkarte.premium-cola.de';
  private feedbackPath = '/feedback';

  constructor(private http: HttpClient) { }

  public sendFeedback(
    itemId: Item['id'],
    email: string,
    feedback: string
  ): Observable<any> {
    const url = `${this.host}${this.feedbackPath}`;
    const body = new URLSearchParams();
    body.set('email', email);
    body.set('feedback', feedback);
    body.set('id', `${itemId}`);
    console.log("Posting: ", body.toString())
    return this.http.post(url, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }
}
