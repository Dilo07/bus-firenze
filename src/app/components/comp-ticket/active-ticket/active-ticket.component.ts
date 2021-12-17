import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { TicketService } from 'src/app/services/ticket.service';
import { CompleteFleetManager, Ticket } from '../../domain/bus-firenze-domain';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-active-ticket',
  templateUrl: './active-ticket.component.html',
  styles: [``],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ActiveTicketComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public roleDriver: boolean;
  public roleMovyon: boolean;
  public viewFleetTable = false;
  public dataSource = new MatTableDataSource<Ticket>();
  public displayedColumns = ['ticketId', 'lpn', 'ticketStart', 'ticketEnd', 'expandButton', 'actions'];
  public complete = true;
  public expandedElement: CompleteFleetManager | null;

  private fleetManagerId: number;

  constructor(
    private ticketService: TicketService,
    @Inject('authService') private authService: any
  ) { }

  ngOnInit(): void {
    this.roleDriver = this.authService.getUserRoles().includes(ROLES.DRIVER);
    this.roleMovyon = this.authService.getUserRoles().includes(ROLES.MOVYON);
    if (this.roleMovyon) {
      this.viewFleetTable = true;
    } else {
      // get ticket active
    }
  }

  public getActiveTicket(fleetManagerId?: number): void {
    if (fleetManagerId) {
      this.fleetManagerId = fleetManagerId;
      this.viewFleetTable = false;
    }
    this.complete = false;
    this.ticketService.getActiveTicket().subscribe(
      data => {
        console.log(data)
        this.dataSource.data = data,
          this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      () => this.complete = true,
      () => this.complete = true
    );
  }

}
