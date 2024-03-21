import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RTree, RTreeRulesets, RulePatternTerm, RulesetsList, SchemaDetails } from 'src/models/common-interfaces';
import { CommonService } from 'src/services/common.service';
import { OperatorsUnicode } from 'src/services/constants.service';

@Component({
  selector: 'app-do-match',
  templateUrl: './do-match.component.html',
  styleUrls: ['./do-match.component.scss']
})
export class DoMatchComponent {
  @Input({ required: true }) Rule?: RTree;
  @Input({ required: true }) rulesets?: RTreeRulesets;
  @Input({ required: true }) schemaData?: SchemaDetails;
  @Input({ required: true }) WorksFlows?: RulesetsList[]=[];
  @Output() updateRule = new EventEmitter<RTree>();
  OperatorsUnicode: any = OperatorsUnicode;
  @Input() childHovered: boolean = false;

  private _commonService = inject(CommonService);

  constructor() { }

  openRuleModal(): void {
    let updatedRule = this._commonService.openRuleModal(this.Rule!, this.rulesets!,this.schemaData!, this.WorksFlows!)
    updatedRule?.afterClosed().subscribe((res:RTree) => {
      this.Rule = res
      console.log(this.Rule)
      this.updateRule.emit(this.Rule)
    })
  }

  toggleChildHover(state: boolean) {
    this.childHovered = state;
  }

  getMatchList(patterns: RulePatternTerm[]) {
    return this._commonService.getMatchListService(patterns);
  }

}
