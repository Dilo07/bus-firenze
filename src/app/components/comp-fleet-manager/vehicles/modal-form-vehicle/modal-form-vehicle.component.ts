import { Component, Inject, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/components/domain/bus-firenze-domain';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONTRACT_TYPE, Nations } from 'src/app/components/domain/bus-firenze-constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Subscription } from 'rxjs';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';

@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styles: [
  ]
})
export class ModalFormVehicleComponent implements OnInit {
  public nations = Nations;
  public FormGroup: FormGroup;
  public contractType = CONTRACT_TYPE;
  public libDocument: File;

  private subscription: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalFormVehicleComponent>,
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService,
    private snackBar: SnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { vehicle: Vehicle, fleetManagerId: number }) { }

  ngOnInit(): void {
    // se ci sono dati è un edit form altrimenti è un add form
    if (this.data.vehicle) {
      this.FormGroup = this.formBuilder.group({
        CtrlLpn: [this.data.vehicle.lpn, Validators.pattern('^[A-Za-z0-9]+$')],
        CtrlLpnNat: [this.data.vehicle.lpnNat, Validators.required],
        CtrlEuroClass: [this.data.vehicle.euroClass, Validators.min(1)],
        CtrlNumAxis: [this.data.vehicle.numAxis, Validators.min(1)],
        CtrlMaxWeight: [this.data.vehicle.maxWeight, Validators.min(1)],
        CtrlContract: [this.data.vehicle.contractType, Validators.required],
        CtrlConsent: [this.data.vehicle.allowContacted]
      });
    } else {
      this.FormGroup = this.formBuilder.group({
        CtrlLpn: ['', Validators.pattern('^[A-Za-z0-9]+$')],
        CtrlLpnNat: ['IT', Validators.required],
        CtrlEuroClass: ['', Validators.min(1)],
        CtrlNumAxis: ['', Validators.min(1)],
        CtrlMaxWeight: ['', Validators.min(1)],
        CtrlContract: ['', Validators.required],
        CtrlConsent: [false],
        CtrlLibretto: ['', Validators.required]
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
    newVehicle.contractType = this.FormGroup.get('CtrlContract').value;
    newVehicle.allowContacted = this.FormGroup.get('CtrlConsent').value;
    this.subscription.push(this.vehicleService.addVehicle(newVehicle, this.data?.fleetManagerId).subscribe(
      () => null,
      (err) => {
        if (err.error) {
          this.snackBar.showMessage(err.error.i18nKey, 'ERROR');
        }
      },
      () => { this.snackBar.showMessage('VEHICLE.ADD_SUCCESS', 'INFO'); this.dialogRef.close(true); }
    ));
  }

  public updateVehicle(): void {
    const editVehicle = this.data;
    editVehicle.vehicle.euroClass = this.FormGroup.get('CtrlEuroClass').value;
    editVehicle.vehicle.numAxis = this.FormGroup.get('CtrlNumAxis').value;
    editVehicle.vehicle.maxWeight = this.FormGroup.get('CtrlMaxWeight').value;
    editVehicle.vehicle.allowContacted = this.FormGroup.get('CtrlConsent').value;
    this.subscription.push(this.vehicleService.updateVehicle(editVehicle.vehicle, this.data?.fleetManagerId).subscribe(
      () => null,
      (err) => {
        if (err.error) {
          this.snackBar.showMessage(err.error.i18nKey, 'ERROR');
        }
      },
      () => { this.snackBar.showMessage('VEHICLE.EDIT_SUCCESS', 'INFO'); this.dialogRef.close(true); }));
  }

  public uploadFile(event: any): void {
    const type = event.target.files[0].type;
    const size = event.target.files[0].size;
    if (size > 2097152) { // dimensione massima
      this.libDocument = null;
      this.FormGroup.patchValue({ CtrlLibretto: '' });
      this.snackBar.showMessage('FLEET-MANAGER.ERROR_SIZE', 'ERROR');
    } else if (type === 'application/pdf' || type === 'image/jpeg' || type === 'image/png') {
      this.libDocument = event.target.files[0];
      this.snackBar.showMessage('VEHICLE.UPLOAD_SUCC', 'INFO');
    } else { // formato errato
      this.libDocument = null;
      this.FormGroup.patchValue({ CtrlLibretto: '' });
      this.snackBar.showMessage('FLEET-MANAGER.ERROR_TYPE', 'ERROR');
    }
  }

}
