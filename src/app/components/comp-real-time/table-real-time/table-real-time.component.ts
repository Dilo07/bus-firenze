import { Component, Input, OnInit } from '@angular/core';
import { VehicleTripPersistence } from '../../domain/bus-firenze-domain';
import { MatDialog } from '@angular/material/dialog';
import { ModalVehicleDetailsComponent } from '../modal-vehicle-details/modal-vehicle-details.component';

@Component({
  selector: 'app-table-real-time',
  templateUrl: './table-real-time.component.html',
  styles: [
  ]
})
export class TableRealTimeComponent implements OnInit {
  @Input() public vehicleTable: VehicleTripPersistence[];
  public displayedColumns: string[] = ['OBUID', 'Start', 'End', 'actions'];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public viewDetails(obuID: string): void{
    this.dialog.open(ModalVehicleDetailsComponent, {
      width: '90%',
      height: '50%',
      data: obuID
    });
  }

}
