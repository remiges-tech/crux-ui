import { Component, Input, inject } from '@angular/core';
import { RTree, RTreeRulesets, RulePatternTerm, RulesetsList, SchemaDetails } from 'src/models/common-interfaces';
import { CommonService } from 'src/services/common.service';
import { OperatorsUnicode } from 'src/services/constants.service';

@Component({
  selector: 'app-then-else-call',
  templateUrl: './then-else-call.component.html',
  styleUrls: ['./then-else-call.component.scss']
})
export class ThenElseCallComponent {
  @Input({required:true}) Rule?:RTree; 
  @Input({required:true}) rulesets?:RTreeRulesets; 
  @Input({required:true}) schemaData?:SchemaDetails; 
  @Input({required:true}) WorksFlows?:RulesetsList[] = [];
  private _commonService = inject(CommonService);
  OperatorsUnicode: any = OperatorsUnicode;
  @Input() parentHovered: boolean = false;

  constructor() { }

  openRuleModal(): void {
    this._commonService.openRuleModal(this.Rule!, this.rulesets!,this.schemaData!, this.WorksFlows!)
  }
 
  toggleParentHover(state: boolean) {
    this.parentHovered = state;
  }

  getMatchList(patterns: RulePatternTerm[]){
    return this._commonService.getMatchListService(patterns);
   }
}
