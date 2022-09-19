import { Component, Input } from '@angular/core';
import { BillingItems } from 'src/app/components/domain/bus-firenze-domain';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styles: [``]
})
export class ListItemsComponent {
  @Input() billingItems: BillingItems[];

  constructor() { }

}
