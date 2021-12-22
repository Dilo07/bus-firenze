import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { VehicleTripPersistence } from 'src/app/components/domain/bus-firenze-domain';

@Component({
  selector: 'app-table-statistic',
  templateUrl: './table-statistic.component.html',
  styles: [`
  `
  ]
})
export class TableStatisticComponent implements OnInit, OnChanges {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() TripPersistence: VehicleTripPersistence[];
  public displayedColumns: string[] = ['start', 'end', 'trip length', 'duration', 'type', 'obuId'];
  public dataSource = new MatTableDataSource<VehicleTripPersistence>([]);

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.TripPersistence) {
      this.dataSource.data = this.TripPersistence;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }
}
