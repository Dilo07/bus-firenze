import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { DriverVehicle } from 'src/app/components/domain/bus-firenze-domain';
import { DriverService } from 'src/app/services/driver.service';
import { MatDialog } from '@angular/material/dialog';
import { AssociationDriversVehiclesComponent } from '../modal-association-drivers-vehicles/association-drivers-vehicles.component';
import { Subscription } from 'rxjs';
import { IAuthenticationService } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';

@Component({
  selector: 'app-association-vehicles',
  templateUrl: './association-vehicles.component.html',
  styleUrls: ['./association-vehicles.component.scss']
})
export class AssociationVehiclesComponent implements OnInit, OnDestroy {
  @Input() public vehiclesAssociated: DriverVehicle[] = [];
  @Input() public vehicles: DriverVehicle[];
  @Input() private idDriver: number;
  @Input() private fleetManagerId: number;
  public roleDriver: boolean;

  private subscription: Subscription[] = [];

  constructor(
    private driverService: DriverService,
    private dialog: MatDialog,
    @Inject('authService') private authService: IAuthenticationService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.getUserRoles().then((res: string[]) => this.roleDriver = res.includes(ROLES.DRIVER));
    if (this.roleDriver) {
      this.getVehiclesDriver();
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public openModal(): void {
    const dialogRef = this.dialog.open(AssociationDriversVehiclesComponent, {
      width: '80%',
      height: '80%',
      data: { driverVehicle: this.vehicles, idDriver: this.idDriver, fleetManagerId: this.fleetManagerId },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(
      data => { if (data) { this.getVehiclesDriver(); } }
    );
  }

  private getVehiclesDriver(): void {
    this.subscription.push(this.driverService.getVehiclesByDriver(this.idDriver, this.fleetManagerId).subscribe(
      data => {
        this.vehicles = data; // tutti i veicoli
        this.vehiclesAssociated = this.vehicles.filter(vehicle => vehicle.dateIns); // solo veicoli associati
      }
    ));
  }

}
