import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RulesetsList } from 'src/models/common-interfaces';

@Component({
  selector: 'app-workflow',
  template: `
    <div *ngIf="!workflow?.is_internal" class="card no-border mt-3">
      <div class="card-header">
        <div class="row justify-content-center">
          <div class="col vertically-center">
            <h3 [ngClass]="workflow?.is_active ? 'active' : 'not-active'">{{workflow?.name}}</h3>
          </div>
          <div class="col-auto">
            <button *ngIf="!isShowMetaData" class="btn m-2" type="button" (click)="isShowMetaData = true" >&#9660;</button>
            <button *ngIf="isShowMetaData" class="btn m-2" type="button" (click)="isShowMetaData = false">&#9650;</button>
            <button class="btn fs-22 m-2" type="button" (click)="openWorkflowDetail(workflow!)">&#8658;</button>
          </div>
        </div>
        <div class="row" style="margin-top: -10px;">
          <div class="col">
            <small [ngClass]="workflow?.is_active ? 'active' : 'not-active'">{{ workflow?.longdesc}}</small>
          </div>
        </div>
      </div>
      <div *ngIf="isShowMetaData" class="card-body">
        <div class="row">
          <div class="col-6">
            <h4 class="heading-color">createdat:</h4><p>{{workflow?.createdat}}</p>
          </div>
          <div class="col-6">
            <h4 class="heading-color">createdby:</h4><p>{{workflow?.createdby}}</p>
          </div>
          <div class="col-6">
            <h4 class="heading-color">editedat:</h4><p>{{workflow?.editedat}}</p>
          </div>
          <div class="col-6">
            <h4 class="heading-color">editedby:</h4><p>{{workflow?.editedby}}</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class WorkflowComponent {
  @Input({ required: true }) workflow?: RulesetsList;
  @Output() openDetail = new EventEmitter<any>();
  isShowMetaData: boolean = false;

  openWorkflowDetail(workFlow: RulesetsList) {
    this.openDetail.emit(workFlow);
  }
}
