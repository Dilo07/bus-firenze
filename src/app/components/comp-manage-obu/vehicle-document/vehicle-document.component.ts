import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ObuService } from 'src/app/services/obu.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { Vehicle } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-vehicle-document',
  templateUrl: './vehicle-document.component.html',
  styles: [`
  .viewPDF {
    opacity: 1;
    z-index: 2;
  }
  :host ::ng-deep .ng2-pdf-viewer-container {
    width: 98% !important;
    height: 98% !important;
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
  public src = '';

  private subscription: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private vehicleService: VehicleService,
    private obuService: ObuService
  ) { }

  ngOnInit(): void {
    this.Search = this.formBuilder.group({
      CtrlSearch: [''],
      onlyUpload: [true]
    });
    this.getVehiclesInstaller();
  }

  public getVehiclesInstaller(): void {
    const keyword = this.Search.get('CtrlSearch').value;
    const onlyUpload = this.Search.get('onlyUpload').value;
    this.complete = false;
    this.subscription.push(this.vehicleService.getVehiclesIstalled(onlyUpload, keyword).subscribe(
      (data) => {
        this.vehicleList.data = data;
        this.vehicleList.sort = this.sort;
        this.vehicleList.paginator = this.paginator;
      },
      () => this.complete = true,
      () => this.complete = true));
  }

  public uploadFile(event: any, obuId: number, vehicleId: number): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile.type === 'application/pdf') {
      this.obuService.uploadObuDocument(obuId, vehicleId, this.selectedFile).subscribe(
        () => null,
        () => null,
        () => { this.getVehiclesInstaller(); this.snackBar.showMessage('OBU.UPLOAD_SUCCESS', 'INFO'); }
      );
    }
  }

  public getObuDocument(obuId: number, fileId: number): void {
    this.complete = false;
    this.obuService.getObuDocument(obuId, fileId).subscribe(
      (data: HttpResponse<Blob>) => {
        const url = window.URL.createObjectURL(data.body);
        this.src = url;
        this.viewPDF = true;
      },
      () => this.complete = true,
      () => this.complete = true
    );
  }

}
