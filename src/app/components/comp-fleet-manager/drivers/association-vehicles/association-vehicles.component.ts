import { Component, OnInit } from '@angular/core';
import { DriverVehicle } from 'src/app/components/domain/bus-firenze-domain';
import { DriverService } from 'src/app/services/driver.service';
import { MatDialog } from '@angular/material/dialog';
import { AssociationDriversVehiclesComponent } from '../modal-association-drivers-vehicles/association-drivers-vehicles.component';

@Component({
  selector: 'app-association-vehicles',
  templateUrl: './association-vehicles.component.html',
  styles: [
  ]
})
export class AssociationVehiclesComponent implements OnInit {
  public vehicles: DriverVehicle[];
  public vehiclesAssociated: DriverVehicle[] = [];

  constructor(
    private driverService: DriverService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getVehiclesDriver();
  }

  private getVehiclesDriver(): void {
    this.driverService.getVehiclesByDriver().subscribe(
      data => {
        this.vehicles = data;
        this.vehiclesAssociated = this.vehicles.filter(vehicle => vehicle.dateIns);
      }
    );
  }

  public openModal(): void {
    const dialogRef = this.dialog.open(AssociationDriversVehiclesComponent, {
      width: '80%',
      height: '80%',
      data: { driverVehicle: this.vehicles },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(
      data => { if (data) { this.getVehiclesDriver(); } }
    );
  }

}
