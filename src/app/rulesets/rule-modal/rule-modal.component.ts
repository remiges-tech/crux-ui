import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RTree, RulePatternTerm, RuleSet } from 'src/models/common-interfaces';
import { OperatorsUnicode } from 'src/services/constants.service';

@Component({
    selector: 'app-rule-modal',
    templateUrl: './rule-modal.component.html',
    styleUrls: ['./rule-modal.component.scss']
})
export class RuleModalComponent {
    isEdit:boolean =false;
    Rule?: RTree;
    Ruleset?: RuleSet;
    RuleForm !: FormGroup;
    OperatorsUnicode: any = OperatorsUnicode;
    operators = ['eq','gt','lt', 'ge', 'le', 'ne']
    constructor(@Inject(MAT_DIALOG_DATA) public data:
        { Rule: RTree, Ruleset: RuleSet },
        private dialog: MatDialogRef<RuleModalComponent>,
        private formBuilder: FormBuilder) {
        // Building a form group for a rule
        this.RuleForm = this.formBuilder.group({
            rulePattern: this.formBuilder.array([]),
            nextSteps: this.formBuilder.array([]),
            nextStepTags: this.formBuilder.array([])
        })
        if (data) {
            this.Rule = data.Rule
            this.Rule.rulePattern.forEach((pattern: RulePatternTerm) => {
                this.addPatterns(pattern.attrname, pattern.op, pattern.attrval);
            })
            this.Rule.ruleActions.tasks.forEach((task: string) => {
                this.addNextSteps(task);
            })
            this.Ruleset = data.Ruleset

            console.log(this.RuleForm.value, 'RuleForm')
        }
    }

    get rulePattern() {
        return this.RuleForm.get('rulePattern') as FormArray;
    }

    get nextSteps() {
        return this.RuleForm.get('nextSteps') as FormArray;
    }

    addPatterns(attrname?: string, op?: string, attrval?: any) {
        const rPattern = this.formBuilder.group({
            attrname: [attrname ?? '', [Validators.required]],
            op: [op ?? 'null', [Validators.required]],
            attrval: [attrval ?? '', [Validators.required]],
        });
        this.rulePattern.push(rPattern)
    }

    // Function to remove a field from the FormArray
  removerulePattern(index: number) {
    this.rulePattern.removeAt(index);
  }

    addNextSteps(value: string) {
        const task = this.formBuilder.control(value)
        this.nextSteps.push(task);
    }

    getRulesetName() {
        if (this.Ruleset == undefined || this.Rule == undefined) {
            return ''
        }
        return this.Ruleset.name
    }

    closeModal() {
        this.dialog.close();
    }

}
