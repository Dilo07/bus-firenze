import { Component, Inject, OnInit } from '@angular/core';
import { IAuthenticationService } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { BillingItemsService } from 'src/app/services/billing-items.service';
import { BillingItems } from '../../domain/bus-firenze-domain';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-billing-items',
  templateUrl: './billing-items.component.html',
  styles: [`
  table { width: 100%; }
  `
  ]
})
export class BillingItemsComponent implements OnInit {
  public viewFleetTable: boolean;
  public dataSource = new MatTableDataSource<BillingItems>();
  public displayedColumns = ['id', 'fmId', 'vehicleId', 'typeId', 'price'];
  public roleMovyon: boolean;
  public complete = true;

  private fleetManagerId: number;

  constructor(
    private billingItemsService: BillingItemsService,
    @Inject('authService') private authService: IAuthenticationService) { }

  async ngOnInit(): Promise<void> {
    await this.authService.getUserRoles().then((res: string[]) => this.roleMovyon = res.includes(ROLES.MOVYON) || res.includes(ROLES.OPER_MOVYON));
    if (this.roleMovyon) {
      this.viewFleetTable = true;
    } else {
      this.getBillingItems();
    }
  }

  getBillingItems(fmId?: number): void{
    this.complete = false;
    if (fmId) { // se è op o movyon verrà valorizzato flmId altrimenti se ruolo fm non verrà valorizzato
      this.fleetManagerId = fmId;
      this.viewFleetTable = false;
    }
    this.billingItemsService.getBillingItems(this.fleetManagerId).subscribe(
      items => this.dataSource.data = items,
      () => this.complete = true,
      () => this.complete = true
    );
  }

}
