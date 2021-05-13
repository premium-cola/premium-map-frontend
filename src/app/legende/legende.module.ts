import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendeComponent } from './legende.component';
import { LegendeRoutingModule } from './legende-routing.module';
import { PopupModule } from '../popup/popup.module';

@NgModule({
  declarations: [LegendeComponent],
  imports: [
    PopupModule,
    CommonModule,
    LegendeRoutingModule
  ]
})
export class LegendeModule { }
