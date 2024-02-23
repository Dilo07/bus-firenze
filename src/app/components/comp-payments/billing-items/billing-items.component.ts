import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { BillingItemsService } from 'src/app/services/billing-items.service';
import { BILLING_STATUS } from '../../domain/bus-firenze-constants';
import { BillingItemsAgg, FleetManager } from '../../domain/bus-firenze-domain';
import { Breadcrumb } from '@npt/npt-template';

@Component({
  selector: 'app-billing-items',
  templateUrl: './billing-items.component.html',
  styles: [`
  .mat-elevation-z8 { margin: 20px; }
  table { width: 100%; }
  @media(min-width: 1180px) {
    .mat-column-expandButton { max-width: 10%; }
    .mat-column-gopId { max-width: 10%;}
    .mat-column-billingType { max-width: 30%;}
    .mat-column-status { max-width: 10%;}
    .mat-column-price { max-width: 10%;}
    .mat-column-quantity { max-width: 10%;}
    .mat-column-priceTot { max-width: 10%;}
    .mat-column-action { display: table-column; text-align: end;}
  }
  `
  ]
})
export class BillingItemsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public fleetManager: FleetManager;
  public dataSource = new MatTableDataSource<BillingItemsAgg>();
  public displayedColumns = ['nptGopId', 'billingType', 'status', 'price', 'quantity', 'priceTot', 'action'];
  public complete = true;
  public billingStatus = [BILLING_STATUS.all, BILLING_STATUS.unknown, BILLING_STATUS.pending, BILLING_STATUS.success, BILLING_STATUS.failed];
  public maxDate = moment().toDate();
  public formGroup: FormGroup;
  public expandedElement: BillingItemsAgg | null;
  public breadCrumb: Breadcrumb[] = [];

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private billingItemsService: BillingItemsService) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
    if (this.router.getCurrentNavigation()?.extras.state?.stateBreadCrumb as FleetManager) {
      this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.stateBreadCrumb;
    };
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = new FormGroup({
      ctrlBillingStatus: new FormControl(BILLING_STATUS.all, Validators.required),
      ctrlRangeStart: new FormControl(moment().subtract(30, 'day').toDate(), Validators.required),
      ctrlRangeEnd: new FormControl(moment().toDate(), Validators.required),
    });
    this.getBillingItems();
    this.breadCrumb = [
      {
        label: 'MENU.Payments',
        url: '/payments'
      }
    ];
    if (this.fleetManager) { // ruolo admin
      this.breadCrumb.push(
        {
          label: `${this.fleetManager.name} ${this.fleetManager.surname}`,
          url: '../selection',
          state: this.fleetManager
        },
        {
          label: 'MENU.Billing',
          url: ''
        });
    } else { // ruolo fleet manager
      this.breadCrumb.push({
        label: 'MENU.Billing',
        url: ''
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public getBillingItems(): void {
    if (!this.formGroup.invalid) {
      this.complete = false;
      const start = moment(this.formGroup.get('ctrlRangeStart').value).format('yyyy-MM-DD');
      const end = moment(this.formGroup.get('ctrlRangeEnd').value).format('yyyy-MM-DD');
      const billingStatus = this.formGroup.get('ctrlBillingStatus').value;
      this.subscription.push(this.billingItemsService.getBillingItemsAggregate(start, end, billingStatus, this.fleetManager?.id).subscribe({
        next: items => (this.dataSource.data = items, this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator),
        error: () => this.complete = true,
        complete: () => this.complete = true
      }));
    }
  }

}
