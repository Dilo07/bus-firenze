import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BillingItems } from 'src/app/components/domain/bus-firenze-domain';

@Component({
  selector: 'app-table-items',
  templateUrl: './table-items.component.html',
  styles: [`
  mat-table { width: 1000px;}
  `]
})
export class TableItemsComponent implements OnInit {
  @Input() billingItems: BillingItems[];
  public dataSource = new MatTableDataSource<BillingItems>();
  public displayedColumns = ['id', 'startDate', 'endDate', 'price'];

  constructor() { }

  ngOnInit(): void {
    this.dataSource.data = this.billingItems;
  }

}
