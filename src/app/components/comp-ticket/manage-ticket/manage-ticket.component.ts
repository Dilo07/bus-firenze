import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IAuthenticationService } from '@npt/npt-template';
import moment from 'moment';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { TicketService } from 'src/app/services/ticket.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { CompleteFleetManager, Ticket } from '../../domain/bus-firenze-domain';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { ModalTestTicketComponent } from '../modal-test-ticket/modal-test-ticket.component';

@Component({
  selector: 'app-manage-ticket',
  templateUrl: './manage-ticket.component.html',
  styles: [`
  @media(min-width: 1180px) {
    .mat-column-expandButton { max-width: 5%}
    .mat-column-ticketId { max-width: 15%;}
    .mat-column-lpn { max-width: 10%}
    .mat-column-ticketStart { max-width: 20%;}
    .mat-column-ticketEnd { max-width: 20%;}
    .mat-column-dateSink { max-width: 20%;}
    .mat-column-actions { max-width: 10%; display: table-column;}
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
export class ManageTicketComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() public fleetManagerId: number;
  public roleDriver: boolean;
  public viewHistoric = false;
  public dataSource = new MatTableDataSource<Ticket>();
  public displayedColumns = ['expandButton', 'ticketId', 'lpn', 'lpnNat', 'ticketStart', 'ticketEnd', 'type', 'dateSink', 'actions'];
  public complete = true;
  public expandedElement: CompleteFleetManager | null;
  public formGroup: FormGroup;
  public maxDate = moment(moment.now()).toDate();
  public start: string;
  public end: string;

  constructor(
    private ticketService: TicketService,
    private dialog: MatDialog,
    private snackBar: SnackBar,
    @Inject('authService') private authService: IAuthenticationService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.getUserRoles().then((res: string[]) => this.roleDriver = res.includes(ROLES.DRIVER));
    this.formGroup = new FormGroup({
      start: new FormControl(''),
      end: new FormControl(''),
    });
    this.getActiveTicket();
  }

  public getActiveTicket(): void {
    this.complete = false;
    this.ticketService.getActiveTicket(this.roleDriver, this.fleetManagerId, this.start, this.end).subscribe(
      data => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      () => this.complete = true,
      () => this.complete = true
    );
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
          this.ticketService.removeTicket(ticketId, vehicleId, this.roleDriver, this.fleetManagerId).subscribe(
            () => null,
            () => this.complete = true,
            () => {
              this.getActiveTicket();
              this.snackBar.showMessage('TICKET.REMOVE_SUCCESS', 'INFO');
              this.complete = true;
            }
          );
        }
      }
    );
  }

  public modalTicket(vehicleId: number): void {
    const dialogRef = this.dialog.open(ModalTestTicketComponent, {
      width: '90%',
      height: '80%',
      data: { vehicleId: vehicleId, fleetManagerId: this.fleetManagerId, extend: true }
    });
    dialogRef.afterClosed().subscribe(save => {
      if (save) {
        this.getActiveTicket();
      }
    });
  }

  public changeDate(): void {
    this.start = '';
    this.end = '';
    if (this.formGroup.get('end').value) {
      this.start = moment(this.formGroup.get('start').value).format('yyyy-MM-DD');
      this.end = moment(this.formGroup.get('end').value).format('yyyy-MM-DD');
      this.getActiveTicket();
    }
  }

  public switchHistoric(): void {
    if (this.viewHistoric) {
      this.resetDate();
      this.viewHistoric = false;
      this.getActiveTicket();
    } else {
      this.viewHistoric = true;
    }
  }

  private resetDate(): void {
    this.formGroup.patchValue({
      start: '',
      end: ''
    });
    this.start = '';
    this.end = '';
  }

}
