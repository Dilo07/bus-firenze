import { Component, Inject, OnInit } from '@angular/core';
import { RepairShops } from '../domain/bus-firenze-domain';

@Component({
  selector: 'app-repair-shop',
  templateUrl: './repair-shop.component.html',
  styles: [`
  a {
    color: black;
    text-decoration: none;
  }
  `
  ]
})
export class RepairShopComponent implements OnInit {

  constructor(
    @Inject('repair_shopData') public repairShops: RepairShops[]
  ) { }

  ngOnInit(): void { }

}
