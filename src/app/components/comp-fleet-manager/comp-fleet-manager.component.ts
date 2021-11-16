import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FIRENZE_SESSION } from 'src/app/shared/constants/Firenze-session.constants';
import { FleetManager } from '../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

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

  public fleetManagerList = new MatTableDataSource<FleetManager>();
  public displayedColumns = ['id', 'name', 'surname', 'companyName', 'city', 'district', 'actions'];
  public Search: FormGroup;
  public complete = true;
  public validFleet: boolean;
  public manageFleet: boolean;

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private fleetManagerService: FleetManagerService,
    private formBuilder: FormBuilder,
    private sessionService: SessionService) { }

  ngOnInit(): void {
    this.validFleet = this.router.url === '/fleet-manager-valid';
    this.manageFleet = this.router.url === '/fleet-manager-manage';
    this.Search = this.formBuilder.group({
      CtrlSearch: [this.sessionService.getSessionStorage(FIRENZE_SESSION.FLEETSEARCH)],
    });
    if (this.Search.get('CtrlSearch').value) {
      this.callGetFleetManager();
    }
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
      this.sessionService.setSessionStorage(FIRENZE_SESSION.FLEETSEARCH, search);
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
          () => this.showMessage('FLEET-MANAGER.DELETE_SUCCESS', 'INFO'),
          () => null,
          () => this.callGetFleetManager()));
      }
    });
  }

  private showMessage(i18nKey: string, level: string): void {

    this.snackBar.open(this.translate.instant(i18nKey),
      '✖',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: [level]
      });
  }
}
