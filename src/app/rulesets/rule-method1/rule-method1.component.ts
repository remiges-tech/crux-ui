import { Component, Input, inject } from '@angular/core';
import { RTree, RulePatternTerm } from 'src/models/common-interfaces';
import { CommonService } from 'src/services/common.service';
import { OperatorsUnicode } from 'src/services/constants.service';

@Component({
  selector: 'app-rule-method1',
  templateUrl: './rule-method1.component.html',
  styleUrls: ['./rule-method1.component.scss']
})
export class RuleMethod1Component {
  @Input({required:true}) Rule?:RTree;
  OperatorsUnicode: any = OperatorsUnicode;
  parentHovered: boolean = false;
  childHovered: boolean = false;
  
  private _commonService = inject(CommonService);

  toggleParentHover(state: boolean) {
    this.parentHovered = state;
  }

  toggleChildHover(state: boolean) {
    this.parentHovered = !state
    this.childHovered = state;
  }
  
  getMatchList(patterns: RulePatternTerm[]){
   return this._commonService.getMatchListService(patterns);
  }

}
