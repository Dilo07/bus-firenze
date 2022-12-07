import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BillingItems, BillingType } from 'src/app/components/domain/bus-firenze-domain';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styles: [`
  .mat-elevation-z8 {
    width: 870px;
    margin: 10px;
  }
  @media(min-width: 1180px) {
    .mat-column-lpn { max-width: 20%}
    .mat-column-lpnNat { max-width: 20%;}
    .mat-column-periodOrDate { max-width: 40%;}
    .mat-column-price { max-width: 20%;}
  }
  `]
})
export class ListItemsComponent implements OnInit {
  @Input() billingItems: BillingItems[];
  @Input() billingType: BillingType;
  public dataSource = new MatTableDataSource<BillingItems>();
  public displayedColumns = ['lpn', 'lpnNat', 'periodOrDate', 'price'];

  ngOnInit(): void {
    this.dataSource.data = this.billingItems;
  }

}
