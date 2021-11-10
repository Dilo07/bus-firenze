import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FleetManager } from '../domain/bus-firenze-domain';

@Component({
  selector: 'app-comp-fleet-manager',
  templateUrl: './comp-fleet-manager.component.html',
  styles: [`
  table {
    width: 100%;
  }
  `]
})
export class FleetManagerComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private fleetManagerService: FleetManagerService) { }

  public fleetManagerList = new MatTableDataSource<FleetManager>();
  public displayedColumns = ['id', 'name', 'surname'];
  public searchFleet: string;

  ngOnInit(): void {
  }

  public callGetFleetManager(): void{
    const search = this.searchFleet;
    if (search === undefined || search === null || search.trim() === ''){
      this.fleetManagerList = new MatTableDataSource<FleetManager>([]);
      return;
    }else{
      this.fleetManagerService.searchFleetManager(this.searchFleet).subscribe((data) => {
        this.fleetManagerList.data = data;
        this.fleetManagerList.sort = this.sort;
      });
    }
  }
}
