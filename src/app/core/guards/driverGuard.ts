import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { IAuthenticationService } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { DriverService } from 'src/app/services/driver.service';


@Injectable({
    providedIn: 'root'
})
export class DriveGuard implements CanActivate, OnDestroy {
    private roleDriver: boolean;
    private guard = true;
    private subscription: Subscription[] = [];
    constructor(
        private driverService: DriverService,
        private router: Router,
        @Inject('authService') private authService: IAuthenticationService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const id = this.authService.getUserId();
        if (id) { await this.authService.getUserRoles().then((res: string[]) => this.roleDriver = res.includes(ROLES.DRIVER)); }
        if (this.roleDriver) {
            this.subscription.push(this.driverService.getDriver().subscribe(
                respDriver => {
                    let resp = null;
                    respDriver.contacts.find(contact => {
                        if (contact.code === 1) {
                            resp = contact.value;
                        }
                    });
                    if (!resp) { // in caso in cui il cellulare non è presente apre il form
                        this.router.navigate(['user-driver/form-Driver'],
                            { state: { driver: respDriver, fleetManagerId: respDriver.fleetManagerId, cellularRequired: true } });
                        this.guard = false;
                    } else {
                        this.guard = true;
                    }
                },
                () => null,
                () => this.ngOnDestroy()
            ));
        }
        return this.guard;
    }

    ngOnDestroy(): void {
        this.subscription.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
