import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

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


@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    BREschemaComponent,
    TabslistComponent,
    WorkflowComponent,
    WorkflowDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSelectModule, 
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
