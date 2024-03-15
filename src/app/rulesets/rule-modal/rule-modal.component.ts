import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Property, RTree, RulePatternTerm, RuleSet, RulesetsList, SchemaDetails, SchemaPatternAttr } from 'src/models/common-interfaces';
import { OperatorsUnicode } from 'src/services/constants.service';
import { checkConstraints } from 'src/customValidators/rule.contraints.service';

@Component({
    selector: 'app-rule-modal',
    templateUrl: './rule-modal.component.html',
    styleUrls: ['./rule-modal.component.scss']
})
export class RuleModalComponent {
    isEdit: boolean = false;
    Rule?: RTree;
    Ruleset?: RuleSet;
    workFlow?: RulesetsList[];
    RuleForm: FormGroup = this.formBuilder.group({
        rulepattern: this.formBuilder.array<{ attrname: string, op: string, attrval: string }>([]),
        tasks: [[], [Validators.required]],
        properties: this.formBuilder.array<{ name: string, val: string }>([]),
        thenCall: [''],
        elseCall: [''],
        willExit: [false],
        willReturn: [false],
        isDone: [false]
    });

    OperatorsUnicode: { [key: string]: string } = OperatorsUnicode;
    operators = ['eq', 'gt', 'lt', 'ge', 'le', 'ne']
    SchemaData?: SchemaDetails;

    constructor(@Inject(MAT_DIALOG_DATA) public data:
        { rule: RTree, Ruleset: RuleSet, schemaData: SchemaDetails, workFlows: RulesetsList[] },
        private dialog: MatDialogRef<RuleModalComponent>,
        private formBuilder: FormBuilder) {

        if (data) {
            this.Rule = data.rule
            this.Ruleset = data.Ruleset
            this.SchemaData = data.schemaData
            this.workFlow = data.workFlows
            this.patchRuleValues();
        }
    }

    get rulepattern() {
        return this.RuleForm.get('rulepattern') as FormArray;
    }

    get properties() {
        return this.RuleForm.get('properties') as FormArray;
    }

    addPatterns(attrname?: string, op?: string, attrval?: any) {
        const rPattern = this.formBuilder.group({
            attrname: [attrname ?? '', [Validators.required]],
            op: [op ?? '', [Validators.required]],
            attrval: [attrval ?? '', [Validators.required, checkConstraints(this.SchemaData!)]]
        });
        this.rulepattern.push(rPattern)
    }

    addPropeties(name?: string, val?: string) {
        const rProperties = this.formBuilder.group({
            name: [name ?? '', [Validators.required]],
            val: [val ?? '', [Validators.required]]
        });
        this.properties.push(rProperties)
    }

    removeRulePatternByIndex(index: number) {
        this.rulepattern.removeAt(index);
    }

    removePropertiesByIndex(index: number) {
        this.properties.removeAt(index);
    }

    patchRuleValues() {
        if (this.Rule == undefined) {
            return;
        }

        this.Rule.rulePattern.forEach((pattern: RulePatternTerm) => {
            this.addPatterns(pattern.attrname, pattern.op, pattern.attrval);
        })
        this.RuleForm.patchValue({ tasks: this.Rule.ruleActions.tasks, willReturn: this.Rule.ruleActions.return, willExit: this.Rule.ruleActions.exit, thenCall: this.Rule.ruleActions.thencall, elseCall: this.Rule.ruleActions.elsecall })
        this.Rule.ruleActions.properties.forEach((property: Property) => {
            this.addPropeties(property.name, property.val)
            if (property.name == 'done') {
                this.RuleForm.get('isDone')?.patchValue(true);
                this.RuleForm.get('tasks')?.disable();
                this.RuleForm.get('properties')?.disable();
            }
        })
    }

    isAttrNameUsed(attributeName: string, i: number) {
        return this.rulepattern.value.some((pattern: any, index: number) => pattern.attrname == attributeName && index != i)
    }

    isOperatorUsed(attributeName: string, op: string, i: number) {
        return this.rulepattern.value.some((pattern: any, index: number) => pattern.attrname == attributeName && pattern.op == op && index != i)
    }

    getAttributesNamesByIndex(index: number) {
        const attrNameList: string[] = []
        this.SchemaData?.patternschema.attr.forEach((attribute: SchemaPatternAttr) => {
            if ((attribute.valtype == 'bool' || attribute.valtype == 'enum') && this.isAttrNameUsed(attribute.name, index)) {
                return;
            } else if (this.isOperatorUsed(attribute.name, 'eq', index)) {
                return;
            }
            attrNameList.push(attribute.name)
        })

        return attrNameList
    }

    getOperatorsList(index: number) {
        let schemaDetails = this.getSchemaDetailsByIndex(index)
        let isUsed = this.rulepattern.value.some((pattern: any, i: number) => pattern.attrname == schemaDetails?.name && pattern.op != 'eq' && i != index)
        if (schemaDetails?.valtype == 'enum' || schemaDetails?.valtype == 'bool') {
            return ['eq', 'ne']
        }
        return isUsed ? this.operators.filter((op: string) => op != 'eq' && op != 'ne') : this.operators;
    }

    onAttrNameChangeHandler(index: number) {
        this.rulepattern.controls[index].patchValue({ op: '', attrval: '' })
        if (this.getSchemaDetailsByIndex(index)?.valtype == 'bool') {
            this.rulepattern.controls[index].get('attrval')?.patchValue(false)
        }
    }

    propertyNameChangeHandler(index: number) {
        this.properties.controls[index].patchValue({ val: '' });
    }

    markTaskDone() {
        let tasks = this.RuleForm.get('tasks')
        let properties = this.RuleForm.get('properties')
        properties?.value.forEach((index: number) => this.removePropertiesByIndex(index))
        tasks?.patchValue([])
        if (this.RuleForm.get('isDone')?.value) {
            tasks?.disable();
            this.addPropeties('done', 'true');
            properties?.disable();
        } else {
            properties?.enable();
            tasks?.enable();
        }
    }

    exitChangeHandler() {
        const exit = this.RuleForm.get('willExit')?.value
        if (exit) {
            this.RuleForm.get('willReturn')?.patchValue(false);
            this.RuleForm.get('willReturn')?.disable()
        } else {
            this.RuleForm.get('willReturn')?.enable()
        }
    }

    // onPatternDrop(event: CdkDragDrop<any[]>) {
    //     moveItemInArray(this.rulePattern.controls, event.previousIndex, event.currentIndex);
    // }

    getSchemaDetailsByIndex(i: number) {
        const attrName = this.rulepattern.at(i)?.value?.attrname
        return this.SchemaData?.patternschema.attr.filter((pattern: any) => pattern.name == attrName)[0] ?? null
    }

    getSchemaDetailsByAttrName(attrName: string) {
        return this.SchemaData?.patternschema.attr.filter((pattern: any) => pattern.name == attrName)[0] ?? null
    }

    closeModal() {
        this.dialog.close();
    }

    saveHandler() {
        if (this.RuleForm.invalid) {
            return
        }

        this.Rule = {
            setname: this.Rule!.setname,
            rulePattern: this.RuleForm.value.rulepattern,
            ruleActions: {
                tasks: this.RuleForm.get('tasks')?.value,
                properties: this.properties.value,
                thencall: this.RuleForm.get('thenCall')?.value,
                elsecall: this.RuleForm.get('elseCall')?.value,
                return: this.RuleForm.get('willReturn')?.value,
                exit: this.RuleForm.get('willExit')?.value
            }
        }
        this.isEdit = false;
    }
}
