import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
    constructor(private _httpClient: HttpClient, private _commonService: CommonService) { }

    fetchData(dataObj: any): Observable<any> {
        let url = dataObj.api_url;
        let data = dataObj.param_data;
        switch (true) {
            case dataObj.method == 'post':
                this._commonService.log(data);
                return this._httpClient.post<any>( url, data);
            case dataObj.method == 'get':
                return this._httpClient.get<any>(url, data);
            default:
                return this._httpClient.post<any>(url, data);
        }
    }
}
