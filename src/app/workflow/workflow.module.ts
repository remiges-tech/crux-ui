import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WorkflowSchemaComponent } from './workflow-schema/workflow-schema.component';
import { TablistComponent } from './tablist/tablist.component';
import { WorkflowDetailComponent } from './workflow-detail/workflow-detail.component';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ThenElseCallComponent } from './rulesets/then-else-call/then-else-call.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DoMatchComponent } from './rulesets/do-match/do-match.component';
import { RuleModalComponent } from './rulesets/rule-modal/rule-modal.component';
import { ReplicateRealmsliceComponent } from '../realmslice/replicate-realmslice/replicate-realmslice.component';


@NgModule({
  declarations: [
    WorkflowSchemaComponent,
    ReplicateRealmsliceComponent,
    TablistComponent,
    WorkflowDetailComponent,
    WorkflowListComponent,
    ThenElseCallComponent,
    DoMatchComponent,
    RuleModalComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    DragDropModule,
    MultiSelectModule,
    CalendarModule,
    DatePipe,
  ]
})
export class WorkflowModule { }
