import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BREschemaComponent } from './breschema/breschema.component';
import { ReplicateRealmsliceComponent } from './realmslice/replicate-realmslice/replicate-realmslice.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {path:'', component:BREschemaComponent},
  {path:'replicate-realmslice', component:ReplicateRealmsliceComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
