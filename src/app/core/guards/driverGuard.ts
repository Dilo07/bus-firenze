import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { DriverService } from 'src/app/services/driver.service';


@Injectable({
    providedIn: 'root'
})
export class DriveGuard implements CanActivate {
    private roleDriver: boolean;
    private guard = true;
    constructor(
        private driverService: DriverService,
        private router: Router,
        @Inject('authService') private authService
    ) {
        this.roleDriver = this.authService.getUserRoles().includes(ROLES.DRIVER);
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (this.roleDriver) {
            this.driverService.getDriver().subscribe(
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
                    }else{
                        this.guard = true;
                    }
                }
            );
        }
        return this.guard;
    }
}
