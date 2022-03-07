import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ValidVehicleService } from 'src/app/services/valid-vehicle.service';
import { FleetManager, Vehicle } from '../../domain/bus-firenze-domain';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-fleetmanager',
  templateUrl: './list-fleetmanager.component.html',
  styles: [`
  table { width: 100%; background-color: beige; }
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

  private vehicle = new Vehicle();

  constructor(
    private validVehiclerService: ValidVehicleService
  ) { }

  ngOnInit(): void {
    this.callFleetDeposit();
  }

  private callFleetDeposit(): void {
    this.validVehiclerService.getFleetDeposit().subscribe(
      data => this.dataSource.data = data);
  }
}
