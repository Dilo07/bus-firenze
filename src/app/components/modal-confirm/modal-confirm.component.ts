import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styles: [``]
})
export class ModalConfirmComponent implements OnInit {
  public contractCode = '';

  constructor(
    public dialogRef: MatDialogRef<ModalConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {text: string, validForm: boolean}) { }

  ngOnInit(): void {
  }

}
