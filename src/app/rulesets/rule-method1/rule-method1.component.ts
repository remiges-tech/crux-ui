import { Component } from '@angular/core';

@Component({
  selector: 'app-rule-method1',
  templateUrl: './rule-method1.component.html',
  styleUrls: ['./rule-method1.component.scss']
})
export class RuleMethod1Component {
  parentHovered: boolean = false;
  childHovered: boolean = false;

  toggleParentHover(state: boolean) {
    this.parentHovered = state;
  }

  toggleChildHover(state: boolean) {
    this.parentHovered = !state
    this.childHovered = state;
  }

}
