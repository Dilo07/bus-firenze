import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BillingItems } from 'src/app/components/domain/bus-firenze-domain';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styles: [``]
})
export class ListItemsComponent implements OnInit {
  @Input() billingItems: BillingItems[];
  @Input() gopId: number;
  public dataSource = new MatTableDataSource<BillingItems>();
  public displayedColumns = ['lpn', 'lpnNat', 'startPeriod', 'endPeriod', 'price'];

  ngOnInit(): void {
    this.dataSource.data = this.billingItems;
  }

}
