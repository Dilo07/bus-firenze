import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PENALTIES } from 'src/app/components/domain/bus-firenze-constants';

@Component({
  selector: 'app-modal-penal',
  templateUrl: './modal-penal.component.html',
  styles: [
  ]
})
export class ModalPenalComponent {
  public penalSelected: number;
  public penalties = PENALTIES;

  constructor(
    public dialogRef: MatDialogRef<ModalPenalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicleId: Number; fleetId: number }) {};

}
