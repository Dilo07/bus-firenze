import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
export class ModalPenalComponent implements OnInit {
  public penalties = PENALTIES;
  public formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalPenalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicleId: number; fleetId: number }) { };

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      penalSelected: new FormControl('', Validators.required),
      datePenal: new FormControl(moment().toDate(), Validators.required)
    });
  }

  addPenal(): void {
    const penalSelected = this.formGroup.get('penalSelected').value;
    const datePenal = this.formGroup.get('datePenal').value;
    const penalInfo: PenalInfo = { penalType: penalSelected, date: moment(datePenal).format('YYYY-MM-DD') };
    this.dialogRef.close(penalInfo);
  }

}
