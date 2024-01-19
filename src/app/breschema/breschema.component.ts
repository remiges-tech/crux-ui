import { Component, inject } from '@angular/core';
import { SchemaList } from 'src/models/common-interfaces';
import { BREschemaService } from 'src/services/breschema.service';
import { CommonService } from 'src/services/common.service';
import { CONSTANTS } from 'src/services/constants.service';

@Component({
  selector: 'app-breschema',
  templateUrl: './breschema.component.html',
  styleUrls: ['./breschema.component.scss']
})


export class BREschemaComponent {
  fileName: string = 'SchemaComponent';
  private _schemaService = inject(BREschemaService);
  private _commonService = inject(CommonService);
  schemasList?: SchemaList[];
  appList?: string[];
  sliceList?: string[];
  classList?: string[];
  selectedData: any = {
    app: null,
    slice: null,
    class: null,
  }


  ngOnInit() {
    this.getSchemaList();
  }

  getSchemaList() {
    try {
      this._schemaService.getBRESchemaList().subscribe((res: any) => {
        if (res?.status == CONSTANTS.SUCCESS) {
          this.schemasList = res?.data?.schemas;
          this.appList = this._commonService.getAppNamesFromList(res?.data?.schemas);
        }
      })
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getSchemaList',
        err: error
      })
    }
  }

  getSliceList() {
    this.clearCache();
    if (this.schemasList && this.selectedData.app && this.selectedData.applong) {
      this.selectedData.slice = null
      this.sliceList = this._commonService.getSliceNumbersForSelectedApp(this.schemasList, this.selectedData.app)
    }
  }

  getClassList(){
    this.classList = undefined;
    if (this.schemasList && this.selectedData.app && this.selectedData.slice){
      this.selectedData.class = null
      this.classList = this._commonService.getClassNameForSelectedSchemaData(this.schemasList, this.selectedData.app, this.selectedData.slice)
    }
  }

  clearCache() {
    this.sliceList = undefined;
  }
  
}
