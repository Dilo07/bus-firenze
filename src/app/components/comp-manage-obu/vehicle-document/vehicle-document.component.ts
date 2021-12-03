import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Vehicle } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-vehicle-document',
  templateUrl: './vehicle-document.component.html',
  styles: [ `
  .viewPDF {
    opacity: 1;
    z-index: 2;
  }

  .contentOpacity{
    opacity: 0.3;
    z-index: 1;
  }
  `]
})
export class VehicleDocumentComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public Search: FormGroup;
  public complete = true;
  public vehicleList = new MatTableDataSource<Vehicle>();
  public displayedColumns = ['id', 'plate', 'nat', 'euroClass', 'obuId', 'actions'];
  public selectedFile: File;
  public viewPDF = false;
  public src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  private subscription: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService
  ) { }

  ngOnInit(): void {
    this.Search = this.formBuilder.group({
      CtrlSearch: ['']
    });
    this.getVehiclesInstaller(true);
  }

  public getVehiclesInstaller(associated: boolean): void {
    const keyword = this.Search.get('CtrlSearch').value;
    this.complete = false;
    this.subscription.push(this.vehicleService.getVehicles(associated, keyword).subscribe(
      (data) => {
        this.vehicleList.data = data;
        this.vehicleList.sort = this.sort;
        this.vehicleList.paginator = this.paginator;
      },
      () => this.complete = true,
      () => this.complete = true));
  }

  public uploadFile(event: any): void{
    this.selectedFile = event.target.files[0];
  }

}
