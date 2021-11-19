import { Component, Input, OnInit } from '@angular/core';
import { VehicleTripPersistence } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-table-real-time',
  templateUrl: './table-real-time.component.html',
  styles: [
  ]
})
export class TableRealTimeComponent implements OnInit {
  @Input() public vehicleTable: VehicleTripPersistence[];
  public displayedColumns: string[] = ['OBUID', 'Start', 'End', 'actions'];
  constructor() { }

  ngOnInit(): void {
  }

}
