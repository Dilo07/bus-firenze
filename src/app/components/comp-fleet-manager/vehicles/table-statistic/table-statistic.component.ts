import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VehicleTripPersistence } from 'src/app/components/domain/bus-firenze-domain';

@Component({
  selector: 'app-table-statistic',
  templateUrl: './table-statistic.component.html',
  styles: [`
  table { width: 100%; background-color: beige; }
  `
  ]
})
export class TableStatisticComponent implements OnInit, OnChanges {
  @ViewChild(MatSort) sort: MatSort;
  @Input() TripPersistence: VehicleTripPersistence[];
  public displayedColumns: string[] = ['start', 'end', 'trip length', 'duration', 'type', 'obuId'];
  public dataSource = new MatTableDataSource<VehicleTripPersistence>([]);

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    console.log(this.TripPersistence);
    if (this.TripPersistence) {
      this.dataSource.data = this.TripPersistence;
      this.dataSource.sort = this.sort;
    }
  }
}
