import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CONTRACT_TYPE, worldNations } from 'src/app/components/domain/bus-firenze-constants';
import { Vehicle } from 'src/app/components/domain/bus-firenze-domain';
import { VehicleService } from 'src/app/services/vehicle.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';

@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styles: [],
  animations: [
    trigger('slideInOut', [
      state(
        'on',
        style({
          opacity: 1
        })
      ),
      state(
        'off',
        style({
          height: '0',
          opacity: 0
        })
      ),
      transition('on => off', animate('400ms')),
      transition('off => on', animate('400ms')),
    ]),
  ],
})
export class ModalFormVehicleComponent implements OnInit {
  public nations = worldNations;
  public filteredList = this.nations.slice();
  public formGroup: FormGroup;
  public contractType = CONTRACT_TYPE;
  public libDocument: File;
  public depositDocument: File;
  public complete = true;
  public helper: 'on' | 'off';

  private subscription: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalFormVehicleComponent>,
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService,
    private snackBar: SnackBar,
    @Inject('ibanData') public iban: string,
    @Inject(MAT_DIALOG_DATA) public data: { vehicle: Vehicle; fleetManagerId: number }) { }

  ngOnInit(): void {
    // se ci sono dati è un edit form altrimenti è un add form
    if (this.data.vehicle) {
      this.formGroup = this.formBuilder.group({
        ctrlLpn: [this.data.vehicle.lpn, Validators.pattern('^[A-Za-z0-9]+$')],
        ctrlLpnNat: [this.data.vehicle.lpnNat, Validators.required],
        ctrlEuroClass: [this.data.vehicle.euroClass, Validators.min(1)],
        ctrlNumAxis: [this.data.vehicle.numAxis, Validators.min(1)],
        ctrlMaxWeight: [this.data.vehicle.maxWeight, Validators.min(1)],
        ctrlContract: [this.data.vehicle.contractType, Validators.required],
        ctrlConsent: [this.data.vehicle.allowContacted]
      });
      this.helper = 'off';
    } else {
      this.formGroup = this.formBuilder.group({
        ctrlLpn: ['', Validators.pattern('^[A-Za-z0-9]+$')],
        ctrlLpnNat: ['IT', Validators.required],
        ctrlEuroClass: ['', Validators.min(1)],
        ctrlNumAxis: ['', Validators.min(1)],
        ctrlMaxWeight: ['', Validators.min(1)],
        ctrlContract: [this.contractType.rent, Validators.required],
        ctrlConsent: [false],
        ctrlLibretto: ['', Validators.required]
      });
      this.helper = 'on';
    }
  }

  public addVehicle(): void {
    const newVehicle = new Vehicle();
    newVehicle.lpn = this.formGroup.get('ctrlLpn').value;
    newVehicle.lpnNat = this.formGroup.get('ctrlLpnNat').value;
    newVehicle.euroClass = this.formGroup.get('ctrlEuroClass').value;
    newVehicle.numAxis = this.formGroup.get('ctrlNumAxis').value;
    newVehicle.maxWeight = this.formGroup.get('ctrlMaxWeight').value;
    newVehicle.contractType = this.formGroup.get('ctrlContract').value;
    newVehicle.allowContacted = this.formGroup.get('ctrlConsent').value;
    this.subscription.push(
      this.vehicleService.addVehicle(this.depositDocument, this.libDocument, newVehicle, this.data?.fleetManagerId).subscribe({
        error: (err) => {
          if (err.error) { this.snackBar.showMessage(err.error.i18nKey, 'ERROR'); }
        },
        complete: () => { this.snackBar.showMessage('VEHICLE.ADD_SUCCESS', 'INFO'); this.dialogRef.close(true); }
      }));
  }

  public updateVehicle(): void {
    const editVehicle = this.data;
    editVehicle.vehicle.euroClass = this.formGroup.get('ctrlEuroClass').value;
    editVehicle.vehicle.numAxis = this.formGroup.get('ctrlNumAxis').value;
    editVehicle.vehicle.maxWeight = this.formGroup.get('ctrlMaxWeight').value;
    editVehicle.vehicle.allowContacted = this.formGroup.get('ctrlConsent').value;
    this.subscription.push(this.vehicleService.updateVehicle(editVehicle.vehicle, this.data?.fleetManagerId).subscribe({
      error: (err) => {
        if (err.error) { this.snackBar.showMessage(err.error.i18nKey, 'ERROR'); }
      },
      complete: () => { this.snackBar.showMessage('VEHICLE.EDIT_SUCCESS', 'INFO'); this.dialogRef.close(true); }
    }));
  }

  public uploadFile(event: any, isLib: boolean): void {
    if (event.target.files.length > 0) {
      const type = event.target.files[0].type;
      const size = event.target.files[0].size;
      if (type !== 'application/pdf' && type !== 'image/jpeg' && type !== 'image/png') { // formato errato
        isLib ? this.libDocument = null : this.depositDocument = null;
        if (isLib) { this.formGroup.patchValue({ ctrlLibretto: '' }); }
        this.snackBar.showMessage('FLEET-MANAGER.ERROR_TYPE', 'ERROR');
      } else if (size > 2097152) { // dimensione massima
        isLib ? this.libDocument = null : this.depositDocument = null;
        if (isLib) { this.formGroup.patchValue({ ctrlLibretto: '' }); }
        this.snackBar.showMessage('FLEET-MANAGER.ERROR_SIZE', 'ERROR');
      } else {
        isLib ? this.libDocument = event.target.files[0] : this.depositDocument = event.target.files[0];
        this.snackBar.showMessage('VEHICLE.UPLOAD_SUCC', 'INFO');
      }
    }
  }

}
