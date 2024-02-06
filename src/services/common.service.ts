import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppInfo, SchemaList, SliceInfo } from 'src/models/common-interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private production: boolean = false;
  subject = new Subject<any>();

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

  getAppNamesFromList(list:SchemaList[]):AppInfo[]{
    let appsList = [...list.map((item:SchemaList) => {
        return {discription:`${item.applong} (${item.app})` , value:item.app}
    })]

    const unique = appsList.filter((Apps, index) => {
        return index === appsList.findIndex(fil => Apps.value === fil.value);
    });

    return unique;
}

getSliceNumbersForSelectedApp(list:SchemaList[],app:string):SliceInfo[]{
    const data = list.filter((item:SchemaList) => item.app.toUpperCase() == app.toUpperCase()) ?? null
    let sliceList = [...data.map((item:SchemaList) => {
        return {discription:`${item.slicedesc} (${item.slice})` , value:item.slice}
    })]

    const unique = sliceList.filter((Apps, index) => {
        return index === sliceList.findIndex(fil => Apps.value === fil.value);
    });

    return unique;
}

getClassNameForSelectedSchemaData(list:SchemaList[],app:string, slice:number){
    const data = list.filter((item:SchemaList) => item.app.toUpperCase() == app.toUpperCase() && item.slice == slice) ?? null;
    return [...data.map((item:SchemaList) => item.class)];
}

isObjectEmpty(objectName: any) {
    return (
      objectName &&
      Object.keys(objectName).length === 0 &&
      objectName.constructor === Object
    );
  };

}
