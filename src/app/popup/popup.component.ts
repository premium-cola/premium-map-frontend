import { Location } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit(): void {
  }

  public navigateHome() {
    this.location.back();
  }

}
