import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Vehicle } from '../../domain/bus-firenze-domain';
import { ModalPenalComponent } from './modal-penal/modal-penal.component';

@Component({
  selector: 'app-penalties',
  templateUrl: './penalties.component.html',
  styles: [`
  @media(min-width: 1180px) {
    .mat-column-actions { display: table-column;}
  }
  `
  ]
})
export class PenaltiesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public viewFleetTable = true;
  public dataSource = new MatTableDataSource<Vehicle>();
  public displayedColumns = ['id', 'plate', 'nat', 'obuId', 'actions'];

  constructor(
    private dialog: MatDialog,
    private vehicleService: VehicleService
  ) { }

  public getVehiclesByManagerId(fm: number): void {
    this.viewFleetTable = false;
    this.vehicleService.getVehiclesById(false, fm).subscribe(
      vehicles => (this.dataSource.data = vehicles, this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator),
      () => this.viewFleetTable = true
    );
  }

  public modalPenal(vehicleid: number, fmId: number): void{
    this.dialog.open(ModalPenalComponent, {
      width: '80%',
      height: '80%',
      data: {vehicleId: vehicleid, fleetId: fmId}
    });
  }
}
