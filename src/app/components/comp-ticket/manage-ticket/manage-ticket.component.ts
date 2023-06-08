import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IAuthenticationService, SnackBar } from '@npt/npt-template';
import moment from 'moment';
import { TicketService } from 'src/app/services/ticket.service';
import { CompleteFleetManager, FleetManager, Ticket, Vehicle, VehicleWithoutTicket } from '../../domain/bus-firenze-domain';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ModalTestTicketComponent } from '../modal-test-ticket/modal-test-ticket.component';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-manage-ticket',
  templateUrl: './manage-ticket.component.html',
  styleUrls: ['./manage-ticket.component.css']
})
export class ManageTicketComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() public fleetManager: FleetManager;
  @Input() public roleMovyon: boolean;
  @Output() public callBackButton = new EventEmitter();
  public roleDriver: boolean;
  public viewHistoric = false;
  public dataSource = new MatTableDataSource<Ticket>();
  public ticketsConnect: BehaviorSubject<Ticket[]>;
  public displayedColumns = ['expandButton', 'ticketId', 'lpn', 'lpnNat', 'ticketStart', 'ticketEnd', 'type', 'dateSink'];
  public complete = true;
  public formGroup: FormGroup;
  public maxDate = moment(moment.now()).toDate();
  public vehicles: VehicleWithoutTicket[] = [];

  private subscription: Subscription[] = [];

  constructor(
    private ticketService: TicketService,
    private dialog: MatDialog,
    private snackBar: SnackBar,
    @Inject('authService') private authService: IAuthenticationService
  ) { }

  async ngOnInit(): Promise<void> {
    this.formGroup = new FormGroup({
      ctrlActive: new FormControl(true),
      ctrlStart: new FormControl(moment(moment.now()).subtract(1, 'month').toDate()),
      ctrlEnd: new FormControl(moment(moment.now()).toDate()),
    });
    await this.authService.getUserRoles().then((res: string[]) => this.roleDriver = res.includes(ROLES.DRIVER));
    this.getActiveTicket();
    this.getVehicle();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.dataSource.disconnect();
  }

  public getActiveTicket(): void {
    let start = null;
    let end = null;
    if (!this.formGroup.get('ctrlActive').value) {
      if (!this.formGroup.get('ctrlStart').value || !this.formGroup.get('ctrlEnd').value) { return; }
      start = moment(this.formGroup.get('ctrlStart').value).format('yyyy-MM-DD');
      end = moment(this.formGroup.get('ctrlEnd').value).format('yyyy-MM-DD');
    }
    this.complete = false;
    this.subscription.push(this.ticketService.getActiveTicket(this.roleDriver, this.fleetManager?.id, start, end).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.ticketsConnect = this.dataSource.connect();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  public modalTicket(vehicleId?: number): void {
    let dataValue = null;
    if (vehicleId) {
      // caso di aggiunta ticket ad un ticket già esistente
      dataValue = { vehicleId: vehicleId, fleetManagerId: this.fleetManager?.id, extend: true };
    } else {
      // caso di aggiunta di un ticket ad un vehicle che non ha ticket
      dataValue = { vehicleList: this.vehicles, fleetManagerId: this.fleetManager?.id, extend: false };
    }
    const dialogRef = this.dialog.open(ModalTestTicketComponent, {
      width: '60%',
      height: '80%',
      data: dataValue,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(save => {
      if (save) { this.getActiveTicket(); this.getVehicle(); }
    });
  }

  public removeTicket(ticketId: number, vehicleId: number): void {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: '50%',
      height: '30%',
      data: { text: 'TICKET.REMOVE_CONFIRM' },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(
      confirm => {
        if (confirm) {
          this.complete = false;
          this.subscription.push(this.ticketService.removeTicket(ticketId, vehicleId, this.roleDriver, this.fleetManager?.id).subscribe({
            error: () => this.complete = true,
            complete: () => {
              this.getActiveTicket();
              this.snackBar.showMessage('TICKET.REMOVE_SUCCESS', 'INFO');
              this.complete = true;
            }
          }));
        }
      }
    );
  }

  private getVehicle(): void {
    this.complete = false;
    this.ticketService.getVehicleNoTicket(this.roleDriver, this.fleetManager?.id).subscribe({
      next: (data) => this.vehicles = data,
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

}
