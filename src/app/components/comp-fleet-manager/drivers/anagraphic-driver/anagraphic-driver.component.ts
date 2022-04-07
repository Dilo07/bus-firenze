import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Driver } from 'src/app/components/domain/bus-firenze-domain';
import { DriverService } from 'src/app/services/driver.service';

@Component({
  selector: 'app-anagraphic-driver',
  templateUrl: './anagraphic-driver.component.html',
  styles: [
  ]
})
export class AnagraphicDriverComponent implements OnInit, OnDestroy {
  public complete = true;
  public driver: Driver;

  private subscription: Subscription[] = [];

  constructor(
    private driverService: DriverService
  ) { }

  ngOnInit(): void {
    this.complete = false;
    this.subscription.push(this.driverService.getDriver().subscribe(
      data => this.driver = data,
      () => this.complete = true,
      () => { this.complete = true; }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
