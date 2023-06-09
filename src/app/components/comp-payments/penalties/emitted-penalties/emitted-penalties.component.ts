import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { BillingItems, FleetManager } from 'src/app/components/domain/bus-firenze-domain';
import { BillingItemsService } from 'src/app/services/billing-items.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Breadcrumb } from '@npt/npt-template';

@Component({
  selector: 'app-emitted-penalties',
  templateUrl: './emitted-penalties.component.html',
  styles: [`
  .mat-elevation-z8 { margin: 20px; }
  `]
})
export class EmittedPenaltiesComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public fleetManager: FleetManager;
  public maxDate = moment().toDate();
  public formGroup: FormGroup;
  public dataSource = new MatTableDataSource<BillingItems>();
  public displayedColumns = ['id', 'plate', 'date', 'price', 'billingType'];
  public breadCrumb: Breadcrumb[] = [];
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private billingItemService: BillingItemsService
  ) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      ctrlRangeStart: new FormControl(moment().subtract(30, 'day').toDate(), Validators.required),
      ctrlRangeEnd: new FormControl(moment().toDate(), Validators.required),
      ctrlSearch: new FormControl('')
    });
    this.getPenalties();
    this.breadCrumb = [
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
        label: 'MENU.Penalties',
        url: '../penalties',
        state: this.fleetManager
      },
      {
        label: 'PENALTIES.EMITTED',
        url: ''
      }
    ];
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public getPenalties(): void {
    if (!this.formGroup.invalid) {
      this.complete = false;
      const search = this.formGroup.get('ctrlSearch').value;
      const start = moment(this.formGroup.get('ctrlRangeStart').value).format('yyyy-MM-DD');
      const end = moment(this.formGroup.get('ctrlRangeEnd').value).format('yyyy-MM-DD');
      this.subscription.push(this.billingItemService.getPenaltiesByFmId(start, end, search, null, this.fleetManager?.id).subscribe({
        next: (penalties) => (this.dataSource.data = penalties, this.dataSource.paginator = this.paginator, this.dataSource.sort = this.sort),
        error: () => this.complete = true,
        complete: () => this.complete = true
      }));
    }
  }

}
