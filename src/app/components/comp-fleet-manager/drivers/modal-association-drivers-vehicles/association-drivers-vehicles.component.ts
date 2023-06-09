import { Component, Inject, OnDestroy } from '@angular/core';
import { DriverVehicle } from 'src/app/components/domain/bus-firenze-domain';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DriverService } from 'src/app/services/driver.service';
import { Subscription } from 'rxjs';
import { SnackBar } from '@npt/npt-template';

@Component({
  selector: 'app-association-drivers-vehicles',
  templateUrl: './association-drivers-vehicles.component.html',
  styles: [`
  mat-selection-list {
    max-height: 400px;
    overflow: auto;
  }
  `]
})
export class AssociationDriversVehiclesComponent implements OnDestroy {
  public selectedElement: DriverVehicle[] = [];
  public arrayForDB: DriverVehicle[];

  private subscription: Subscription[] = [];

  constructor(
    private driverService: DriverService,
    private snackBar: SnackBar,
    public dialogRef: MatDialogRef<AssociationDriversVehiclesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { driverVehicle: DriverVehicle[]; idVehicle: number; idDriver: number; fleetManagerId?: number }
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public saveAssociation(): void {
    this.arrayForDB = [];
    this.data.driverVehicle.forEach(element => {
      if (!element.status) {
        // verifica gli status false di ogni elemento, se li trova nei selezionati allora imposta a true e aggiunge
        if (this.selectedElement.find(selectedElement => element.id === selectedElement.id)) {
          element.status = true;
          this.arrayForDB.push(element);
        }
      } else {
        // verifica gli status true di ogni elemento, se non li trova nei selezionati allora imposta a false e aggiunge
        if (!this.selectedElement.find(selectedElement => element.id === selectedElement.id)) {
          element.status = false;
          this.arrayForDB.push(element);
        }
      }
    });
    if (this.arrayForDB.length > 0) { // se ci sono state modifiche chiama l'api altrimenti no
      if (!this.data.idVehicle) {
        this.subscription.push(this.driverService.updateVehiclesByDriver(this.arrayForDB, this.data.idDriver, this.data.fleetManagerId).subscribe(
          () => {
            this.snackBar.showMessage('DRIVERS.ASSOCIATION_SUCCESS', 'INFO');
            this.dialogRef.close(true);
          }
        ));
      } else {
        this.subscription.push(this.driverService.updateDriversByVehicle(this.arrayForDB, this.data.idVehicle, this.data.fleetManagerId).subscribe(
          () => {
            this.snackBar.showMessage('DRIVERS.ASSOCIATION_SUCCESS', 'INFO');
            this.dialogRef.close(true);
          }
        ));
      }
    } else {
      this.dialogRef.close(false);
    }
  }

}
