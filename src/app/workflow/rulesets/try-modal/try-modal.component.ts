import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Trace } from 'src/models/common-interfaces';
import { CommonService } from 'src/services/common.service';
import { CONSTANTS } from 'src/services/constants.service';
import { WFschemaService } from 'src/services/wfschema.service';

@Component({
  selector: 'app-try-modal',
  templateUrl: './try-modal.component.html',
  styleUrls: ['./try-modal.component.scss']
})
export class TryModalComponent {
  fileName: string = 'TryModalComponent';
  constants = CONSTANTS;
  private _commonService = inject(CommonService);
  private _schemaService = inject(WFschemaService);
  private _toastr = inject(ToastrService);
  tryData?: Trace;
  selectedTrace: any
  tracelevel: any = [
    { value: 1 },
    { value: 2 }
  ];

  constructor(
    public dialogRef: MatDialogRef<TryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  onClose(): void {
    this.dialogRef.close();
  }

  
  tryInstance() {
    if (this.selectedTrace == null || this.selectedTrace == undefined) {
      this._toastr.error('Please select the trace level', 'Error');
      return;
    }
    try {
      let obj = {
        trace: this.selectedTrace,
        slice: 12,
        app: "Star Mutual Fund(starMF)",
        workflow: "uccusercreation",
        step: "basicchk",
        stepfailed: false
      }
      this._commonService.showLoader();
      this._schemaService.wfinstancetry(obj).subscribe((res: Trace) => {
        this._commonService.hideLoader();
        this.tryData = res;
      }, (err: any) => {
        this._toastr.error(err, CONSTANTS.ERROR)
        this._commonService.hideLoader();
      })
    } catch (error) {
      this._commonService.hideLoader();
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'tryInstance',
        err: error
      })
    }
  }

  resetInstance() {
    this.tryData = undefined;
  }

}
