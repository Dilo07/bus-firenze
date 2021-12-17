import { Component, Input, OnInit } from '@angular/core';
import { TripStat } from 'src/app/components/domain/bus-firenze-domain';

@Component({
  selector: 'app-trip-statistic',
  templateUrl: './trip-statistic.component.html',
  styles: [
  ]
})
export class TripStatisticComponent implements OnInit {
  @Input() vehicleStatTrip: TripStat;
  @Input() viewOuter: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
