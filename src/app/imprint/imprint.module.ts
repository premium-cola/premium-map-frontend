import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImprintComponent } from './imprint.component';
import { ImprintRoutingModule } from './imprint-routing.module';

@NgModule({
  declarations: [ImprintComponent],
  imports: [
    CommonModule,
    ImprintRoutingModule
  ]
})
export class ImprintModule { }
