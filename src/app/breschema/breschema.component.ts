import { HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AppInfo, SchemaDetails, SchemaList } from 'src/models/common-interfaces';
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
  appList?: AppInfo[];
  sliceList?: string[];
  classList?: string[];
  selectedData: any = {
    app: null,
    slice: null,
    class: null,
  }
  schemaData?:SchemaDetails;

  ngOnInit() {
    this.getSchemaList();
  }

  getSchemaList() {
    try {
      this._schemaService.getBRESchemaList().subscribe((res: any) => {
        if (res?.status == CONSTANTS.SUCCESS) {
          this.schemasList = res?.data?.schemas;
          this.appList = this._commonService.getAppNamesFromList(res?.data?.schemas);
        }else{
          // Toaster here if list is not present
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
    if (this.schemasList && this.selectedData.app) {
      this.selectedData.slice = null
      this.sliceList = this._commonService.getSliceNumbersForSelectedApp(this.schemasList, this.selectedData.app)
    }
  }

  getClassList(){
    this.classList = undefined;
    this.schemaData = undefined
    if (this.schemasList && this.selectedData.app && this.selectedData.slice){
      this.selectedData.class = null
      this.classList = this._commonService.getClassNameForSelectedSchemaData(this.schemasList, this.selectedData.app, this.selectedData.slice)
    }
  }

  getSchemaDetails() {
    this.schemaData = undefined
    if (!this.schemasList || !this.selectedData.app || !this.selectedData.slice || !this.selectedData.class) {
      return;
    }
    try {
      let data = {
        params: new HttpParams().append('app', this.selectedData.app).append('slice', this.selectedData.slice).append('class', this.selectedData.class)
      }
      this._schemaService.getBRESchemaDetail(data).subscribe((res: any) => {
        if (res.status == CONSTANTS.SUCCESS) {
          this.schemaData = res.data
        } else {
          // toaster Here if Data is not present
        }
      })
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getSchemaDetails',
        err: error
      })
    }
  }

  clearCache() {
    this.sliceList = undefined;
    this.classList = undefined;
    this.schemaData = undefined;
  }
  
}
