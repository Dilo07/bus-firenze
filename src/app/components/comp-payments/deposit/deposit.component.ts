import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FileViewer, SnackBar } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DepositType, DocumentObu, DocumentVehicle, Vehicle } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styles: [`
  table { width: 100%; }
  @media(min-width: 1180px) {
  .mat-column-id { max-width: 10%}
  .mat-column-vehicleState { max-width: 10%}
  .mat-column-plate { max-width: 10%}
  .mat-column-nat { max-width: 5%}
  .mat-column-depositDocument { max-width: 13%}
  .mat-column-requestDocument { max-width: 13%}
  .mat-column-testing { max-width: 18%}
  .mat-column-obuId { max-width: 20%}
  }
  .icon-assignment-grey:before {
    color: grey;
    font-weight: bold;
  }
  `
  ]
})
export class DepositComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() public fleetManagerId: number;
  public vehicleList = new MatTableDataSource<Vehicle>([]);
  public displayedColumns = ['id', 'vehicleState', 'plate', 'nat', 'depositDocument', 'requestDocument', 'testing', 'obuId'];
  public src: FileViewer = { type: '', url: '', fileName: '' };
  public search: FormGroup;
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(
    private vehicleService: VehicleService,
    private snackBar: SnackBar,
    private formBuilder: FormBuilder
  ) { }

  async ngOnInit(): Promise<void> {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlViewAll: [false]
    });
    this.getVehicle();
  }

  public getVehicle(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch').value;
    const viewAll = this.search.get('ctrlViewAll').value;
    this.subscription.push(this.vehicleService.getVehicleDeposit(viewAll, this.fleetManagerId, keyword).subscribe(
      vehicles => (this.vehicleList.data = vehicles, this.vehicleList.sort = this.sort, this.vehicleList.paginator = this.paginator),
      () => this.complete = true,
      () => this.complete = true
    ));
  }

  public viewDeposit(vehicleId: number, documents: DocumentVehicle[], depositType: DepositType): void {
    this.complete = false;
    let depositId: number;
    documents.map((document: DocumentVehicle) => {
      if (document.type === depositType) { depositId = document.fileId; }
    });
    this.subscription.push(this.vehicleService.getDeposit(vehicleId, depositType, depositId)
      .subscribe({
        next: (data: HttpResponse<Blob>) => {
          if (data.body.type === 'application/pdf') { // se è un pdf
            const objectUrl = window.URL.createObjectURL(data.body);
            const contentDispositionHeader = data.headers.get('Content-Disposition');
            const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
            this.src = { url: objectUrl, type: data.body.type, fileName: filename };
          } else { // altrimenti se è un'immagine
            const reader = new FileReader();
            reader.readAsDataURL(data.body);
            reader.onload = () => {
              this.src = { url: reader.result, type: data.body.type, fileName: '' };
            };
          }
        },
        error: () => this.complete = true,
        complete: () => this.complete = true
      }));
  }

  public viewDocObu(vehicleId: number, documentsObu: DocumentObu): void {
    this.complete = false;
    // prende il primo documento
    this.subscription.push(this.vehicleService.getDocObu(vehicleId, documentsObu.obuId, documentsObu.type, documentsObu.fileId)
      .subscribe({
        next: (data: HttpResponse<Blob>) => {
          if (data.body.type === 'application/pdf') { // se è un pdf
            const objectUrl = window.URL.createObjectURL(data.body);
            const contentDispositionHeader = data.headers.get('Content-Disposition');
            const filename = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
            this.src = { url: objectUrl, type: data.body.type, fileName: filename };
          } else { // altrimenti se è un'immagine
            const reader = new FileReader();
            reader.readAsDataURL(data.body);
            reader.onload = () => {
              this.src = { url: reader.result, type: data.body.type, fileName: '' };
            };
          }
        },
        error: () => this.complete = true,
        complete: () => this.complete = true
      }));
  }

  public uploadDeposit(vehicleId: number, event: any, depositType: DepositType): void {
    this.complete = false;
    const file = event.target.files[0];
    const size = event.target.files[0].size;
    if (size > 2097152) { // dimensione massima
      this.snackBar.showMessage('FLEET-MANAGER.ERROR_SIZE', 'ERROR');
      this.complete = true;
    } else {
      this.subscription.push(this.vehicleService.uploadDeposit(vehicleId, depositType, file, this.fleetManagerId).subscribe(
        () => this.snackBar.showMessage('VEHICLE.UPLOAD_SUCC', 'INFO'),
        () => this.complete = true,
        () => { this.getVehicle(); this.complete = true; }
      ));
    }
  }

}
