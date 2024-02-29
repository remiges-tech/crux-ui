import { HttpParams } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { App } from 'src/models/common-interfaces';
import { AppListResp, ReamlSliceListResp, ReplicateRealmResp } from 'src/models/request-response-inteface';
import { CommonService } from 'src/services/common.service';
import { CONSTANTS } from 'src/services/constants.service';
import { RealmsliceService } from 'src/services/realmslice.service';
interface SelectedDataReplicatedRealm{
  realmSlice: number | null,
  apps: App[] | null,
  desc: string | null
}

interface ReplicatedRealmPayload{
  copyof? : number,
  app? : string[],
  descr? : string
}

@Component({
  selector: 'app-replicate-realmslice',
  templateUrl: './replicate-realmslice.component.html',
  styleUrls: ['./replicate-realmslice.component.scss']
})
export class ReplicateRealmsliceComponent implements OnInit {
  fileName: string = 'ReplicateRealmsliceComponent'
  private _realmService = inject(RealmsliceService);
  private _commonService = inject(CommonService);
  private _toastr = inject(ToastrService);
  sliceList: number[] = [];
  appList: App[] = [];
  selectedData : SelectedDataReplicatedRealm = {
    realmSlice : null,
    apps : null,
    desc: null
  }

  ngOnInit() {
    this.getRealmsList();
  }

  getRealmsList(){
    try {
      this._commonService.showLoader();
      this._realmService.getRealmSliceList().subscribe((res: ReamlSliceListResp) => {
        if (res?.status == CONSTANTS.SUCCESS) {
          if(res?.data?.slices == null || res?.data?.slices == undefined || res?.data?.slices?.length == 0){
            this._toastr.error(CONSTANTS.DATA_NOT_FOUND, CONSTANTS.ERROR);
            return 
          }
          this.sliceList = this._commonService.getRealmSliceList(res?.data?.slices);
          this._commonService.hideLoader();
        } else {
          this._toastr.error(res?.message, CONSTANTS.ERROR);
          this._commonService.hideLoader();
        }
      }, (err: any) => {
        this._commonService.hideLoader();
        this._toastr.error(err, CONSTANTS.ERROR)
      })
    } catch (error) {
      this._commonService.hideLoader();
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getRealmsList',
        err: error
      })
    }
  }

  getAppsList(){
    this.appList = []
    this.selectedData.apps = null
    if (!this.sliceList || !this.selectedData.realmSlice) {
      return;
    }
    try {
      let data = {
        params: new HttpParams().append('id', this.selectedData.realmSlice)
      }
      this._commonService.showLoader();
      this._realmService.getRealmSliceApps(data).subscribe((res: AppListResp) => {
        if (res?.status == CONSTANTS.SUCCESS) {
          if(res?.data?.apps == null || res?.data?.apps == undefined || res?.data?.apps?.length == 0){
            this._toastr.error(CONSTANTS.DATA_NOT_FOUND, CONSTANTS.ERROR);
            return 
          }
          this.appList = this._commonService.getAppsList(res?.data?.apps);
          this._commonService.hideLoader();
        } else {
          this._toastr.error(res?.message, CONSTANTS.ERROR);
          this._commonService.hideLoader();
        }
      }, (err: any) => {
        this._commonService.hideLoader();
        this._toastr.error(err, CONSTANTS.ERROR)
      })
    } catch (error) {
      this._commonService.hideLoader();
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getAppsList',
        err: error
      })
    }
  }

  replicateRealmSlice(){
    
    try {
      let data:ReplicatedRealmPayload = {}

      if(this.selectedData.realmSlice){
        data['copyof'] = this.selectedData.realmSlice
      }
      if(this.selectedData.apps){
        data['app'] = this.selectedData.apps.map((app:App) => app.code)
      }
      if(this.selectedData.desc){
        data['descr'] = this.selectedData.desc
      }

      this._commonService.showLoader();
      this._realmService.postRealmSliceNew(data).subscribe((res: ReplicateRealmResp) => {
        if (res?.status == CONSTANTS.SUCCESS) {
          this._commonService.hideLoader();
          this._toastr.success(`ReamlSlice id : ${res.data.id}`,CONSTANTS.SUCCESS)
        } else {
          this._toastr.error(res?.message, CONSTANTS.ERROR);
          this._commonService.hideLoader();
        }
      }, (err: any) => {
        this._commonService.hideLoader();
        this._toastr.error(err, CONSTANTS.ERROR)
      })
    } catch (error) {
      this._commonService.hideLoader();
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getAppsList',
        err: error
      })
    }
  }

  resetForm(){
    this.selectedData = {
      realmSlice: null,
      apps: null,
      desc: null,
    }
    this.sliceList = []
    this.appList = []
    this.ngOnInit()
  }

}
