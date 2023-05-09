import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Breadcrumb } from '@npt/npt-template';
import { BillingItems, BillingType, FleetManager } from 'src/app/components/domain/bus-firenze-domain';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styles: [`
  table { width: 100%; }
  .mat-elevation-z8 { margin: 20px; }
  @media(min-width: 1180px) {
    .mat-column-lpn { max-width: 20%}
    .mat-column-lpnNat { max-width: 20%;}
    .mat-column-periodOrDate { max-width: 40%;}
    .mat-column-price { max-width: 20%;}
  }
  `]
})
export class ListItemsComponent implements OnInit {
  public billingItems: BillingItems[];
  public billingType: BillingType;
  public gopId: number;
  public fleetManager: FleetManager;
  public breadCrumb: Breadcrumb[] = [];
  public dataSource = new MatTableDataSource<BillingItems>();
  public displayedColumns = ['lpn', 'lpnNat', 'periodOrDate', 'price'];


  constructor(
    private translate: TranslateService,
    private router: Router) {
    this.gopId = this.router.getCurrentNavigation()?.extras.state.gopId as number;
    this.billingItems = this.router.getCurrentNavigation()?.extras.state?.billingItems as BillingItems[];
    this.billingType = this.router.getCurrentNavigation()?.extras.state?.billingType as BillingType;
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  ngOnInit(): void {
    this.dataSource.data = this.billingItems;
    this.breadCrumb.push(
      {
        label: 'MENU.Payments',
        url: '/payments'
      },
      {
        label: `${this.fleetManager.name} ${this.fleetManager.surname}`,
        url: '../selection',
        state: this.fleetManager
      },
      {
        label: 'MENU.Billing',
        url: '../billing',
        state: this.fleetManager
      },
      {
        label: `${this.translate.instant('BILLING_ITEMS.DETAIL')} Id ${this.gopId}`,
        url: ''
      });
  }
}
