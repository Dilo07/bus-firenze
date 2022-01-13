import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { TicketService } from 'src/app/services/ticket.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Ticket } from '../../domain/bus-firenze-domain';
import { ModalTestTicketComponent } from '../modal-test-ticket/modal-test-ticket.component';

@Component({
  selector: 'app-ticket',
  templateUrl: './add-ticket.component.html',
  styles: [`
  table { width: 100%; background-color: beige; }
  .mat-column-actions { max-width: 20%; display: table-column;}
  `
  ]
})
export class AddTicketComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public roleDriver: boolean;
  public roleMovyon: boolean;
  public dataSource = new MatTableDataSource<Ticket>();
  public displayedColumns = ['id', 'displayName', 'actions'];
  public complete = true;
  public viewFleetTable = false;

  private fleetManagerId: number;

  constructor(
    private ticketService: TicketService,
    private dialog: MatDialog,
    @Inject('authService') private authService: any
  ) { }

  ngOnInit(): void {
    this.authService.getUserRoles().then((res: string) => this.roleDriver = res.includes(ROLES.DRIVER));
    this.authService.getUserRoles().then((res: string) => this.roleMovyon = res.includes(ROLES.MOVYON));
    if (this.roleMovyon) {
      this.viewFleetTable = true;
    } else {
      this.getVehicle();
    }
  }

  private getVehicle(fleetManagerId?: number): void {
    if (fleetManagerId) {
      this.fleetManagerId = fleetManagerId;
      this.viewFleetTable = false;
    }
    this.complete = false;
    this.ticketService.getVehicleNoTicket(this.roleDriver, this.fleetManagerId).subscribe(
      data => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      () => this.complete = true,
      () => this.complete = true
    );
  }

  public modalTicket(VehicleId: number): void {
    const dialogRef = this.dialog.open(ModalTestTicketComponent, {
      width: '90%',
      height: '80%',
      data: { vehicleId: VehicleId, fleetManagerId: this.fleetManagerId, extend: false }
    });
    dialogRef.afterClosed().subscribe(save => {
      if (save) {
        this.getVehicle();
      }
    });
  }

}
