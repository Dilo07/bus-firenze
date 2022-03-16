import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBar } from '@npt/npt-template';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styles: [``]
})
export class ModalConfirmComponent {
  public contractCode = new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]);
  public fileDeposit = null;
  public complete = true;

  constructor(
    public dialogRef: MatDialogRef<ModalConfirmComponent>,
    private snackBar: SnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { text: string; validForm: boolean; uploadDoc?: string }) { }


  public uploadDeposit(fileUpload: any): void { // funzione caricamento file
    const file = fileUpload.target.files[0];
    const size = fileUpload.target.files[0].size;
    const type = fileUpload.target.files[0].type;
    if (type !== 'application/pdf' && type !== 'image/jpeg' && type !== 'image/png') { // formato errato
      if (this.fileDeposit) { this.fileDeposit = null; }
      this.snackBar.showMessage('FLEET-MANAGER.ERROR_TYPE', 'ERROR');
    } else if (size > 2097152) { // dimensione massima
      if (this.fileDeposit) { this.fileDeposit = null; }
      this.snackBar.showMessage('FLEET-MANAGER.ERROR_SIZE', 'ERROR');
    } else {
      this.fileDeposit = file;
      this.snackBar.showMessage('VEHICLE.UPLOAD_SUCC', 'INFO');
    }
  }
}
