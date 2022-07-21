import { Component, Inject, OnInit } from '@angular/core';
import { IAuthenticationService } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';

@Component({
  selector: 'app-redirect-movyon',
  templateUrl: './page-payments.component.html',
  styles: [
  ]
})
export class PagePaymentsComponent implements OnInit {
  public roleMovyon: boolean;
  public roleFleet: boolean;
  public viewFleetTable = false;
  public fmId: number;

  constructor(
    @Inject('authService') private authService: IAuthenticationService,
    @Inject('hideBillingData') public hideBilling: boolean
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.getUserRoles().then((res: string[]) => this.roleMovyon = res.includes(ROLES.MOVYON));
    await this.authService.getUserRoles().then((res: string[]) => this.roleFleet = res.includes(ROLES.FLEETMNG));
    if (this.roleMovyon) {
      this.viewFleetTable = true;
    }
  }

}
