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
  { state: 'assign-obu', name: 'Assign-obu', icon: 'build', roles: [ROLES.INSTALLER] },
  { state: 'change-obu', name: 'Change-obu', icon: 'build', roles: [ROLES.INSTALLER] },
  { state: 'remove-obu', name: 'Remove-obu', icon: 'build', roles: [ROLES.INSTALLER] },
  { state: 'change-plate', name: 'Change-plate', icon: 'build', roles: [ROLES.INSTALLER] },
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
  },
  {
    state: 'manage-obu', name: 'Manage-obu', type: 'submenu', icon: 'assignment',
    children: [SUBMENU_ROUTES[0], SUBMENU_ROUTES[1], SUBMENU_ROUTES[2], SUBMENU_ROUTES[3]],
    roles: [ROLES.INSTALLER]
  },
];

@Injectable()
export class MenuItemService implements IMenuItemService {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
