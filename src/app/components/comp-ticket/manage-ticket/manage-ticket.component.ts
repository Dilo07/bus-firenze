import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { TicketService } from 'src/app/services/ticket.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DisplayName } from '../../domain/bus-firenze-domain';
import { ModalTestTicketComponent } from '../modal-test-ticket/modal-test-ticket.component';

@Component({
  selector: 'app-ticket',
  templateUrl: './manage-ticket.component.html',
  styles: [`
  table { width: 100%; background-color: beige; }
  .mat-column-actions { max-width: 20%; display: table-column;}
  `
  ]
})
export class ManageTicketComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public roleDriver: boolean;
  public dataSource = new MatTableDataSource<DisplayName>();
  public displayedColumns = ['id', 'displayName', 'actions'];
  public complete = true;

  constructor(
    private ticketService: TicketService,
    private dialog: MatDialog,
    @Inject('authService') private authService: any
  ) { }

  ngOnInit(): void {
    this.roleDriver = this.authService.getUserRoles().includes(ROLES.DRIVER);
    this.getVehicle();
  }

  private getVehicle(): void {
    this.complete = false;
    this.ticketService.getVehicleNoTicket(this.roleDriver).subscribe(
      data => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      () => null,
      () => this.complete = true
    );
  }

  public modalTicket(VehicleId: number): void{
    this.dialog.open(ModalTestTicketComponent, {
      width: '90%',
      height: '50%',
      data: {vehicleId: VehicleId}
    });
  }

}
