import { Component, Inject, OnInit } from '@angular/core';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './manage-ticket.component.html',
  styles: [
  ]
})
export class ManageTicketComponent implements OnInit {
  public roleDriver: boolean;

  constructor(
    private ticketService: TicketService,
    @Inject('authService') private authService: any
  ) { }

  ngOnInit(): void {
    this.roleDriver = this.authService.getUserRoles().includes(ROLES.DRIVER);
    this.getVehicle();
  }

  private getVehicle(): void {
    this.ticketService.getVehicleNoTicket(this.roleDriver).subscribe(
      data => console.log(data)
    );
  }

}
