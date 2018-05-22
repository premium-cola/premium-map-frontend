import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";

// Providers
import { SearchService } from "./search.service";
import { PopupComponent } from "./popup/popup.component";
import { HttpClientModule } from "@angular/common/http";
import { MapComponent } from "./map/map.component";

@NgModule({
  declarations: [AppComponent, PopupComponent, MapComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: "",
        component: MapComponent
      },
      {
        path: ":item",
        component: MapComponent
      }
    ])
  ],
  exports: [RouterModule],
  providers: [SearchService],
  bootstrap: [AppComponent]
})
export class AppModule {}
