import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { App, RTree, RulePatternTerm, RuleSet, SchemaDetails } from 'src/models/common-interfaces';
import { OperatorsUnicode } from 'src/services/constants.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonService } from 'src/services/common.service';
interface DataInterface {
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
    isEdit: boolean = false;
    Rule?: RTree;
    Ruleset?: RuleSet;
    RuleForm !: FormGroup;
    OperatorsUnicode: any = OperatorsUnicode;
    operators = ['eq', 'gt', 'lt', 'ge', 'le', 'ne']
    schemaData?: SchemaDetails;
    // nextstepList?:App[]=[];
    schemaPatternDetails:DataInterface[]=[]
    constructor(@Inject(MAT_DIALOG_DATA) public data:
        { Rule: RTree, Ruleset: RuleSet },
        private dialog: MatDialogRef<RuleModalComponent>,
        private formBuilder: FormBuilder, private _commonService: CommonService) {
        this.schemaData = this._commonService.getFromLocalStorage('SCHEMADATA');
        // Building a form group for a rule
        this.RuleForm = this.formBuilder.group({
            rulePattern: this.formBuilder.array([]),
            nextSteps: new FormControl([]),
            nextStepTags: this.formBuilder.array([])
        })
        if (data) {
            this.Rule = data.Rule
            this.Rule.rulePattern.forEach((pattern: RulePatternTerm) => {
                this.addPatterns(pattern.attrname, pattern.op, pattern.attrval);
            })

            // this.Rule.ruleActions.tasks.concate(this.RuleForm.controls['nextSteps'].value)
            this.Ruleset = data.Ruleset

            console.log(this.RuleForm.value, 'RuleForm')
        }
    }


    test(){
      console.log( this.RuleForm.controls['nextSteps'].value)  
    }

    get rulePattern() {
        return this.RuleForm.get('rulePattern') as FormArray;
    }

    get nextSteps() {
        return this.RuleForm.get('nextSteps') as FormControl;
    }

    addPatterns(attrname?: string, op?: string, attrval?: any) {
        const rPattern = this.formBuilder.group({
            attrname: [{ value: attrname ?? '', disabled: !!attrname }, [Validators.required]],
            op: [op ?? 'null', [Validators.required]],
            attrval: [attrval ?? '', [Validators.required]],
        });
        this.rulePattern.push(rPattern)
        this.schemaPatternDetails.push(this.getTypeFromSchema(attrname ?? ''))
    }

    // Function to remove a field from the FormArray
    removerulePattern(index: number) {
        this.rulePattern.removeAt(index);
        this.schemaPatternDetails.splice(index, 1);
    }

    

    onPatternDrop(event: CdkDragDrop<any[]>) {
        moveItemInArray(this.rulePattern.controls, event.previousIndex, event.currentIndex);
    }

    getTypeFromSchema(attrname:string){
        let data:DataInterface = {
            type: 'str'
        }
        this.schemaData?.patternschema.attr.forEach((pattern:any) => {
            if(pattern.name == attrname){
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

    getOperatorsList(index:number){
        if(this.schemaPatternDetails[index].type == 'enum'){
            return ['eq','ne']
        }
        return this.operators;
    }

    getNextStepsOptions(tasks:string[]):any{
        let task =  [...tasks.map((item:string) => {
            return {name: item}
        })]
        return task;
    }

    // getNextStepsOptions(tasks:string[]){
    //     let task =  [...tasks.map((item:string) => {
    //                 return {name: item}
    //             })]
    //             return task
    // }

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
