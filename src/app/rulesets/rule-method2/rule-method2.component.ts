import { Component } from '@angular/core';

@Component({
  selector: 'app-rule-method2',
  templateUrl: './rule-method2.component.html',
  styleUrls: ['./rule-method2.component.scss']
})
export class RuleMethod2Component {

  parentHovered: boolean = false;
  childHovered: boolean = false;
  child1: boolean = false;
  child2: boolean = false;
  child3: boolean = false;
  child4: boolean = false;
  child5: boolean = false;
  elseblock: boolean = false;
  nestedIf: boolean = false;

  toggleParentHover(state: boolean) {
    this.parentHovered = state;
  }

  toggleChildHover(state: boolean) {
    this.parentHovered = !state
    this.childHovered = state;
  }
}
