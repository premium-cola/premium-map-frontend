import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImprintComponent } from './imprint.component';
import { ImprintRoutingModule } from './imprint-routing.module';
import { PopupModule } from '../popup/popup.module';

@NgModule({
  declarations: [ImprintComponent],
  imports: [
    PopupModule,
    CommonModule,
    ImprintRoutingModule
  ]
})
export class ImprintModule { }
