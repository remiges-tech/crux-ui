import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BREschemaComponent } from './breschema/breschema.component';
import { ReplicateRealmsliceComponent } from './realmslice/replicate-realmslice/replicate-realmslice.component';

const routes: Routes = [
  {path:'', component:BREschemaComponent},
  {path:'replicate-realmslice', component:ReplicateRealmsliceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
