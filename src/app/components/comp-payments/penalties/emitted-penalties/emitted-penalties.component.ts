import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { BillingItems } from 'src/app/components/domain/bus-firenze-domain';
import { BillingItemsService } from 'src/app/services/billing-items.service';

@Component({
  selector: 'app-emitted-penalties',
  templateUrl: './emitted-penalties.component.html',
  styles: [` `]
})
export class EmittedPenaltiesComponent implements OnInit {
  @Input() fleetId: number;
  public maxDate = moment().toDate();
  public formGroup: FormGroup;
  public dataSource = new MatTableDataSource<BillingItems>();
  public displayedColumns = ['id', 'plate', 'date', 'price', 'typeId'];

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

  getPenalties(): void {
    if (!this.formGroup.invalid) {
      const start = moment(this.formGroup.get('ctrlRangeStart').value).format('yyyy-MM-DD');
      const end = moment(this.formGroup.get('ctrlRangeEnd').value).format('yyyy-MM-DD');
      this.billingItemService.getPenaltiesByFmId(start, end, null, this.fleetId).subscribe(
        penalties => this.dataSource.data = penalties
      );
    }
  }

}
