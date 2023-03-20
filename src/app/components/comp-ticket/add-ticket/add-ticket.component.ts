import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { TicketService } from 'src/app/services/ticket.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Ticket, VehicleWithoutTicket } from '../../domain/bus-firenze-domain';
import { ModalTestTicketComponent } from '../modal-test-ticket/modal-test-ticket.component';
import { IAuthenticationService } from '@npt/npt-template';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styles: [`
  .example-container { width: 99%; margin: 10px; }
  .mat-column-actions { max-width: 20%; display: table-column;}
  `
  ]
})
export class AddTicketComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() public fleetManagerId: number;
  public dataSource = new MatTableDataSource<VehicleWithoutTicket>();
  public displayedColumns = ['id', 'displayName', 'actions'];
  public complete = true;

  private roleDriver: boolean;

  constructor(
    private ticketService: TicketService,
    private dialog: MatDialog,
    @Inject('authService') private authService: IAuthenticationService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.getUserRoles().then((res: string[]) => this.roleDriver = res.includes(ROLES.DRIVER));
    this.getVehicle();
  }

  public getVehicle(): void {
    this.complete = false;
    this.ticketService.getVehicleNoTicket(this.roleDriver, this.fleetManagerId).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

  public modalTicket(vehicleId: number): void {
    const dialogRef = this.dialog.open(ModalTestTicketComponent, {
      width: '90%',
      height: '80%',
      data: { vehicleId: vehicleId, fleetManagerId: this.fleetManagerId, extend: false }
    });
    dialogRef.afterClosed().subscribe(save => {
      if (save) {
        this.getVehicle();
      }
    });
  }

}
