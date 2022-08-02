import { Component, Inject } from '@angular/core';
import { RepairShops } from '../domain/bus-firenze-domain';

@Component({
  selector: 'app-repair-shop',
  templateUrl: './repair-shop.component.html',
  styles: [`
  a {
    color: black;
    text-decoration: none;
  }
  .backgroundImgCustom{
    z-index: 1;
    background: url('src/assets/images/image_movyon2.png') no-repeat right;
  }

  .backgroundImgCustom2{
    z-index: 1;
    background: url('src/assets/images/image_movyon2.png') 90% 30% no-repeat;
  }
  `
  ]
})
export class RepairShopComponent {

  constructor(
    @Inject('repair_shopData') public repairShops: RepairShops[]
  ) { }

}
