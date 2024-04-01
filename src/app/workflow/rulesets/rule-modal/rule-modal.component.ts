import { Component, Inject, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Property, RTree, RTreeRulesets, RulePatternTerm, RuleSet, RulesetsList, SchemaDetails, SchemaPatternAttr } from 'src/models/common-interfaces';
import { OperatorsUnicode, AttrDataTypes, CONSTANTS } from 'src/services/constants.service';
import { checkConstraints } from 'src/customValidators/rule.contraints.service';
import { BREschemaService } from 'src/services/breschema.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/services/common.service';
import { RulesetUpdateResp } from 'src/models/request-response-inteface';
@Component({
    selector: 'app-rule-modal',
    templateUrl: './rule-modal.component.html',
    styleUrls: ['./rule-modal.component.scss']
})
export class RuleModalComponent {
    private _schemaService = inject(BREschemaService);
    private _toastr = inject(ToastrService);
    private _commonService = inject(CommonService);
    fileName = 'RuleModalComponent'
    isEdit: boolean = false;
    index?: number;
    Rule?: RTree;
    RulesetsList: RTreeRulesets = {}
    Ruleset?: RuleSet;
    workFlow?: RulesetsList[];
    updatedThen?: RTree[]
    updatedElse?: RTree[]
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
        { rule: RTree, Ruleset: RuleSet, rulesetsList: RTreeRulesets, schemaData: SchemaDetails, workFlows: RulesetsList[], index: number },
        private dialog: MatDialogRef<RuleModalComponent>,
        private formBuilder: FormBuilder) {

        if (data) {
            this.Rule = data.rule
            this.updatedThen = data.rule.thenRuleset
            this.updatedElse = data.rule.elseRuleset
            this.RulesetsList = data.rulesetsList
            this.Ruleset = data.Ruleset
            this.SchemaData = data.schemaData
            this.workFlow = data.workFlows
            this.index = data.index;
            this.patchRuleValues();
            this.exitChangeHandler();
        }
    }

    get rulepattern() {
        return this.RuleForm.get('rulepattern') as FormArray;
    }

    get isDone() {
        return this.RuleForm.get('isDone')
    }

    get properties() {
        return this.RuleForm.get('properties') as FormArray;
    }

    get tasks() {
        return this.RuleForm.get('tasks')
    }

    get thenCall() {
        return this.RuleForm.get('thenCall')
    }

    get elseCall() {
        return this.RuleForm.get('elseCall')
    }

    get willReturn() {
        return this.RuleForm.get('willReturn')
    }

    get willExit() {
        return this.RuleForm.get('willExit')
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
            const attrval = this.getSchemaDetailsByAttrName(pattern.attrname)?.valtype == AttrDataTypes.typeTs ? new Date(pattern.attrval) : pattern.attrval
            this.addPatterns(pattern.attrname, pattern.op, attrval);
        })
        this.RuleForm.patchValue({ tasks: this.Rule.ruleActions.tasks, willReturn: this.Rule.ruleActions.return, willExit: this.Rule.ruleActions.exit, thenCall: this.Rule.ruleActions.thencall, elseCall: this.Rule.ruleActions.elsecall })
        this.Rule.ruleActions.properties.forEach((property: Property) => {
            this.addPropeties(property.name, property.val)
            if (property.name == 'done') {
                this.isDone?.patchValue(true);
                this.tasks?.disable();
                this.properties?.disable();
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
            if (((attribute.valtype == AttrDataTypes.typeBool || attribute.valtype == AttrDataTypes.typeEnum) && this.isAttrNameUsed(attribute.name, index)) || this.isOperatorUsed(attribute.name, 'eq', index)) {
                return;
            }
            attrNameList.push(attribute.name)
        })

        return attrNameList
    }

    getOperatorsList(index: number) {
        let schemaDetails = this.getSchemaDetailsByIndex(index)
        let isUsed = this.rulepattern.value.some((pattern: any, i: number) => pattern.attrname == schemaDetails?.name && pattern.op != 'eq' && i != index)
        if (schemaDetails?.valtype == AttrDataTypes.typeEnum || schemaDetails?.valtype == AttrDataTypes.typeBool) {
            return ['eq', 'ne']
        }
        return isUsed ? this.operators.filter((op: string) => op != 'eq' && op != 'ne') : this.operators;
    }

    getRulesetsList(callType: string) {
        let workflowList = this.workFlow
        if (callType == 'then') {
            workflowList = workflowList?.filter((workflow: any) => workflow.name != this.elseCall?.value)
        } else {
            workflowList = workflowList?.filter((workflow: any) => workflow.name != this.thenCall?.value)
        }

        return workflowList;
    }

    onAttrNameChangeHandler(index: number) {
        this.rulepattern.controls[index].patchValue({ op: '', attrval: '' })
        if (this.getSchemaDetailsByIndex(index)?.valtype == AttrDataTypes.typeBool) {
            this.rulepattern.controls[index].get('attrval')?.patchValue(false)
        }
    }

    propertyNameChangeHandler(index: number) {
        this.properties.controls[index].patchValue({ val: '' });
    }

    markTaskDoneHandler() {
        this.properties?.value.forEach((index: number) => this.removePropertiesByIndex(index))
        this.tasks?.patchValue([])
        this.thenCall?.patchValue("")
        this.updatedThen = undefined
        this.elseCall?.patchValue("")
        this.updatedElse = undefined
        if (this.isDone?.value) {
            this.tasks?.disable();
            this.thenCall?.disable();
            this.elseCall?.disable();
            this.addPropeties('done', 'true');
            this.properties?.disable();
        } else {
            this.thenCall?.enable();
            this.elseCall?.enable();
            this.properties?.enable();
            this.tasks?.enable();
        }
    }

    async thenChangeHandler() {
        if (!this.elseCall?.value) {
            this.elseCall?.patchValue("")
        }
        let data = await this._schemaService.buildRtree(this.Ruleset?.app!, this.Ruleset?.slice!, this.Ruleset?.class!, this.thenCall?.value, this.RulesetsList);
        if (data instanceof Error) {
            throw data;
        }
        this.updatedThen = data
    }

    async elseChangeHandler() {
        if (!this.thenCall?.value) {
            this.thenCall?.patchValue("")
        }
        let data = await this._schemaService.buildRtree(this.Ruleset?.app!, this.Ruleset?.slice!, this.Ruleset?.class!, this.elseCall?.value, this.RulesetsList);
        if (data instanceof Error) {
            throw data;
        }
        this.updatedElse = data
    }

    exitChangeHandler() {
        if (this.willExit?.value) {
            this.willReturn?.patchValue(false);
            this.willReturn?.disable()
        } else {
            this.willReturn?.enable()
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
        this.dialog.close(this.Rule);
    }

    onEditHandler() {
        if (this.Ruleset?.is_active) {
            this._toastr.warning(CONSTANTS.CANNOT_EDIT_RULESET_MSG, CONSTANTS.WARNING)
            return;
        }

        this.isEdit = true;
    }

    saveHandler() {
        if (this.RuleForm.invalid || this.index == undefined) {
            return
        }

        let rulePatterns: RulePatternTerm[] = [];

        this.RuleForm.value.rulepattern.forEach((pattern: RulePatternTerm) => {
            let originalPattern: RulePatternTerm = pattern
            if (this.getSchemaDetailsByAttrName(pattern.attrname)?.valtype == AttrDataTypes.typeTs) {
                originalPattern.attrval = new Date(pattern.attrval).toISOString()
            }
            rulePatterns.push(originalPattern)
        })

        this.Rule = {
            setname: this.Rule!.setname,
            rulePattern: rulePatterns,
            ruleActions: {
                tasks: this.tasks?.value,
                properties: this.properties.value
            }
        }

        if (this.thenCall?.value != undefined && this.updatedThen != undefined) {
            this.Rule.ruleActions.thencall = this.thenCall?.value
            this.Rule.thenRuleset = this.updatedThen
        }

        if (this.elseCall?.value != undefined && this.updatedElse != undefined) {
            this.Rule.ruleActions.elsecall = this.elseCall?.value
            this.Rule.elseRuleset = this.updatedElse
        }

        if (this.willReturn?.value != undefined) {
            this.Rule.ruleActions.return = this.willReturn?.value
        }

        if (this.willExit?.value != undefined) {
            this.Rule.ruleActions.exit = this.willExit?.value
        }

        // Separated rules from rulesets and rename it to flowrules
        const { rules, ...updatedRuleset }: any = { ...this.Ruleset, flowrules: this.Ruleset?.rules };

        // Update the current rules value
        updatedRuleset.flowrules[this.index] = { rulePattern: this.Rule.rulePattern, ruleActions: this.Rule.ruleActions }

        try {

            this._commonService.showLoader()
            this._schemaService.updateWorkflowRule(updatedRuleset).subscribe((res: RulesetUpdateResp) => {
                if (res.status == CONSTANTS.SUCCESS) {
                    this._toastr.success(res?.message, CONSTANTS.SUCCESS);
                    this._commonService.hideLoader();
                    this.isEdit = false;
                } else {
                    this._toastr.error(res?.message, CONSTANTS.ERROR);
                    this._commonService.hideLoader();
                }
            }, (err: any) => {
                this._toastr.error(err, CONSTANTS.ERROR)
                this._commonService.hideLoader();
            })
        } catch (error) {
            this._commonService.log({
                fileName: this.fileName,
                functionName: 'saveHandler',
                err: error
            })
        }
    }
}
