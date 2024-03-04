import { Component, Input, inject } from '@angular/core';
import { RTree, RTreeRulesets, RulePatternTerm } from 'src/models/common-interfaces';
import { CommonService } from 'src/services/common.service';
import { OperatorsUnicode } from 'src/services/constants.service';
import { MatDialog } from '@angular/material/dialog';
import { RuleModalComponent } from '../rule-modal/rule-modal.component';

@Component({
  selector: 'app-do-match',
  templateUrl: './do-match.component.html',
  styleUrls: ['./do-match.component.scss']
})
export class DoMatchComponent {
  @Input({ required: true }) Rule?: RTree;
  @Input({ required: true }) rulesets?: RTreeRulesets;
  OperatorsUnicode: any = OperatorsUnicode;
  @Input() childHovered: boolean = false;

  private _commonService = inject(CommonService);

  constructor(private dialog: MatDialog) { }

  openRuleModal(): void {
    if(this.Rule == undefined){
      return;
    }
    let ruleset = this.rulesets ? this.rulesets[this.Rule.setname] : null;
    this.dialog.open(RuleModalComponent, {
      width: '80%',
      data: { Rule: this.Rule, Ruleset: ruleset}
    });
  }

  toggleChildHover(state: boolean) {
    this.childHovered = state;
  }

  getMatchList(patterns: RulePatternTerm[]) {
    return this._commonService.getMatchListService(patterns);
  }

}
