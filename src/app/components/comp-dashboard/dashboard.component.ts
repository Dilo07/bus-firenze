import { Component, Inject, OnInit } from '@angular/core';
import { IAuthenticationService } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public user: any;
  public role: string;
  public roles = ROLES;

  constructor(
    @Inject('authService') private authService: IAuthenticationService,
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn().then(logged => {
      if (logged) { this.authService.loadUserProfile().then(res => this.user = res); }
    });
    this.authService.getUserRoles().then((res: string[]) => {
      if (res.includes(ROLES.MOVYON)) { this.role = ROLES.MOVYON; }
      if (res.includes(ROLES.OPER_MOVYON)) { this.role = ROLES.OPER_MOVYON; }
      if (res.includes(ROLES.FLEETMNG)) { this.role = ROLES.FLEETMNG; }
      if (res.includes(ROLES.INSTALLER)) { this.role = ROLES.INSTALLER; }
      if (res.includes(ROLES.DRIVER)) { this.role = ROLES.DRIVER; }
    });
  }
}
