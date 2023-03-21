import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IAuthenticationService, SnackBar } from '@npt/npt-template';
import moment from 'moment';
import { TicketService } from 'src/app/services/ticket.service';
import { CompleteFleetManager, Ticket, Vehicle, VehicleWithoutTicket } from '../../domain/bus-firenze-domain';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { BehaviorSubject } from 'rxjs';
import { ModalTestTicketComponent } from '../modal-test-ticket/modal-test-ticket.component';

@Component({
  selector: 'app-manage-ticket-ref',
  templateUrl: './manage-ticket-ref.component.html',
  styleUrls: ['./manage-ticket-ref.component.css']
})
export class ManageTicketRefComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() public fleetManagerId: number;
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

  public getActiveTicket(): void {
    let start = null;
    let end = null;
    if (!this.formGroup.get('ctrlActive').value) {
      if (!this.formGroup.get('ctrlStart').value || !this.formGroup.get('ctrlEnd').value) { return; }
      start = moment(this.formGroup.get('ctrlStart').value).format('yyyy-MM-DD');
      end = moment(this.formGroup.get('ctrlEnd').value).format('yyyy-MM-DD');
    }
    this.complete = false;
    this.ticketService.getActiveTicket(this.roleDriver, this.fleetManagerId, start, end).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.ticketsConnect = this.dataSource.connect();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

  public modalTicket(): void {
    const dialogRef = this.dialog.open(ModalTestTicketComponent, {
      width: '60%',
      height: '70%',
      data: { vehicleList: this.vehicles, fleetManagerId: this.fleetManagerId, extend: false },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(save => {
      if (save) { this.getVehicle(); }
    });
  }

  private getVehicle(): void {
    this.complete = false;
    this.ticketService.getVehicleNoTicket(this.roleDriver, this.fleetManagerId).subscribe({
      next: (data) => this.vehicles = data,
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

}
