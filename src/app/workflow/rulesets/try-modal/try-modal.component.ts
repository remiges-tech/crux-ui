import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppInfo } from 'src/models/common-interfaces';
import { CommonService } from 'src/services/common.service';

@Component({
  selector: 'app-try-modal',
  templateUrl: './try-modal.component.html',
  styleUrls: ['./try-modal.component.scss']
})
export class TryModalComponent {


  constructor( 
    public dialogRef: MatDialogRef<TryModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) { } 
    
  
  onClose(): void { 
    this.dialogRef.close(); 
  } 

}
