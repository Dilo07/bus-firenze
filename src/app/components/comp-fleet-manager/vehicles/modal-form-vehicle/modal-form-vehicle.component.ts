import { Component, Inject, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/components/domain/bus-firenze-domain';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Nations } from 'src/app/components/domain/bus-firenze-constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styles: [
  ]
})
export class ModalFormVehicleComponent implements OnInit {
  public nations = Nations;
  public FormGroup: FormGroup;

  private subscription: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalFormVehicleComponent>,
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { vehicle: Vehicle, fleetManagerId: number }) { }

  ngOnInit(): void {
    // se ci sono dati è un edit form altrimenti è un add form
    if (this.data.vehicle) {
      this.FormGroup = this.formBuilder.group({
        CtrlLpn: [this.data.vehicle.lpn, Validators.required],
        CtrlLpnNat: [this.data.vehicle.lpnNat, Validators.required],
        CtrlEuroClass: [this.data.vehicle.euroClass, Validators.min(1)],
        CtrlNumAxis: [this.data.vehicle.numAxis, Validators.min(1)],
        CtrlMaxWeight: [this.data.vehicle.maxWeight, Validators.min(1)]
      });
    } else {
      this.FormGroup = this.formBuilder.group({
        CtrlLpn: ['', Validators.required],
        CtrlLpnNat: [''],
        CtrlEuroClass: ['', Validators.min(1)],
        CtrlNumAxis: ['', Validators.min(1)],
        CtrlMaxWeight: ['', Validators.min(1)]
      });
    }
  }

  public addVehicle(): void {
    const newVehicle = new Vehicle();
    newVehicle.lpn = this.FormGroup.get('CtrlLpn').value;
    newVehicle.lpnNat = this.FormGroup.get('CtrlLpnNat').value;
    newVehicle.euroClass = this.FormGroup.get('CtrlEuroClass').value;
    newVehicle.numAxis = this.FormGroup.get('CtrlNumAxis').value;
    newVehicle.maxWeight = this.FormGroup.get('CtrlMaxWeight').value;
    this.subscription.push(this.vehicleService.addVehicle(newVehicle, this.data?.fleetManagerId).subscribe(
      () => null,
      (err) => {
        if (err.error) {
          this.showMessage(err.error.i18nKey, 'ERROR');
        }
      },
      () => { this.showMessage('VEHICLE.ADD_SUCCESS', 'INFO'); this.dialogRef.close(true); }
    ));
  }

  public updateVehicle(): void {
    const editVehicle = this.data;
    editVehicle.vehicle.euroClass = this.FormGroup.get('CtrlEuroClass').value;
    editVehicle.vehicle.numAxis = this.FormGroup.get('CtrlNumAxis').value;
    editVehicle.vehicle.maxWeight = this.FormGroup.get('CtrlMaxWeight').value;
    this.subscription.push(this.vehicleService.updateVehicle(editVehicle.vehicle, this.data?.fleetManagerId).subscribe(
      () => null,
      (err) => {
        if (err.error) {
          this.showMessage(err.error.i18nKey, 'ERROR');
        }
      },
      () => { this.showMessage('VEHICLE.EDIT_SUCCESS', 'INFO'); this.dialogRef.close(true); }));
  }

  private showMessage(i18nKey: string, level: string): void {

    this.snackBar.open(this.translate.instant(i18nKey),
      '✖',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: [level]
      });
  }

}
