import { Component, Input } from '@angular/core';
import { BillingItems } from 'src/app/components/domain/bus-firenze-domain';

@Component({
  selector: 'app-table-items',
  templateUrl: './table-items.component.html',
  styles: [``]
})
export class TableItemsComponent {
  @Input() billingItems: BillingItems[];

  constructor() { }

}
