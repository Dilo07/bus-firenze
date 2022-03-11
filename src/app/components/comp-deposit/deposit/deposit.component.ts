import { Component, Inject, OnInit } from '@angular/core';
import { IAuthenticationService } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styles: [
  ]
})
export class DepositComponent implements OnInit {
  public viewFleetTable = false;
  public roleMovyon: boolean;

  private fleetManagerId: number;

  constructor(
    @Inject('authService') private authService: IAuthenticationService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.getUserRoles().then((res: string[]) => this.roleMovyon = res.includes(ROLES.MOVYON));
    if (this.roleMovyon) {
      this.viewFleetTable = true;
    } else {
      this.getVehicle();
    }
  }

  getVehicle(fleetManagerId?: any): void{
    if (fleetManagerId) {
      this.fleetManagerId = fleetManagerId;
      this.viewFleetTable = false;
    }
  }

}
