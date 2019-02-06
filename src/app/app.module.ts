import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

// Providers
import { SearchService } from './search.service';
import { PopupComponent } from './popup/popup.component';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from './map/map.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    PopupComponent,
    MapComponent,
    DropdownComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: MapComponent
      },
      // {
      //   path: 'list',
      //   component: ListComponent
      // },
      {
        path: ':item',
        component: MapComponent
      }
    ])
  ],
  exports: [RouterModule],
  providers: [SearchService],
  bootstrap: [AppComponent]
})
export class AppModule {}
