import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IAuthenticationService, SnackBar } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
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
  .mat-column-nat { max-width: 10%}
  .mat-column-depositDocument { max-width: 13%}
  .mat-column-requestDocument { max-width: 13%}
  .mat-column-testing { max-width: 13%}
  .mat-column-obuId { max-width: 20%}
  }
  `
  ]
})
export class DepositComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public viewFleetTable = false;
  public roleMovyon: boolean;
  public viewAll = false;
  public vehicleList = new MatTableDataSource<Vehicle>([]);
  public displayedColumns = ['id', 'vehicleState', 'plate', 'nat', 'depositDocument', 'requestDocument', 'testing', 'obuId'];
  public src: { type: string; url: string | ArrayBuffer } = { type: '', url: '' };
  public complete = true;

  private fleetManagerId: number;
  private subscription: Subscription[] = [];

  constructor(
    private vehicleService: VehicleService,
    private snackBar: SnackBar,
    @Inject('authService') private authService: IAuthenticationService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.getUserRoles().then((res: string[]) => this.roleMovyon = res.includes(ROLES.MOVYON) || res.includes(ROLES.OPER_MOVYON));
    if (this.roleMovyon) {
      this.viewFleetTable = true;
    } else {
      this.getVehicle();
    }
  }

  public getVehicle(fleetManagerId?: any): void {
    if (fleetManagerId) { // se è op o movyon verrà valorizzato flmId altrimenti se ruolo fm non verrà valorizzato
      this.fleetManagerId = fleetManagerId;
      this.viewFleetTable = false;
    }
    this.complete = false;
    this.subscription.push(this.vehicleService.getVehicleDeposit(this.viewAll, this.fleetManagerId).subscribe(
      vehicles => (this.vehicleList.data = vehicles, this.vehicleList.sort = this.sort, this.vehicleList.paginator = this.paginator),
      () => this.complete = true,
      () => this.complete = true
    ));
  }

  public viewDeposit(vehicleId: number, documents: DocumentVehicle[], depositType: DepositType): void {
    let depositId: number;
    documents.map((document: DocumentVehicle) => {
      if (document.type === depositType) { depositId = document.fileId; }
    });
    this.subscription.push(this.vehicleService.getDeposit(vehicleId, depositType, depositId)
      .subscribe((data: HttpResponse<Blob>) => {
        if (data.body.type === 'application/pdf') { // se è un pdf
          const objectUrl = window.URL.createObjectURL(data.body);
          this.src = { url: objectUrl, type: data.body.type };
        } else { // altrimenti se è un'immagine
          const reader = new FileReader();
          reader.readAsDataURL(data.body);
          reader.onload = () => {
            this.src = { url: reader.result, type: data.body.type };
          };
        }
      }));
  }

  public viewDocObu(vehicleId: number, documentsObu: DocumentObu[], depositType: DepositType): void {
    let depositId: number;
    let obu: string;
    documentsObu.map((document: DocumentObu) => {
      if (document.type === depositType) {
        depositId = document.fileId;
        obu = document.obuId;
      }
    });
    this.subscription.push(this.vehicleService.getDocObu(vehicleId, obu, depositType, depositId)
      .subscribe((data: HttpResponse<Blob>) => {
        if (data.body.type === 'application/pdf') { // se è un pdf
          const objectUrl = window.URL.createObjectURL(data.body);
          this.src = { url: objectUrl, type: data.body.type };
        } else { // altrimenti se è un'immagine
          const reader = new FileReader();
          reader.readAsDataURL(data.body);
          reader.onload = () => {
            this.src = { url: reader.result, type: data.body.type };
          };
        }
      }));
  }

  public uploadDeposit(vehicleId: number, event: any, depositType: DepositType): void {
    this.complete = false;
    const file = event.target.files[0];
    const size = event.target.files[0].size;
    if (size > 2097152) { // dimensione massima
      this.snackBar.showMessage('FLEET-MANAGER.ERROR_SIZE', 'ERROR');
      this.complete = true;
    }else{
      this.subscription.push(this.vehicleService.uploadDeposit(vehicleId, depositType, file, this.fleetManagerId).subscribe(
        () => this.snackBar.showMessage('VEHICLE.UPLOAD_SUCC', 'INFO'),
        () => this.complete = true,
        () => { this.getVehicle(); this.complete = true; }
      ));
    }
  }

}
