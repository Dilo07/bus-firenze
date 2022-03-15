import { Component, Inject, OnInit } from '@angular/core';
import { DriverVehicle } from 'src/app/components/domain/bus-firenze-domain';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DriverService } from 'src/app/services/driver.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';

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
export class AssociationDriversVehiclesComponent {
  public selectedElement: DriverVehicle[] = [];
  public arrayForDB: DriverVehicle[];

  constructor(
    private driverService: DriverService,
    private snackBar: SnackBar,
    public dialogRef: MatDialogRef<AssociationDriversVehiclesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { driverVehicle: DriverVehicle[]; idVehicle: number; idDriver: number; fleetManagerId: number }
  ) { }

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
        this.driverService.updateVehiclesByDriver(this.arrayForDB, this.data.idDriver, this.data.fleetManagerId).subscribe(
          () => {
            this.snackBar.showMessage('DRIVERS.ASSOCIATION_SUCCESS', 'INFO');
            this.dialogRef.close(true);
          },
          () => null
        );
      } else {
        this.driverService.updateDriversByVehicle(this.data.idVehicle, this.arrayForDB, this.data.fleetManagerId).subscribe(
          () => {
            this.snackBar.showMessage('DRIVERS.ASSOCIATION_SUCCESS', 'INFO');
            this.dialogRef.close(true);
          },
          () => null
        );
      }
    } else {
      this.dialogRef.close(false);
    }
  }

}
