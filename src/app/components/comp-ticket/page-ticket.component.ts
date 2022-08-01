import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthenticationService } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';

@Component({
  selector: 'app-page-ticket',
  templateUrl: './page-ticket.component.html',
  styles: [``]
})
export class PageTicketComponent implements OnInit {
  public index: number;
  public roleMovyon: boolean;
  public viewFleetTable = false;
  public fmId: number;

  constructor(
    private router: Router,
    @Inject('authService') private authService: IAuthenticationService
  ) {
    this.index = this.router.getCurrentNavigation()?.extras.state?.index ? this.router.getCurrentNavigation()?.extras.state?.index : 0;
  }

  async ngOnInit(): Promise<void> {
    await this.authService.getUserRoles().then((res: string[]) => this.roleMovyon = res.includes(ROLES.MOVYON));
    if (this.roleMovyon) {
      this.viewFleetTable = true;
    }
  }

}
