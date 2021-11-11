import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { FleetManager } from '../domain/bus-firenze-domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '@npt/npt-template';
import { FIRENZE_SESSION } from '../domain/bus-firenze-constants';
import { Subscription } from 'rxjs';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private fleetManagerService: FleetManagerService,
    private formBuilder: FormBuilder,
    private sessionService: SessionService) { }

  public fleetManagerList = new MatTableDataSource<FleetManager>();
  public displayedColumns = ['id', 'name', 'surname', 'companyName', 'city', 'district', 'actions'];
  public Search: FormGroup;
  public complete = true;

  private subscription: Subscription[] = [];

  ngOnInit(): void {
    this.Search = this.formBuilder.group({
      CtrlSearch: [this.sessionService.getSessionStorage(FIRENZE_SESSION.FLEETSEARCH), Validators.required],
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
          () => this.showMessage('FLEET-MANAGER.DELETE_SUCCESS', 'SUCCESS'),
          (error: any) => console.log(error),
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
