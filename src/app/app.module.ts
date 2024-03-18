import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog'
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { DoMatchComponent } from './workflow/rulesets/do-match/do-match.component';
// import { ThenElseCallComponent } from './rulesets/then-else-call/then-else-call.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ReplicateRealmsliceComponent } from './realmslice/replicate-realmslice/replicate-realmslice.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RuleModalComponent } from './workflow/rulesets/rule-modal/rule-modal.component';
import { WorkflowModule } from './workflow/workflow.module';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    // DoMatchComponent,
    // ThenElseCallComponent,
    LoaderComponent,
    // ReplicateRealmsliceComponent,
    PageNotFoundComponent,
    // RuleModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // NgSelectModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    DragDropModule,
    WorkflowModule,
    MultiSelectModule,
    CalendarModule,
    DatePipe,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
