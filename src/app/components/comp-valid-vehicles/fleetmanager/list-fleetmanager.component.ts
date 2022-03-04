import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ValidVehicleService } from 'src/app/services/valid-vehicle.service';
import { FleetManager } from '../../domain/bus-firenze-domain';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-fleetmanager',
  templateUrl: './list-fleetmanager.component.html',
  styles: [`
  table { width: 100%; background-color: beige; }
  .example-radio-group {
    display: flex;
    flex-direction: column;
    margin: 15px 0;
  }

  .example-radio-button {
    margin: 5px;
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
  public displayedColumns = ['expandButton', 'id', 'name', 'surname'];
  public expandedElement: FleetManager | null;

  constructor(
    private validVehiclerService: ValidVehicleService
  ) { }

  ngOnInit(): void {
    this.callFleetDeposit();
  }

  private callFleetDeposit(): void {
    this.validVehiclerService.getFleetDeposit().subscribe(
      data => this.dataSource.data = data
    );
  }
}
