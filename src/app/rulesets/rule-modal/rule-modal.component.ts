import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RTree } from 'src/models/common-interfaces';
import { MatDialogRef } from '@angular/material/dialog';
import { OperatorsUnicode } from 'src/services/constants.service';

@Component({
    selector: 'app-rule-modal',
    template: `
    <div class="modal-dialog modal-md modal-dialog-centered" style="padding: 20px 10px;"  role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title fw-bold" id="ruleModalLabel">Ruleset Details</h5>
            </div>
            <div class="modal-body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div *ngFor="let rule of Rule?.rulePattern">
                                <div class="row">
                                    <div class="col-md-2">
                                        <p class="fs-5">{{ rule?.attrname }}</p>
                                    </div>
                                    <div class="col-md-1">
                                        <p [innerHTML]="OperatorsUnicode[rule.op]" class="fs-5"></p>
                                    </div>
                                    <div class="col-md-2">
                                        <p class="fs-5">{{ rule?.attrval }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="fs-20 mb-2">
                                <b>{{(Rule && Rule.ruleActions.tasks.length > 1) ? 'NextSteps' : 'NextStep'}}:</b>
                                <span class="badge bg-primary mx-2 fs-10"
                                    *ngFor="let task of Rule?.ruleActions?.tasks">{{ task }}</span>
                            </div>
                            <div class="mt-4 fs-20">
                                <b>{{(Rule && Rule.ruleActions.properties.length > 1) ? 'NextStep Tags' : 'NextStep Tag'}}:</b>
                                <span *ngFor="let properties of Rule?.ruleActions?.properties">
                                    <span class="badge bg-success mx-2 fs-10"
                                        *ngFor="let property of properties | keyvalue">{{property.key}} - {{
                                        property.value }}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" style="float: right;" class="btn btn-secondary" (click)="closeModal()">Close</button>
            </div>
        </div>
    </div>
  `
})
export class RuleModalComponent {
    Rule?: RTree;
    OperatorsUnicode: any = OperatorsUnicode;
    constructor(@Inject(MAT_DIALOG_DATA) public data:
        { Rule: RTree },
        private dialog: MatDialogRef<RuleModalComponent>) {
        if (data) {
            this.Rule = data.Rule
        }
    }

    closeModal() {
        this.dialog.close();
    }
}
