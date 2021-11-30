import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { MatDialog } from '@angular/material/dialog';
import { FormDriverComponent } from '../comp-fleet-manager/drivers/modal-form-driver/form-driver.component';
import { Driver } from '../domain/bus-firenze-domain';
import { DriverService } from 'src/app/services/driver.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public roleDriver: boolean;

  private subscription: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private driverService: DriverService,
    @Inject('authService') private authService) {
    this.roleDriver = this.authService.getUserRoles().includes(ROLES.DRIVER);
  }

  ngOnInit(): void {
    if (this.roleDriver) {
      this.subscription.push(this.driverService.getDriver().subscribe(
        respDriver => {
          let res = null;
          respDriver.contacts.find(contact => {
            if (contact.code === 1) {
              res = contact.value;
            }
          });
          if (!res) { // in caso in cui il cellulare non è presente apre il form
            this.dialog.open(FormDriverComponent, {
              width: '90%',
              height: '100%',
              disableClose: true,
              data: { driver: respDriver, cellularRequired: true }
            });
          }
        }
      ));
    }
  }

  ngOnDestroy(): void{
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
