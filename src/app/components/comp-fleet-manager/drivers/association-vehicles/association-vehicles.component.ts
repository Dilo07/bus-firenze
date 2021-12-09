import { Component, OnInit } from '@angular/core';
import { DriverService } from 'src/app/services/driver.service';

@Component({
  selector: 'app-association-vehicles',
  templateUrl: './association-vehicles.component.html',
  styles: [
  ]
})
export class AssociationVehiclesComponent implements OnInit {

  constructor(
    private driverService: DriverService
  ) { }

  ngOnInit(): void {
    this.driverService.getVehiclesByDriver().subscribe(
      data => console.log(data)
    );
  }

}
