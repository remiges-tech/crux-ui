import { HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppInfo, SchemaDetails, SchemaList, SelectedData, SliceInfo } from 'src/models/common-interfaces';
import { SchemaDetailResp, SchemaListResp } from 'src/models/request-response-inteface';
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
  private _toastr = inject(ToastrService);
  isShowBottomSection:boolean= false;
  schemasList?: SchemaList[];
  appList?: AppInfo[];
  sliceList?: SliceInfo[];
  classList?: string[];
  selectedData: SelectedData = {
    app: null,
    slice: null,
    class: null,
  }
  schemaData?: SchemaDetails;

  ngOnInit() {
    this.getSchemaList();
  }

  getSchemaList() {
    try {
      this._commonService.showLoader();
      this._schemaService.getBRESchemaList().subscribe((res: SchemaListResp) => {
        if (res?.status == CONSTANTS.SUCCESS) {
          if(res?.data?.schemas == null || res?.data?.schemas == undefined || res?.data?.schemas?.length == 0){
            this._toastr.error(CONSTANTS.DATA_NOT_FOUND, CONSTANTS.ERROR);
            return 
          }
          this.schemasList = res?.data?.schemas;
          this.appList = this._commonService.getAppNamesFromList(res?.data?.schemas);
          this._commonService.hideLoader();
        } else {
          this._toastr.error(res?.message, CONSTANTS.ERROR);
          this._commonService.hideLoader();
        }
      }, (err: any) => {
        this._toastr.error(err, CONSTANTS.ERROR)
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

  getClassList() {
    this.classList = undefined;
    this.schemaData = undefined;
    this.isShowBottomSection = false;
    if (this.schemasList && this.selectedData.app && this.selectedData.slice) {
      this.selectedData.class = null
      this.classList = this._commonService.getClassNameForSelectedSchemaData(this.schemasList, this.selectedData.app, this.selectedData.slice)
    }
  }

  getSchemaDetails() {
    this.schemaData = undefined
    this.isShowBottomSection = false;
    if (!this.schemasList || !this.selectedData.app || !this.selectedData.slice || !this.selectedData.class) {
      return;
    }
    try {
      let data = {
        params: new HttpParams().append('app', this.selectedData.app).append('slice', this.selectedData.slice).append('class', this.selectedData.class)
      }
      this.isShowBottomSection = true;
      this._commonService.showLoader()
      this._schemaService.getBRESchemaDetail(data).subscribe((res: SchemaDetailResp) => {
        if (res.status == CONSTANTS.SUCCESS) {
          if(res.data == null || res.data == undefined || this._commonService.isObjectEmpty(res.data)){
            this._toastr.error(CONSTANTS.DATA_NOT_FOUND, CONSTANTS.ERROR);
            return 
          }
          this.schemaData = res.data
          this._commonService.hideLoader();
        } else {
          this._toastr.error(res?.message, CONSTANTS.ERROR);
          this._commonService.hideLoader();
        }
      }, (err: any) => {
        this._toastr.error(err, CONSTANTS.ERROR)
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
    this.isShowBottomSection = false;
  }
}
