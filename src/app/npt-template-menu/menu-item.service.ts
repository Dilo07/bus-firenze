import { Injectable } from '@angular/core';
import { IMenuItemService, Menu } from '@npt/npt-template';

/* Roles allowed by the application */
export const ROLES = Object.freeze({
  DRIVER: 'driver',
  INSTALLER: 'installer',
  MOVYON: 'movyon',
  OPER_MOVYON: 'op_movyon',
  FLEETMNG: 'fleet'
});

const SUBMENU_ROUTES = [
];

const MENUITEMS = [
  {
    state: 'dashboard', name: 'Dashboard', type: 'link', icon: 'home', children: [], roles: []
  },
  {
    state: 'real-time', name: 'Real-time', type: 'link', icon: 'location_on', children: [], roles: []
  },
  {
    state: 'area-monitoring', name: 'Area-monitoring', type: 'link', icon: 'assignment', children: [], roles: []
  },
  {
    state: 'fleet-manager', name: 'Fleet-manager', type: 'link', icon: 'manage_accounts', children: [], roles: []
  }
];

@Injectable()
export class MenuItemService implements IMenuItemService {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
