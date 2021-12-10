import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SessionService } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FIRENZE_SESSION } from 'src/app/shared/constants/Firenze-session.constants';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { ColumnSort, FleetManager } from '../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-comp-fleet-manager',
  templateUrl: './comp-fleet-manager.component.html',
  styles: [`
  table { width: 100%; background-color: beige; }
  mat-card { z-index: 2;}
  @media(min-width: 1180px) {
    .mat-column-id { max-width: 5%}
    .mat-column-name { max-width: 8%; margin-right: 1%;}
    .mat-column-surname { max-width: 8%; margin-right: 1%;}
    .mat-column-e-mail { max-width: 20%}
    .mat-column-companyName { max-width: 15%}
    .mat-column-city { max-width: 10%}
    .mat-column-district { max-width: 10%}
    .mat-column-actions { max-width: 20%; display: table-column;}
  }
  :host ::ng-deep .ng2-pdf-viewer-container {
    width: 98% !important;
    height: 98% !important;
  }
  .img-responsive {
    max-width: 40%;
    height: auto;
  }
  `]
})
export class FleetManagerComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource = new MatTableDataSource<FleetManager>();
  public fleetManagerList: FleetManager[] = [];
  public displayedColumns = ['id', 'name', 'surname', 'e-mail', 'companyName', 'fiscalCode', 'city', 'district', 'actions'];
  public Search: FormGroup;
  public complete = true;
  public validFleet: boolean;
  public manageFleet: boolean;
  public roleOpMovyon: boolean;
  public viewDoc = false;
  public src: {type: string, url: string | ArrayBuffer} = { type: '', url: ''};

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
    @Inject('authService') private authService) { }

  ngOnInit(): void {
    this.roleOpMovyon = this.authService.getUserRoles().includes(ROLES.OPER_MOVYON);
    this.validFleet = this.router.url === '/fleet-manager-valid';
    this.manageFleet = this.router.url === '/fleet-manager-manage';
    this.Search = this.formBuilder.group({
      CtrlSearch: [
        this.sessionService.getSessionStorage(this.manageFleet ? FIRENZE_SESSION.FLEETSEARCHMANAGE : FIRENZE_SESSION.FLEETSEARCHVALID)
      ],
    });
    this.callGetFleetManager();
  }

  public callGetFleetManager(): void {
    const search = this.Search.get('CtrlSearch').value;
    this.complete = false;
    const currentSize = this.offset * this.limit;
    this.subscription.push(
      this.fleetManagerService.searchFleetManager(
        search,
        this.manageFleet,
        this.offset,
        this.limit,
        this.columnOrder).subscribe((data) => {
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
          () => { this.complete = true; this.unSubscribe(); })
    );
    this.sessionService.setSessionStorage(this.manageFleet ? FIRENZE_SESSION.FLEETSEARCHMANAGE : FIRENZE_SESSION.FLEETSEARCHVALID, search);
  }

  public pageChanged(event: {lengrh: number, pageIndex: number, pageSize: number, previousPageIndex: number}): void {
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

  public validateFleet(id: number, valid: boolean): void {
    this.subscription.push(this.fleetManagerService.validInvalidFleetManager(id, valid).subscribe(
      () => this.snackBar.showMessage(valid ? 'FLEET-MANAGER.VALID_SUCCESS' : 'FLEET-MANAGER.DELETE_SUCCESS', 'INFO'),
      () => null,
      () => this.callGetFleetManager()
    ));
  }

  public findContactValue(fleetManager: FleetManager, code: number): string {
    let res = '';
    fleetManager.contacts.find(contact => {
      if (contact.code === code) {
        res = contact.value;
      }
    });
    return res;
  }

  public getFleetDocument(fleetManagerId: number, fileId: number): void{
    this.subscription.push(this.fleetManagerService.getFleetDocument(fleetManagerId, fileId).subscribe(
      data => {
        if (data.type === 'application/pdf'){
          const url = window.URL.createObjectURL(data);
          this.src.url = url;
          this.src.type = data.type;
          this.viewDoc = true;
        }else{
          const reader = new FileReader();
          reader.readAsDataURL(data);
          reader.onload = () => {
            this.src.url = reader.result;
            this.src.type = data.type;
            this.viewDoc = true;
          };
        }
      },
      () => this.complete = true,
      () => this.complete = true
    ));
  }

  public sortData(event: {active: string, direction: string}): void {
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
