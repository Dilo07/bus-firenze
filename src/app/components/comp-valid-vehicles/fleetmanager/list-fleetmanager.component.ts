import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ValidVehicleService } from 'src/app/services/valid-vehicle.service';
import { FleetManager } from '../../domain/bus-firenze-domain';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-fleetmanager',
  templateUrl: './list-fleetmanager.component.html',
  styles: [`
  table { width: 100%; }
  @media(min-width: 1180px) {
    .mat-column-expandButton { max-width: 5% }
    .mat-column-id { max-width: 10%}
    .mat-column-name { max-width: 10%}
    .mat-column-surname { max-width: 10%}
    .mat-column-mobile { max-width: 20%}
    .mat-column-mail { max-width: 20%}
  }
  `],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListFleetmanagerComponent implements OnInit {
  public dataSource = new MatTableDataSource<FleetManager>();
  public displayedColumns = ['expandButton', 'id', 'name', 'surname', 'mobile', 'mail'];
  public expandedElement: FleetManager | null;
  public complete = true;

  constructor(
    private validVehiclerService: ValidVehicleService
  ) { }

  ngOnInit(): void {
    this.callFleetDeposit();
  }

  public callFleetDeposit(): void {
    this.complete = false;
    this.validVehiclerService.getFleetDeposit().subscribe(
      fleetM => this.dataSource.data = fleetM,
      () => this.complete = true,
      () => this.complete = true);
  }
}
