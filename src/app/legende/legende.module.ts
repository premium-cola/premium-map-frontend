import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendeComponent } from './legende.component';
import { LegendeRoutingModule } from './legende-routing.module';


@NgModule({
  declarations: [LegendeComponent],
  imports: [
    CommonModule,
    LegendeRoutingModule
  ]
})
export class LegendeModule { }
