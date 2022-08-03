import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { BillingItemsService } from 'src/app/services/billing-items.service';
import { BILLING_STATUS } from '../../domain/bus-firenze-constants';
import { BillingItemsAgg } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-billing-items',
  templateUrl: './billing-items.component.html',
  styles: [`
  .mat-elevation-z8 { margin: 20px; }
  table { width: 100%; }
  @media(min-width: 1180px) {
    .mat-column-gopId { max-width: 10%;}
    .mat-column-billingType { max-width: 40%;}
    .mat-column-price { max-width: 10%;}
    .mat-column-quantity { max-width: 10%;}
    .mat-column-priceTot { max-width: 10%;}
    .mat-column-button { max-width: 20%; display: table-column; text-align: end;}
  }
  ::ng-deep .menu-style {
    padding: 5px;
    background: #E4F1F5;
    min-width: 400px;
  }
  `
  ]
})
export class BillingItemsComponent implements OnInit, OnDestroy {
  @Input() public fleetManagerId: number;
  public dataSource = new MatTableDataSource<BillingItemsAgg>();
  public displayedColumns = ['gopId', 'billingType', 'price', 'quantity', 'priceTot', 'button'];
  public complete = true;
  public billingStatus = [BILLING_STATUS.unknown, BILLING_STATUS.pending, BILLING_STATUS.success, BILLING_STATUS.failed];
  public maxDate = moment().toDate();
  public formGroup: FormGroup;
  public expandedElement: BillingItemsAgg | null;

  private subscription: Subscription[] = [];

  constructor(
    private billingItemsService: BillingItemsService) { }

  async ngOnInit(): Promise<void> {
    this.formGroup = new FormGroup({
      ctrlBillingStatus: new FormControl(BILLING_STATUS.pending),
      ctrlRangeStart: new FormControl(moment().subtract(30, 'day').toDate(), Validators.required),
      ctrlRangeEnd: new FormControl(moment().toDate(), Validators.required),
    });
    this.getBillingItems();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public getBillingItems(): void {
    this.complete = false;
    const start = moment(this.formGroup.get('ctrlRangeStart').value).format('yyyy-MM-DD');
    const end = moment(this.formGroup.get('ctrlRangeEnd').value).format('yyyy-MM-DD');
    const billingStatus = this.formGroup.get('ctrlBillingStatus').value;
    this.subscription.push(this.billingItemsService.getBillingItemsAggregate(start, end, billingStatus, this.fleetManagerId).subscribe({
      next: items => this.dataSource.data = items,
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

}
