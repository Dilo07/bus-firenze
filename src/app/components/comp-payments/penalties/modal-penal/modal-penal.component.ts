import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
import { PENALTIES } from 'src/app/components/domain/bus-firenze-constants';
import { PenalInfo } from 'src/app/components/domain/bus-firenze-domain';

@Component({
  selector: 'app-modal-penal',
  templateUrl: './modal-penal.component.html',
  styles: [
  ]
})
export class ModalPenalComponent {
  public penalSelected: number;
  public penalties = PENALTIES;
  public datePenal = moment().toDate();

  constructor(
    public dialogRef: MatDialogRef<ModalPenalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicleId: number; fleetId: number }) { };

  addPenal(): void {
    const penalInfo: PenalInfo = { penalType: this.penalSelected, date: moment(this.datePenal).format('YYYY-MM-DD') };
    this.dialogRef.close(penalInfo);
  }

}
