import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { AddPenal, PenalType } from 'src/app/components/domain/bus-firenze-domain';
import { BillingItemsService } from 'src/app/services/billing-items.service';

@Component({
  selector: 'app-modal-penal',
  templateUrl: './modal-penal.component.html',
  styles: [
  ]
})
export class ModalPenalComponent implements OnInit {
  public formGroup: FormGroup;
  public listPenalType: PenalType[];
  public complete = true;

  constructor(
    public dialogRef: MatDialogRef<ModalPenalComponent>,
    private billingItemService: BillingItemsService,
    @Inject(MAT_DIALOG_DATA) public data: { vehicleId: number; fleetId: number }) { };

  async ngOnInit(): Promise<void> {
    this.complete = false;
    this.listPenalType = await firstValueFrom(this.billingItemService.getPenalType(true));
    this.complete = true;
    this.formGroup = new FormGroup({
      penalSelected: new FormControl(this.listPenalType[0].typeId, Validators.required),
      datePenal: new FormControl(moment().toDate(), Validators.required)
    });
  }

  public addPenal(): void {
    const penalSelected = this.formGroup.get('penalSelected').value;
    const datePenal = this.formGroup.get('datePenal').value;
    const penalInfo: AddPenal = { penalType: penalSelected, date: moment(datePenal).format('YYYY-MM-DD') };
    this.dialogRef.close(penalInfo);
  }

}
