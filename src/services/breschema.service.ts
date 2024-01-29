import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import * as Enums from './constants.service';
import { CommonService } from './common.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BREschemaService {
  fileName: string = 'SchemaService'
  _httpService = inject(HttpService);
  _commonService = inject(CommonService);
  constructor() { }

  getBRESchemaList(): any {
    try {
      let dataObj = {
        method: 'get',
        api_url: environment.apiUrl + Enums.CONSTANTS.BRESchema_LIST_API,
        local_json_file: '',
        param_data: {},
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getBRESchemaList',
        msg: resp
      });
      return resp;
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getBRESchemaList',
        msg: error
      });
    }
  }

  getBRESchemaDetail(obj: any): any {
    try {
      let dataObj = {
        method: 'get',
        api_url: environment.apiUrl + Enums.CONSTANTS.BRESchema_GET_API,
        local_json_file: '',
        param_data: obj,
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getBRESchemaDetail',
        msg: resp
      });
      return resp;
    } catch (error) {
      alert(error)
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getBRESchemaDetail',
        msg: error
      });
    }
  }

  getBREWorkflowList(): any {
    try {
      let dataObj = {
        method: 'get',
        api_url: environment.apiUrl + Enums.CONSTANTS.BRERulesets_LIST_API,
        local_json_file: '',
        param_data: {},
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getBREWorkflowList',
        msg: resp
      });
      return resp;
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getBREWorkflowList',
        msg: error
      });
    }
  }
}
