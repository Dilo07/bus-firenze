import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FleetManager } from '../domain/bus-firenze-domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fleetManagerService: FleetManagerService, private formBuilder: FormBuilder) { }

  public fleetManagerList = new MatTableDataSource<FleetManager>();
  public displayedColumns = ['id', 'name', 'surname', 'companyName', 'city', 'district', 'actions'];
  public Search: FormGroup;
  public complete = true;

  ngOnInit(): void {
    this.Search = this.formBuilder.group({
      CtrlSearch: ['', Validators.required],
    });
  }

  public callGetFleetManager(): void {
    const search = this.Search.get('CtrlSearch').value;
    if (search === undefined || search === null || search.trim() === '') {
      this.fleetManagerList = new MatTableDataSource<FleetManager>([]);
      return;
    } else {
      this.complete = false;
      this.fleetManagerService.searchFleetManager(search).subscribe((data) => {
        this.fleetManagerList.data = data;
        this.fleetManagerList.sort = this.sort;
        this.fleetManagerList.paginator = this.paginator;
      },
      () => this.complete = true,
      () => this.complete = true);
    }
  }
}
