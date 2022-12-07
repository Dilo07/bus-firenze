import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { BillingItems } from 'src/app/components/domain/bus-firenze-domain';
import { BillingItemsService } from 'src/app/services/billing-items.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-emitted-penalties',
  templateUrl: './emitted-penalties.component.html',
  styles: [`
  .mat-elevation-z8 { margin: 20px; }
  `]
})
export class EmittedPenaltiesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() fleetId: number;
  @Input() keyword: string;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public maxDate = moment().toDate();
  public formGroup: FormGroup;
  public dataSource = new MatTableDataSource<BillingItems>();
  public displayedColumns = ['id', 'plate', 'date', 'price', 'billingType'];

  private subscription: Subscription[] = [];

  constructor(
    private billingItemService: BillingItemsService
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      ctrlRangeStart: new FormControl(moment().subtract(30, 'day').toDate(), Validators.required),
      ctrlRangeEnd: new FormControl(moment().toDate(), Validators.required),
    });
    this.getPenalties();
  }

  ngOnChanges(): void {
    // filtra in base al cambio input keyword
    this.dataSource.filter = this.keyword.trim();
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      return data.lpn.toLowerCase().includes(filter);
    };
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public getPenalties(): void {
    if (!this.formGroup.invalid) {
      const start = moment(this.formGroup.get('ctrlRangeStart').value).format('yyyy-MM-DD');
      const end = moment(this.formGroup.get('ctrlRangeEnd').value).format('yyyy-MM-DD');
      this.subscription.push(this.billingItemService.getPenaltiesByFmId(start, end, null, this.fleetId).subscribe(
        penalties => (this.dataSource.data = penalties, this.dataSource.paginator = this.paginator, this.dataSource.sort = this.sort)
      ));
    }
  }

}
