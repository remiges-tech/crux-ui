import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { RuleModalComponent } from 'src/app/workflow/rulesets/rule-modal/rule-modal.component';
import { environment } from 'src/environments/environment';
import { App, AppInfo, AppsList, RTree, RTreeRulesets, RealmSliceList, RulePatternTerm, RuleSet, RulesetsList, SchemaDetails, SchemaList, SliceInfo } from 'src/models/common-interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private production: boolean = environment.production;
  isLoading: boolean = false;
  subject = new Subject<any>();
  private _toastr = inject(ToastrService);

  constructor(private dialog: MatDialog) { }

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
      return { discription: `${item.longname} (${item.app})`, value: item.app }
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
      return { name: item.shortname, code: item.shortname }
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

  openRuleModal(rule: RTree, rulesetsList: RTreeRulesets, schemaData: SchemaDetails, workFlows: RulesetsList[], index: number, action: 'edit' | 'add' | 'workflow' = 'edit') {
    if (rule == undefined || rulesetsList == undefined || schemaData == undefined || index == undefined) {
      return;
    }

    let Ruleset = rulesetsList ? rulesetsList[rule.setname] : null;
    return this.dialog.open(RuleModalComponent, {
      width: '80%',
      data: { rule, Ruleset, rulesetsList, schemaData, workFlows, index, action }
    });
  }

  sliceObject(obj: any, start: number, end: number) {
    const slicedEntries = Object.entries(obj).slice(start, end);
    return Object.fromEntries(slicedEntries);
  }

  // JSON schema validation code to compare and match API response with model.
  checkValidJsonSchema(data: any, model: any): boolean {
    let errorStr: string[] = [];
    if (data == null || data === undefined || Object.keys(data).length === 0) {
      this._toastr.error('Data is empty.', 'ERROR');
      return false;
    }
    for (let key in model) {
      if (model[key].isRequired) {
        if (!data.hasOwnProperty(key)) {
          errorStr.push(`Data must have required property '${key}'.`);
        } else {
          if (model[key].type === 'object') {
            if (!this.checkValidJsonSchema(data[key], model[key].nestedData)) {
              errorStr.push(`Invalid data for nested object '${key}'.`);
            }
          } else if (model[key].type === 'array') {
            if (!Array.isArray(data[key])) {
              errorStr.push(`Required field '${key}' is not an array.`);
            } else if (data[key].length === 0) {
              errorStr.push(`Array '${key}' must not be empty.`);
            } else {
              let valid = true;
              data[key].forEach((subData: any) => {
                if (!this.checkValidJsonSchema(subData, model[key].nestedData)) {
                  valid = false;
                }
              });
              if (!valid) {
                errorStr.push(`Invalid data in array '${key}'.`);
              }
            }
          } else {
            if (typeof data[key] !== model[key].type) {
              errorStr.push(`Data property '${key}' must be '${model[key].type}' but got '${typeof data[key]}'.`);
            } else if (model[key].type === 'string' && data[key] === '') {
              errorStr.push(`Data property '${key}' cannot be empty.`);
            }
          }
        }
      }
    }

    // Display error msg on the screen.
    if (errorStr.length > 0) {
      errorStr.forEach((msg: string) => {
        this._toastr.error(msg, 'ERROR');
      });
      return false;
    }
    return true;
  }

}
