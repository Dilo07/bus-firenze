import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ValidVehicleService } from 'src/app/services/valid-vehicle.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DepositType, DocumentVehicle, FleetManager } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-list-fleetmanager',
  templateUrl: './list-fleetmanager.component.html',
  styles: [`
  table { width: 100%; }
  @media(min-width: 1180px) {
    .mat-column-expandButton { max-width: 10% }
    .mat-column-id { max-width: 10%}
    .mat-column-name { max-width: 10%}
    .mat-column-surname { max-width: 10%}
    .mat-column-mobile { max-width: 20%}
    .mat-column-mail { max-width: 20%}
  }
  `],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListFleetmanagerComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource = new MatTableDataSource<FleetManager>();
  public displayedColumns = ['expandButton', 'id', 'name', 'surname', 'mobile', 'mail'];
  public expandedElement: FleetManager | null;
  public complete = true;
  public src: { type: string; url: string | ArrayBuffer } = { type: '', url: '' };

  private subscription: Subscription[] = [];

  constructor(
    private validVehiclerService: ValidVehicleService,
    private vehicleService: VehicleService
  ) { }

  ngOnInit(): void {
    this.callFleetDeposit();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public callFleetDeposit(): void {
    this.complete = false;
    this.validVehiclerService.getFleetDeposit().subscribe({
      next: fleetM => (this.dataSource.data = fleetM, this.dataSource.paginator = this.paginator),
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

  public viewDeposit(event: { vehicleId: number; documents: DocumentVehicle[] }): void {
    let depositId: number;
    let depositType: DepositType;
    event.documents.map((document: DocumentVehicle) => {
      if (!document.valid) { depositId = document.fileId; depositType = document.type; }
    });
    this.complete = false;
    this.subscription.push(this.vehicleService.getDeposit(event.vehicleId, depositType, depositId)
      .subscribe({
        next: (data: HttpResponse<Blob>) => {
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
        },
        error: () => this.complete = true,
        complete: () => this.complete = true
      }));
  }

  public viewCertificate(event: { vehicleId: number; certificateId: number }): void {
    this.complete = false;
    this.subscription.push(this.vehicleService.getCertificateFile(event.vehicleId, event.certificateId)
      .subscribe({
        next: (data: HttpResponse<Blob>) => {
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
        },
        error: () => this.complete = true,
        complete: () => this.complete = true
      }));
  }
}
