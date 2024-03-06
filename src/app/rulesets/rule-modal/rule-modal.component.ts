import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RTree, RulePatternTerm, RuleSet, SchemaDetails, SchemaPatternAttr } from 'src/models/common-interfaces';
import { OperatorsUnicode } from 'src/services/constants.service';
import { checkConstraints } from 'src/customValidators/rule.contraints.service';
export interface DataInterface {
    type: string,
    vals?: string[],
    valmin?: number,
    valmax?: number,
    lenmin?: number,
    lenmax?: number
}
@Component({
    selector: 'app-rule-modal',
    templateUrl: './rule-modal.component.html',
    styleUrls: ['./rule-modal.component.scss']
})
export class RuleModalComponent {
    attrNameList: string[] = [];
    isEdit: boolean = false;
    Rule?: RTree;
    Ruleset?: RuleSet;
    RuleForm: FormGroup = this.formBuilder.group({
        rulePattern: this.formBuilder.array([]),
        nextSteps: [[]],
        nextStepTags: this.formBuilder.array([])
    });

    OperatorsUnicode: { [key: string]: string } = OperatorsUnicode;
    operators = ['eq', 'gt', 'lt', 'ge', 'le', 'ne']
    schemaData?: SchemaDetails;
    schemaPatternDetails: DataInterface[] = []

    constructor(@Inject(MAT_DIALOG_DATA) public data:
        { Rule: RTree, Ruleset: RuleSet, schemaData: SchemaDetails },
        private dialog: MatDialogRef<RuleModalComponent>,
        private formBuilder: FormBuilder) {

        if (data) {
            this.Rule = data.Rule
            this.Ruleset = data.Ruleset
            this.schemaData = data.schemaData
            this.patchValues();
            this.getAttrNameList();
        }
    }

    patchValues() {
        if (this.Rule == undefined) {
            return;
        }

        this.Rule.rulePattern.forEach((pattern: RulePatternTerm) => {
            this.addPatterns(pattern.attrname, pattern.op, pattern.attrval);
        })
        this.RuleForm.patchValue({ nextSteps: this.Rule.ruleActions.tasks })
    }

    onAttrNameChangeHandler(selectedAttrName: any, index: number) {
        this.schemaPatternDetails[index] = this.getTypeFromSchema(selectedAttrName.target.value)
        this.getAttrNameList();
    }

    getAttrNameList() {
        this.attrNameList = []
        this.schemaData?.patternschema.attr.forEach((attribute: SchemaPatternAttr) => {
            if (this.isAttrNameUsed(attribute.name)) {
                return
            }

            this.attrNameList.push(attribute.name)
        })
    }

    isAttrNameUsed(attrName: string) {
        return this.rulePattern.controls.some((control: any) => control.get('attrname').value == attrName)
    }

    get rulePattern() {
        return this.RuleForm.get('rulePattern') as FormArray;
    }

    addPatterns(attrname?: string, op?: string, attrval?: any) {
        if (this.rulePattern.length > this.schemaData?.patternschema.attr.length! - 1) {
            return
        }

        this.schemaPatternDetails.push(this.getTypeFromSchema(attrname ?? ''))
        const rPattern = this.formBuilder.group({
            attrname: [{ value: attrname ?? '', disabled: attrname ? true : false }, [Validators.required]],
            op: [op ?? '', [Validators.required]],
            attrval: [attrval ?? '', [Validators.required, checkConstraints(this.rulePattern.length, this.schemaPatternDetails)]]
        });
        this.rulePattern.push(rPattern)
        this.getAttrNameList();
    }

    // Function to remove a field from the FormArray
    removeRulePattern(index: number) {
        this.rulePattern.removeAt(index);
        this.schemaPatternDetails.splice(index, 1);
        this.getAttrNameList();
    }

    // onPatternDrop(event: CdkDragDrop<any[]>) {
    //     moveItemInArray(this.rulePattern.controls, event.previousIndex, event.currentIndex);
    // }

    getTypeFromSchema(attrname: string) {
        let data: DataInterface = {
            type: 'str'
        }
        this.schemaData?.patternschema.attr.forEach((pattern: any) => {
            if (pattern.name == attrname) {
                data.type = pattern.valtype
                data.vals = pattern.vals
                data.valmin = pattern.valmin
                data.valmax = pattern.valmax
                data.lenmax = pattern.lenmax
                data.lenmin = pattern.lenmin
            }
        })
        return data
    }

    getOperatorsList(index: number) {
        if (this.schemaPatternDetails[index].type == 'enum' || this.schemaPatternDetails[index].type == 'bool' || this.schemaPatternDetails[index].type == 'str') {
            return ['eq', 'ne']
        }
        return this.operators;
    }

    closeModal() {
        this.dialog.close();
    }

    saveHandler() {
        if(this.RuleForm.invalid){
            return
        }
        this.rulePattern.controls.forEach(control => control.enable())
        this.Rule!.rulePattern = this.RuleForm.value.rulePattern
        this.rulePattern.controls.forEach(control => control.get('attrname')?.disable())
        this.isEdit = false;
    }
}
