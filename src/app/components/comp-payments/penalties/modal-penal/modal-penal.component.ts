import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-penal',
  templateUrl: './modal-penal.component.html',
  styles: [
  ]
})
export class ModalPenalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalPenalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicleId: Number; fleetId: number }) {};

  ngOnInit(): void {
  }

}
