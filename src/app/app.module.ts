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
import { RuleMethod1Component } from './rulesets/rule-method1/rule-method1.component';
import { RuleMethod3Component } from './rulesets/rule-method3/rule-method3.component';
import { RuleMethod2Component } from './rulesets/rule-method2/rule-method2.component';
import { RuleModalComponent } from './rulesets/rule-modal/rule-modal.component';
import { LoaderComponent } from './components/loader/loader.component';







@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    BREschemaComponent,
    TabslistComponent,
    WorkflowComponent,
    WorkflowDetailComponent,
    RuleMethod1Component,
    RuleMethod3Component,
    RuleMethod2Component,
    RuleModalComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSelectModule, 
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
