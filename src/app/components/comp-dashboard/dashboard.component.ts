import { Component, Inject, OnInit } from '@angular/core';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { MatDialog } from '@angular/material/dialog';
import { FormDriverComponent } from '../comp-fleet-manager/drivers/modal-form-driver/form-driver.component';
import { Driver } from '../domain/bus-firenze-domain';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public roleDriver: boolean;

  constructor(
    private dialog: MatDialog,
    @Inject('authService') private authService) {
    this.roleDriver = this.authService.getUserRoles().includes(ROLES.DRIVER);
   }

  ngOnInit(): void {
    if (this.roleDriver){
      // chiamare servizio per sapere se deve inserire il cellulare
      let dRiver = new Driver();
      dRiver = {id: 1, name: 'Andrea', surname: 'Di Lorenzo', contacts: [{code: 3, value: 'andrea@gmail.com'}], fleetManagerId: 1};
      this.dialog.open(FormDriverComponent, {
        width: '90%',
        height: '100%',
        disableClose: true,
        data: {driver: dRiver, cellularRequired: true}
      });
    }
  }

}
