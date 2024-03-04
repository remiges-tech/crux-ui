import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { BREschemaComponent } from './breschema/breschema.component';
import { TabslistComponent } from './components/tabslist/tabslist.component';
import { WorkflowComponent } from './components/workflow-list/workflow.component';
import { WorkflowDetailComponent } from './components/workflow-detail/workflow-detail.component';
import { DoMatchComponent } from './rulesets/do-match/do-match.component';
import { ThenElseCallComponent } from './rulesets/then-else-call/then-else-call.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ReplicateRealmsliceComponent } from './realmslice/replicate-realmslice/replicate-realmslice.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RuleModalComponent } from './rulesets/rule-modal/rule-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    BREschemaComponent,
    TabslistComponent,
    WorkflowComponent,
    WorkflowDetailComponent,
    DoMatchComponent,
    ThenElseCallComponent,
    LoaderComponent,
    ReplicateRealmsliceComponent,
    PageNotFoundComponent,
    RuleModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSelectModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MultiSelectModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
