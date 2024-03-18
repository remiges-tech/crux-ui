import { Component, Input } from '@angular/core';
import { RTree, RTreeRulesets, RulesetsList, SchemaDetails } from 'src/models/common-interfaces';
import { OperatorsUnicode } from 'src/services/constants.service';

@Component({
  selector: 'app-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  styleUrls: ['./workflow-detail.component.scss']
})
export class WorkflowDetailComponent {
  @Input({ required: true }) RTree?: RTree[];
  @Input({ required: true }) RTreeRulesets?: RTreeRulesets;
  @Input({ required: true }) schemaData?: SchemaDetails;
  @Input({ required: true }) WorksFlows?: RulesetsList[] = [];
  OperatorsUnicode: any = OperatorsUnicode;

}
