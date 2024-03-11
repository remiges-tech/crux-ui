import { Component, Inject, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Property, RTree, RulePatternTerm, RuleSet, SchemaDetails, SchemaPatternAttr } from 'src/models/common-interfaces';
import { OperatorsUnicode } from 'src/services/constants.service';
import { checkAttributes, checkConstraints } from 'src/customValidators/rule.contraints.service';
import { CommonService } from 'src/services/common.service';
export interface SchemaPattern {
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
    propertiesNameList: string[] = [];
    isEdit: boolean = false;
    Rule?: RTree;
    Ruleset?: RuleSet;
    private _commonService = inject(CommonService);
    RuleForm: FormGroup = this.formBuilder.group({
        rulePattern: this.formBuilder.array([]),
        nextSteps: [[], [Validators.required]],
        nextStepTags: this.formBuilder.array([])
    });

    OperatorsUnicode: { [key: string]: string } = OperatorsUnicode;
    operators = ['eq', 'gt', 'lt', 'ge', 'le', 'ne']
    SchemaData?: SchemaDetails;
    schemaPatternDetails: SchemaPatternAttr[] = []

    constructor(@Inject(MAT_DIALOG_DATA) public data:
        { rule: RTree, Ruleset: RuleSet, schemaData: SchemaDetails },
        private dialog: MatDialogRef<RuleModalComponent>,
        private formBuilder: FormBuilder) {

        if (data) {
            this.Rule = data.rule
            this.Ruleset = data.Ruleset
            this.SchemaData = data.schemaData
            this.patchValues();
            this.getAttrNameList();
            this.getPropertiesNameList();
        }
    }

    patchValues() {
        if (this.Rule == undefined) {
            return;
        }

        this.Rule.rulePattern.forEach((pattern: RulePatternTerm) => {
            this.addPatterns(pattern.attrname, pattern.op, pattern.attrval);
        })
        if (this.Rule.ruleActions.tasks.includes('done')) {
            this.RuleForm.get('nextSteps')?.disable();
            this.RuleForm.get('nextSteps')?.patchValue(['done'])
        }else{
            this.RuleForm.get('nextSteps')?.enable();
            this.RuleForm.patchValue({ nextSteps: this.Rule.ruleActions.tasks })
        }
        this.Rule.ruleActions.properties.forEach((property:Property) => {
            this.addPropeties(property.name, property.val)
        })
        // console.log(this.RuleForm.value)
    }

    onAttrNameChangeHandler(selectedAttrName: any, index: number) {
        this.rulePattern.controls[index].patchValue({ op: '', attrval: '' })
        this.schemaPatternDetails[index] = this.getTypeFromSchema(selectedAttrName.target.value)
        this.getAttrNameList()
        // this.getTypeFromSchema(selectedAttrName.target.value).valtype=='bool'?this.rulePattern.controls[index].get('attrval')?.patchValue(false): ''
    }

    getAttrNameList() {
        this.attrNameList = []
        this.SchemaData?.patternschema.attr.forEach((attribute: SchemaPatternAttr) => {
            // if(attribute.valtype == 'bool' && this.checkIfValueIsAlreadyUsed(attribute.name)){
            //     return;
            // }
            this.attrNameList.push(attribute.name)
        })
    }

    checkIfValueIsAlreadyUsed(attributeName:string){
        return this.rulePattern.value.some((pattern:any)=> pattern.attrname == attributeName)
    }

    getPropertiesNameList() {
        this.propertiesNameList = []
        this.SchemaData?.actionschema.properties.forEach((property: string) => {
            if(property == 'done') return;
            this.propertiesNameList.push(property)
        })
    }

    markTaskDone(isChecked: any) {
        let nextsteps = this.RuleForm.get('nextSteps')
        let nextStepTags = this.RuleForm.get('nextStepTags')
        if (isChecked.checked) {
            nextsteps?.disable();
            nextsteps?.patchValue(['done'])
            this.propertiesNameList = ['done'];
            nextStepTags?.patchValue([{name:'done',val:'done'}]);
            nextStepTags?.disable();
        } else {
            nextsteps?.patchValue([])
            this.removeProperties(0);
            this.getPropertiesNameList()
            nextStepTags?.enable();
            nextsteps?.enable();
        }
        // console.log(nextStepTags?.value);
    }

    get rulePattern() {
        return this.RuleForm.get('rulePattern') as FormArray;
    }

    get nextStepTags() {
        return this.RuleForm.get('nextStepTags') as FormArray;
    }

    addPatterns(attrname?: string, op?: string, attrval?: any) {
        this.schemaPatternDetails.push(this.getTypeFromSchema(attrname ?? ''))
        const rPattern = this.formBuilder.group({
            attrname: [attrname ?? '',[Validators.required, checkAttributes(this.rulePattern.value,this.rulePattern.length,this.SchemaData!)]],
            op: [op ?? '', [Validators.required]],
            attrval: [attrval ?? '', [Validators.required, checkConstraints(this.rulePattern.length, this.schemaPatternDetails)]]
        });
        this.rulePattern.push(rPattern)
    }

    addPropeties(name?: string,val?:string) {
        const rProperties = this.formBuilder.group({
            name: [name ?? '', [Validators.required]],
            val: [val ?? '', [Validators.required]]
        });
        this.nextStepTags.push(rProperties)
    }

    // Function to remove a field from the FormArray
    removeRulePattern(index: number) {
        this.rulePattern.removeAt(index);
        this.schemaPatternDetails.splice(index, 1);
        this.getAttrNameList()
    }

    removeProperties(index: number) {
        this.nextStepTags.removeAt(index);
    }

    // onPatternDrop(event: CdkDragDrop<any[]>) {
    //     moveItemInArray(this.rulePattern.controls, event.previousIndex, event.currentIndex);
    // }

    getTypeFromSchema(attrname: string) {
        let data: SchemaPatternAttr = {
            name: attrname,
            shortdesc: '',
            longdesc: '',
            valtype: 'str'
        }
        this.SchemaData?.patternschema.attr.forEach((pattern: any) => {
            if (pattern.name == attrname) {
                data.valtype = pattern.valtype
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
        if (this.schemaPatternDetails[index].valtype == 'enum' || this.schemaPatternDetails[index].valtype == 'bool') {
            return ['eq', 'ne']
        }
        return this.operators;
    }

    closeModal() {
        this.dialog.close();
    }

    saveHandler() {
        if (this.RuleForm.invalid) {
            return
        }
        this.Rule!.rulePattern = this.RuleForm.value.rulePattern
        this.Rule!.ruleActions.tasks = this.RuleForm.get('nextSteps')?.value
        this.Rule!.ruleActions.properties = this.nextStepTags.value
        this.isEdit = false;
    }
}
