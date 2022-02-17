import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { IAuthenticationService, SessionService } from '@npt/npt-template';
import { Subscription } from 'rxjs';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { DriverService } from 'src/app/services/driver.service';


@Injectable({
    providedIn: 'root'
})
export class DriveGuard implements CanActivate, OnDestroy {
    private subscription: Subscription[] = [];
    constructor(
        private driverService: DriverService,
        private sessionService: SessionService,
        private router: Router,
        @Inject('authService') private authService: IAuthenticationService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        let guard: boolean;
        const checkGuard = this.sessionService.getSessionStorage('checkDriverGuard');
        const id = this.authService.getUserId();
        if (!checkGuard) { // verifica in sessione che non sia già stata fatta la call api
            if (id) {
                const roles = await this.authService.getUserRoles();
                if (roles.includes(ROLES.DRIVER)) {
                    const respDriver = await this.driverService.getDriver().toPromise();
                    let mobileNum = null;
                    respDriver.contacts.find(contact => {
                        if (contact.code === 1) {
                            mobileNum = contact.value;
                        }
                    });
                    if (!mobileNum) { // in caso in cui il cellulare non è presente apre il form
                        this.router.navigate(['user-driver/form-Driver'],
                            { state: { driver: respDriver, fleetManagerId: respDriver.fleetManagerId, cellularRequired: true } });
                        guard = false;
                    } else {
                        guard = true;
                        this.sessionService.setSessionStorage('checkDriverGuard', true);
                    }
                } else { // se non è un driver passa la guardia
                    guard = true;
                    this.sessionService.setSessionStorage('checkDriverGuard', true);
                }
            }
        }else{
            guard = true;
        }
        return guard;
    }

    ngOnDestroy(): void {
        this.subscription.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
