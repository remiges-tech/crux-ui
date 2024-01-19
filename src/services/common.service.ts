import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SchemaList } from 'src/models/common-interfaces';

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

  getAppNamesFromList(list:SchemaList[]):any[]{
    return [...new Set(list.map((item:SchemaList) =>item.applong + "("+ item.app +")"))];
}

getSliceNumbersForSelectedApp(list: SchemaList[], app: string): any[] {
    const data = list.filter((item: SchemaList) => item.app.toUpperCase() === app.toUpperCase()) ?? [];
    return [...data.map((item: SchemaList) => item.slice)];
  }

getClassNameForSelectedSchemaData(list:SchemaList[],app:string, slice:number){
    const data = list.filter((item:SchemaList) => item.app.toUpperCase() == app.toUpperCase() && item.slice == slice) ?? null;
    return [...data.map((item:SchemaList) => item.class)];
}

}
