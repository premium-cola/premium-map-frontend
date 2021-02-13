import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LegendeComponent } from './legende.component';

const routes: Routes = [
  {
    path: '',
    component: LegendeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegendeRoutingModule { }
