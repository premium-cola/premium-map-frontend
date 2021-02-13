import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MapComponent } from "./map/map.component";

const routes: Routes = [
  {
    path: 'legende',
    loadChildren: () => import('./legende/legende.module').then(m => m.LegendeModule)
  },
  {
    path: 'imprint',
    loadChildren: () => import('./imprint/imprint.module').then(m => m.ImprintModule)
  },
  {
    path: "",
    component: MapComponent,
  },
  {
    path: ':item',
    component: MapComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
