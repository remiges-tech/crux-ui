import { Component, Input, inject } from '@angular/core';
import { RTree, RulePatternTerm } from 'src/models/common-interfaces';
import { CommonService } from 'src/services/common.service';
import { OperatorsUnicode } from 'src/services/constants.service';

@Component({
  selector: 'app-then-else-call',
  templateUrl: './then-else-call.component.html',
  styleUrls: ['./then-else-call.component.scss']
})
export class ThenElseCallComponent {
  @Input({required:true}) Rule?:RTree; 
  private _commonService = inject(CommonService);
  OperatorsUnicode: any = OperatorsUnicode;
  @Input() parentHovered: boolean = false;
 

  toggleParentHover(state: boolean) {
    this.parentHovered = state;
  }


  getMatchList(patterns: RulePatternTerm[]){
    return this._commonService.getMatchListService(patterns);
   }
}
