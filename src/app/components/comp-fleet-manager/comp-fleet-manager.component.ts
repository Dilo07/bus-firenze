import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IAuthenticationService, SessionService } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FIRENZE_SESSION } from 'src/app/shared/constants/Firenze-session.constants';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { ColumnSort, FleetDocumentTypes, FleetDocument, FleetManager } from '../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-comp-fleet-manager',
  templateUrl: './comp-fleet-manager.component.html',
  styles: [`
  table { width: 100%; }
  /* mat-card { z-index: 2;} */
  @media(min-width: 1180px) {
    .mat-column-id { max-width: 5%}
    .mat-column-name { max-width: 8%;}
    .mat-column-surname { max-width: 8%;}
    .mat-column-e-mail { max-width: 22%}
    .mat-column-companyName { max-width: 15%}
    .mat-column-city { max-width: 12%} /* solo manage */
    .mat-column-district { max-width: 10%} /* solo manage */
    .mat-column-pIva { max-width: 10%} /* solo valid */
    .mat-column-fiscalCode { max-width: 12%} /* solo valid */
    .mat-column-actions { max-width: 20%; display: table-column; text-align: end;}
  }
  `],
})
export class FleetManagerComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource = new MatTableDataSource<FleetManager>();
  public fleetManagerList: FleetManager[] = [];
  public displayedColumns = ['id', 'name', 'surname', 'e-mail', 'companyName', 'pIva', 'fiscalCode', 'city', 'district', 'actions'];
  public search: FormGroup;
  public complete = true;
  public isValidFleet: boolean;
  public isManageFleet: boolean;
  public roleOpMovyon: boolean;
  public src: { type: string; url: string | ArrayBuffer } = { type: '', url: '' };

  private offset = 0;
  private limit = 10;
  private columnOrder: ColumnSort = { active: 'id', direction: 1 };
  private endTable = false;
  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: SnackBar,
    private fleetManagerService: FleetManagerService,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    @Inject('authService') private authService: IAuthenticationService) { }

  ngOnInit(): void {
    this.authService.getUserRoles().then((res: string[]) => this.roleOpMovyon = res.includes(ROLES.OPER_MOVYON));
    this.isValidFleet = this.router.url === '/fleet-manager-valid';
    this.isManageFleet = this.router.url === '/fleet-manager-manage';
    this.search = this.formBuilder.group({
      ctrlSearch: [
        this.sessionService.getSessionStorage(this.isManageFleet ? FIRENZE_SESSION.FLEETSEARCHMANAGE : FIRENZE_SESSION.FLEETSEARCHVALID)
      ],
    });
    this.callGetFleetManager();
  }

  public callGetFleetManager(): void {
    const search = this.search.get('ctrlSearch').value;
    this.complete = false;
    const currentSize = this.offset * this.limit;
    this.subscription.push(this.fleetManagerService.searchFleetManager(
      search,
      this.isManageFleet,
      this.offset,
      this.limit,
      this.columnOrder)
      .subscribe(
        (data) => {
          this.fleetManagerList.length = currentSize;
          this.fleetManagerList = this.fleetManagerList.concat(data);
          if (data.length < this.limit) {
            this.paginator.length = this.fleetManagerList.length;
            this.endTable = true;
          } else {
            this.paginator.length = ((this.offset + 1) * this.limit) + 1;
          }
          this.dataSource.data = data;
        },
        () => this.complete = true,
        () => { this.complete = true; this.unSubscribe(); }));
    this.sessionService.setSessionStorage(this.isManageFleet ? FIRENZE_SESSION.FLEETSEARCHMANAGE : FIRENZE_SESSION.FLEETSEARCHVALID, search);
  }

  public pageChanged(event: PageEvent): void {
    this.offset = event.pageIndex;
    this.limit = event.pageSize;
    const currentSize = this.offset * this.limit;
    const nextSize = (this.offset + 1) * this.limit; // dimensione pagina successiva
    // se fleetManagerList ha già i dati o l'utente è arrivato alla fine della tabella non chiama l'API
    if (nextSize <= this.fleetManagerList.length || this.endTable) {
      this.dataSource.data = this.fleetManagerList.slice(currentSize, nextSize);
      if (this.endTable) {
        // se è arrivato alla fine lascia la length della tabella completa
        this.paginator.length = this.fleetManagerList.length;
      } else {
        this.paginator.length = this.fleetManagerList.length + 1;
      }
    } else {
      this.callGetFleetManager();
    }
  }

  public deleteFleetManager(id: number): void {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: '50%',
      height: '30%',
      data: { text: 'FLEET-MANAGER.DELETE CONFIRM' },
      autoFocus: false
    });
    // chiama il modal confirm in caso di scelta si cancella
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.subscription.push(this.fleetManagerService.deleteFleetManager(id).subscribe(
          () => this.snackBar.showMessage('FLEET-MANAGER.DELETE_SUCCESS', 'INFO'),
          () => null,
          () => this.callGetFleetManager()));
      }
    });
  }

  public validInvalidFleet(id: number, valid: boolean): void {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: '50%',
      height: '30%',
      data: { text: valid ? 'FLEET-MANAGER.VALID_CONFIRM' : 'FLEET-MANAGER.INVALID_CONFIRM', validForm: valid },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((contractCode) => {
      if (contractCode) {
        this.subscription.push(this.fleetManagerService.validInvalidFleetManager(id, valid, valid ? contractCode : null).subscribe(
          () => this.snackBar.showMessage(valid ? 'FLEET-MANAGER.VALID_SUCCESS' : 'FLEET-MANAGER.DELETE_SUCCESS', 'INFO'),
          () => null,
          () => this.callGetFleetManager()
        ));
      }
    });
  }

  public getFleetDocument(fleetManagerId: number, documents: FleetDocument[],  documentType: FleetDocumentTypes): void {
    this.complete = false;
    let fileId: number;
    documents.forEach(document => {
      if (document.type === documentType) {
        fileId = document.fileId;
      }
    });
    this.subscription.push(this.fleetManagerService.getFleetDocument(fleetManagerId, fileId).subscribe(
      (data: HttpResponse<Blob>) => {
        if (data.body.type === 'application/pdf') { // se è un pdf
          const URL = window.URL.createObjectURL(data.body);
          this.src = { url: URL, type: data.body.type };
        } else { // altrimenti se è un'immagine
          const reader = new FileReader();
          reader.readAsDataURL(data.body);
          reader.onload = () => {
            this.src = { url: reader.result, type: data.body.type };
          };
        }
      },
      () => this.complete = true,
      () => this.complete = true
    ));
  }

  /* public modalDocuments(fleetManageId: number, documents: FleetDocument[]): void{
    const dialogRef = this.dialog.open(ModalFleetDocumentsComponent, {
      width: '50%',
      height: '50%',
      autoFocus: false,
      data: {fmId: fleetManageId, documents: documents}
    });
  } */

  public sortData(event: { active: string; direction: string }): void {
    this.columnOrder.active = event.active;
    this.columnOrder.direction = event.direction === 'asc' ? 1 : -1;
    this.refreshTable();
  }

  public refreshTable(): void {
    this.reset();
    this.callGetFleetManager();
  }

  private reset(): void {
    this.paginator.pageIndex = 0;
    this.paginator.length = 0;
    this.fleetManagerList = [];
    this.dataSource.data = [];
    this.endTable = false;
    this.offset = 0;
    this.limit = this.paginator.pageSize;
  }

  private unSubscribe(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
