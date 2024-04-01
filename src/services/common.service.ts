import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { RuleModalComponent } from 'src/app/workflow/rulesets/rule-modal/rule-modal.component';
import { App, AppInfo, AppsList, RTree, RTreeRulesets, RealmSliceList, RulePatternTerm, RulesetsList, SchemaDetails, SchemaList, SliceInfo } from 'src/models/common-interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private production: boolean = false;
  isLoading: boolean = false;
  subject = new Subject<any>();

  constructor(private dialog: MatDialog){}

  log(value: any, type?: string) {
    if (!this.production) {
      if (type === 'error')
        console.error(value);
      else if (type === 'warn')
        console.warn(value);
      else
        console.log(value);
    }
  }

  getAppNamesFromList(list: SchemaList[]): AppInfo[] {
    let appsList = [...list.map((item: SchemaList) => {
      return { discription: `${item.applong} (${item.app})`, value: item.app }
    })]

    const unique = appsList.filter((Apps, index) => {
      return index === appsList.findIndex(fil => Apps.value === fil.value);
    });

    return unique;
  }

  getSliceNumbersForSelectedApp(list: SchemaList[], app: string): SliceInfo[] {
    const data = list.filter((item: SchemaList) => item.app.toUpperCase() == app.toUpperCase()) ?? null
    let sliceList = [...data.map((item: SchemaList) => {
      return { discription: `${item.slicedesc} (${item.slice})`, value: item.slice }
    })]

    const unique = sliceList.filter((Apps, index) => {
      return index === sliceList.findIndex(fil => Apps.value === fil.value);
    });

    return unique;
  }

  getClassNameForSelectedSchemaData(list: SchemaList[], app: string, slice: number) {
    const data = list.filter((item: SchemaList) => item.app.toUpperCase() == app.toUpperCase() && item.slice == slice) ?? null;
    return [...data.map((item: SchemaList) => item.class)];
  }

  getRealmSliceList(list: RealmSliceList[]): any[] {
    let realmList = [...list.map((item: RealmSliceList) => {
      return { discription: `${item.descr} (${item.id})`, value: item.id }
    })]

    return realmList;
  }

  getAppsList(list: AppsList[]): App[] {
    let realmList = [...list.map((item: AppsList) => {
      return { name: item.name, code: item.name }
    })]

    return realmList;
  }

  isObjectEmpty(objectName: any) {
    return (
      objectName &&
      Object.keys(objectName).length === 0 &&
      objectName.constructor === Object
    );
  };

  getMatchListService(patterns: RulePatternTerm[]) {
    let count = 0;
    let updatedPattern: RulePatternTerm[] = [];
    patterns.forEach((pattern: RulePatternTerm) => {
      if (count <= 1) {
        updatedPattern.push(pattern);
      }
      count++;
    })
    return updatedPattern;
  }

  showLoader() {
    this.isLoading = true;
  }

  hideLoader() {
    this.isLoading = false;
  }

  openRuleModal(rule: RTree, rulesetsList: RTreeRulesets, schemaData:SchemaDetails, workFlows:RulesetsList[],index:number) {
    if(rule == undefined || rulesetsList == undefined || schemaData == undefined || workFlows ==  undefined || index == undefined){
      return;
    }
    let Ruleset = rulesetsList ? rulesetsList[rule.setname] : null;
    return this.dialog.open(RuleModalComponent, {
      width: '80%',
      data: { rule, Ruleset, rulesetsList, schemaData, workFlows,index}
    });
  }
  
}
