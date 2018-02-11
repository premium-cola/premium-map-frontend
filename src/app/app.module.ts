import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Providers
import { HttpModule } from '@angular/http';
import { SearchService } from './search.service';
import { PopupComponent } from './popup/popup.component';

@NgModule({
  declarations: [
    AppComponent,
    PopupComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
  ],
  providers: [
    SearchService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
