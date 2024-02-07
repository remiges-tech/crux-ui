import { Component, Input } from '@angular/core';
import { RTree, RuleDetails } from 'src/models/common-interfaces';
import { OperatorsUnicode } from 'src/services/constants.service';

@Component({
  selector: 'app-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  styleUrls: ['./workflow-detail.component.scss']
})
export class WorkflowDetailComponent {
  @Input({ required: true }) ruleDetails?: RuleDetails;
  OperatorsUnicode: any = OperatorsUnicode;

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

  Data: RTree[] = [
    {
      ruleActions: {
        tasks: ["christmassale", "vipsupport"],
        properties: [{ "shipby": "fedex" }, { "reprimand": "This has got to STOP!" }],
        thencall: "internationalrules",
        elsecall: "domesticrules",
        return: true,
        exit: false
      },
      rulePattern: [{
        attrname: "cat",
        op: "eq",
        attrval: "textbook"
      }, {
        attrname: "mrp",
        op: "ge",
        attrval: 2000
      }, {
        attrname: "ageinstock",
        op: "ge",
        attrval: 90
      }, {
        attrname: "invitefordiwali",
        op: "eq",
        attrval: true
      }]
  },
    {
    ruleActions: {
      tasks: ["christmassale", "vipsupport"],
      properties: [{ "shipby": "fedex" }, { "reprimand": "This has got to STOP!" }],
      thencall: "internationalrules",
      elsecall: "domesticrules",
      return: true,
      exit: false
    },
    rulePattern: [{
      attrname: "cat",
      op: "eq",
      attrval: "textbook"
    }, {
      attrname: "mrp",
      op: "ge",
      attrval: 2000
    }, {
      attrname: "ageinstock",
      op: "ge",
      attrval: 90
    }, {
      attrname: "invitefordiwali",
      op: "eq",
      attrval: true
    }],
    thenRuleset: [{
      ruleActions: {
        tasks: ["christmassale", "vipsupport"],
        properties: [{ "shipby": "fedex" }, { "reprimand": "This has got to STOP!" }],
        thencall: "internationalrules",
        elsecall: "domesticrules",
        return: true,
        exit: false
      },
      rulePattern: [{
        attrname: "cat",
        op: "eq",
        attrval: "textbook"
      }],
      thenRuleset:[
        {
          ruleActions: {
            tasks: ["christmassale", "vipsupport"],
            properties: [{ "shipby": "fedex" }, { "reprimand": "This has got to STOP!" }],
            thencall: "internationalrules",
            elsecall: "domesticrules",
            return: true,
            exit: false
          },
          rulePattern: [{
            attrname: "cat",
            op: "eq",
            attrval: "textbook"
          }, {
            attrname: "mrp",
            op: "ge",
            attrval: 2000
          }, {
            attrname: "ageinstock",
            op: "ge",
            attrval: 90
          }, {
            attrname: "invitefordiwali",
            op: "eq",
            attrval: true
          }]
        }
      ]
    }],
    elseRuleset: [{
      ruleActions: {
        tasks: ["christmassale", "vipsupport"],
        properties: [{ "shipby": "fedex" }, { "reprimand": "This has got to STOP!" }],
        thencall: "internationalrules",
        elsecall: "domesticrules",
        return: true,
        exit: false
      },
      rulePattern: [{
        attrname: "cat",
        op: "eq",
        attrval: "textbook"
      }, {
        attrname: "mrp",
        op: "ge",
        attrval: 2000
      }, {
        attrname: "ageinstock",
        op: "ge",
        attrval: 90
      }, {
        attrname: "invitefordiwali",
        op: "eq",
        attrval: true
      }],
      thenRuleset:[{
        ruleActions: {
          tasks: ["christmassale", "vipsupport"],
          properties: [{ "shipby": "fedex" }, { "reprimand": "This has got to STOP!" }],
          thencall: "internationalrules",
          elsecall: "domesticrules",
          return: true,
          exit: false
        },
        rulePattern: [{
          attrname: "cat",
          op: "eq",
          attrval: "textbook"
        }, {
          attrname: "mrp",
          op: "ge",
          attrval: 2000
        }, {
          attrname: "ageinstock",
          op: "ge",
          attrval: 90
        }, {
          attrname: "invitefordiwali",
          op: "eq",
          attrval: true
        }]
      }],
      elseRuleset:[{
        ruleActions: {
          tasks: ["christmassale", "vipsupport"],
          properties: [{ "shipby": "fedex" }, { "reprimand": "This has got to STOP!" }],
          thencall: "internationalrules",
          elsecall: "domesticrules",
          return: true,
          exit: false
        },
        rulePattern: [{
          attrname: "cat",
          op: "eq",
          attrval: "textbook"
        }, {
          attrname: "mrp",
          op: "ge",
          attrval: 2000
        }, {
          attrname: "ageinstock",
          op: "ge",
          attrval: 90
        }, {
          attrname: "invitefordiwali",
          op: "eq",
          attrval: true
        }]
      }]
    }]
  }]

}
