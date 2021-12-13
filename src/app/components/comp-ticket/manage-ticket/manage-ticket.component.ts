import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { TicketService } from 'src/app/services/ticket.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DisplayName } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-ticket',
  templateUrl: './manage-ticket.component.html',
  styles: [`
  table { width: 100%; background-color: beige; }
  `
  ]
})
export class ManageTicketComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public roleDriver: boolean;
  public dataSource = new MatTableDataSource<DisplayName>();
  public displayedColumns = ['id', 'displayName'];
  public complete = true;

  constructor(
    private ticketService: TicketService,
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

}
