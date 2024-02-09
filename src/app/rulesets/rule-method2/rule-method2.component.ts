import { Component, Input, inject } from '@angular/core';
import { RTree, RulePatternTerm } from 'src/models/common-interfaces';
import { CommonService } from 'src/services/common.service';
import { OperatorsUnicode } from 'src/services/constants.service';

@Component({
  selector: 'app-rule-method2',
  templateUrl: './rule-method2.component.html',
  styleUrls: ['./rule-method2.component.scss']
})
export class RuleMethod2Component {
  @Input({required:true}) Rule?:RTree; 
  private _commonService = inject(CommonService);
  OperatorsUnicode: any = OperatorsUnicode;
  parentHovered: boolean = false;
  child1: boolean = false;
  child2: boolean = false;
  child3: boolean = false;
 

  toggleParentHover(state: boolean) {
    this.parentHovered = state;
  }


  getMatchList(patterns: RulePatternTerm[]){
    return this._commonService.getMatchListService(patterns);
   }
}
