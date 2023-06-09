import { Component, Inject } from '@angular/core';
import { RepairShops } from '../domain/bus-firenze-domain';

@Component({
  selector: 'app-repair-shop',
  templateUrl: './repair-shop.component.html',
  styles: [``]
})
export class RepairShopComponent {

  constructor(
    @Inject('repair_shopData') public repairShops: RepairShops[]
  ) { }

}
