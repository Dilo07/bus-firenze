import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-modal-otp',
  templateUrl: './modal-otp.component.html',
  styles: [
  ]
})
export class ModalOTPComponent {
  public otp: string;
  public readonly = false;
  public errorOtp = false;

  constructor(
    public dialogRef: MatDialogRef<ModalOTPComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { otp: string; cell: string }) { }

  public onChangeEvent(): void {
    if (this.otp.length === 6) {
      this.readonly = true;
      if (this.data.otp === Md5.hashStr(this.otp)) {
        this.dialogRef.close(true);
      } else {
        this.errorOtp = true;
        this.readonly = false;
      }
    }
  }

}
