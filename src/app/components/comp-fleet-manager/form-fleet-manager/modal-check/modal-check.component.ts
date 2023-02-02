import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-check',
  templateUrl: './modal-check.component.html',
  styles: [
  ]
})
export class ModalCheckComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalCheckComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { i18nKey: string; vat?: string; fiscalCode?: string }
  ) { }

}
