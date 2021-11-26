import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FleetManagerService } from 'src/app/services/fleet-manager.service';
import { Drivers, FleetManager } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styles: [
  ]
})
export class DriversComponent implements OnInit {
  public Search: FormGroup;
  public fleetManager: FleetManager;
  public dataSource = new MatTableDataSource<Drivers>();

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private fleetManagerService: FleetManagerService,
    private formBuilder: FormBuilder) {
    this.fleetManager = this.router.getCurrentNavigation()?.extras.state?.fleetManager as FleetManager;
  }

  ngOnInit(): void {
    this.Search = this.formBuilder.group({
      CtrlSearch: [''],
    });
    this.getDrivers();
  }

  public getDrivers(): void {
    const keyword = this.Search.get('CtrlSearch').value;
    this.subscription.push(
      this.fleetManagerService.getDrivers(keyword, this.fleetManager?.id).subscribe(data => console.log(data)));
  }

}
