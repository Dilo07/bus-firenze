import { Component, Input, OnInit } from '@angular/core';
import { VehicleTripPersistence } from '../../domain/bus-firenze-domain';
import { MatDialog } from '@angular/material/dialog';
import { ModalVehicleDetailsComponent } from '../modal-vehicle-details/modal-vehicle-details.component';
import * as moment from 'moment';

@Component({
  selector: 'app-table-real-time',
  templateUrl: './table-real-time.component.html',
  styles: [
  ]
})
export class TableRealTimeComponent implements OnInit {
  @Input() public vehicleTable: VehicleTripPersistence[];
  @Input() public fleetManagerId: number;
  public displayedColumns: string[] = ['OBUID', 'Start', 'End', 'ticketNumber', 'ticketExpiresAt', 'actions'];
  public now = moment.now();
  public nowPlus15 = moment(this.now).add(15, 'minutes').valueOf();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {}

  public viewDetails(obuId: string): void{
    this.dialog.open(ModalVehicleDetailsComponent, {
      width: '90%',
      height: '70%',
      data: {obuID: obuId, fleetId: this.fleetManagerId}
    });
  }

}
