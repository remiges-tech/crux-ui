import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
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
                return this._httpClient.post<any>(url, data).pipe(
                    catchError(this.handleError)
                );
            case dataObj.method == 'get':
                return this._httpClient.get<any>(url, data).pipe(
                    catchError(this.handleError)
                );
            default:
                return this._httpClient.post<any>(url, data).pipe(
                    catchError(this.handleError)
                );
        }
    }

    handleError(error: HttpErrorResponse) {
        if (error.status === 400) {
            return throwError(() => new Error('Bad Request.'));
        } else if (error.status === 401) {
            return throwError(() => new Error('Unauthorised User.'));
        } else if (error.status === 403) {
            return throwError(() => new Error('Forbidden Error'));
        } else if (error.status === 404) {
            return throwError(() => new Error('Data not available.'));
        }
        return throwError(() => new Error('Something went wrong, please try again later.'));
    }
}
