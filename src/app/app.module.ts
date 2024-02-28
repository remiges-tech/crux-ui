import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { BREschemaComponent } from './breschema/breschema.component';
import { TabslistComponent } from './components/tabslist/tabslist.component';
import { WorkflowComponent } from './components/workflow-list/workflow.component';
import { WorkflowDetailComponent } from './components/workflow-detail/workflow-detail.component';
import { DoMatchComponent } from './rulesets/do-match/do-match.component';
import { ThenElseCallComponent } from './rulesets/then-else-call/then-else-call.component';
import { RuleModalComponent } from './rulesets/rule-modal/rule-modal.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ReplicateRealmsliceComponent } from './realmslice/replicate-realmslice/replicate-realmslice.component';
import { MultiSelectModule } from 'primeng/multiselect';

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
    RuleModalComponent,
    LoaderComponent,
    ReplicateRealmsliceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSelectModule, 
    FormsModule,
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
