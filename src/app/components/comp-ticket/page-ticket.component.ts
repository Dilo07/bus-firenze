import { Component, Inject, OnInit } from '@angular/core';
import { IAuthenticationService } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';

@Component({
  selector: 'app-page-ticket',
  templateUrl: './page-ticket.component.html',
  styles: [``]
})
export class PageTicketComponent implements OnInit {
  public roleDriver: boolean;
  public roleMovyon: boolean;
  public viewFleetTable = false;
  public fmId: number;

  constructor(
    @Inject('authService') private authService: IAuthenticationService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.getUserRoles().then((res: string[]) => this.roleDriver = res.includes(ROLES.DRIVER));
    await this.authService.getUserRoles().then((res: string[]) => this.roleMovyon = res.includes(ROLES.MOVYON));
    if (this.roleMovyon) {
      this.viewFleetTable = true;
    }
  }

}
