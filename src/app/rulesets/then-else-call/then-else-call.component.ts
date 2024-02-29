import { Component, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RTree, RulePatternTerm } from 'src/models/common-interfaces';
import { CommonService } from 'src/services/common.service';
import { OperatorsUnicode } from 'src/services/constants.service';
import { RuleModalComponent } from '../rule-modal/rule-modal.component';

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

  constructor(private dialog: MatDialog) { }

  openRuleModal(): void {
    const dialogRef = this.dialog.open(RuleModalComponent, {
      width: '80%',
      data: { Rule: this.Rule }
    });
  }
 

  toggleParentHover(state: boolean) {
    this.parentHovered = state;
  }


  getMatchList(patterns: RulePatternTerm[]){
    return this._commonService.getMatchListService(patterns);
   }
}