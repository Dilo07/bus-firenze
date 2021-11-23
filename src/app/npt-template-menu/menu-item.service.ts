import { Injectable } from '@angular/core';
import { IMenuItemService, Menu } from '@npt/npt-template';

/* Roles allowed by the application */
export const ROLES = Object.freeze({
  DRIVER: 'driver',
  INSTALLER: 'installer',
  MOVYON: 'movyon',
  OPER_MOVYON: 'opmovyon',
  FLEETMNG: 'fleet'
});

const SUBMENU_ROUTES = [
  { state: 'fleet-manager-manage', name: 'Manage-Fleet-manager', icon: 'manage_accounts', roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] },
  { state: 'fleet-manager-valid', name: 'Valid-Fleet-manager', icon: 'manage_accounts', roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] },
  { state: 'vehicles', name: 'Vehicles', icon: 'directions_car', roles: [ROLES.FLEETMNG] },
  { state: 'anagraphic', name: 'Anagraphic', icon: 'manage_accounts', roles: [ROLES.FLEETMNG] },
  { state: 'assign-obu', name: 'Assign-obu', icon: 'build', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'change-obu', name: 'Change-obu', icon: 'build', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'remove-obu', name: 'Remove-obu', icon: 'build', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'change-plate', name: 'Change-plate', icon: 'build', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
];

const MENUITEMS = [
  {
    state: 'dashboard', name: 'Dashboard', type: 'link', icon: 'home', children: [], roles: []
  },
  {
    state: 'real-time', name: 'Real-time', type: 'link', icon: 'location_on', children: [], roles: [ROLES.FLEETMNG]
  },
  {
    state: 'area-monitoring', name: 'Area-monitoring', type: 'link', icon: 'assignment',
    children: [], roles: [ROLES.MOVYON, ROLES.OPER_MOVYON]
  },
  {
    state: '', name: 'Fleet-manager', type: 'submenu', icon: 'manage_accounts',
    children: [SUBMENU_ROUTES[0], SUBMENU_ROUTES[1]], roles: [ROLES.MOVYON, ROLES.OPER_MOVYON]
  },
  {
    state: 'user-fleet-manager', name: 'User-Fleet', type: 'submenu', icon: 'manage_accounts',
    children: [SUBMENU_ROUTES[2], SUBMENU_ROUTES[3]], roles: [ROLES.FLEETMNG]
  },
  {
    state: 'manage-obu', name: 'Manage-obu', type: 'submenu', icon: 'assignment',
    children: [SUBMENU_ROUTES[4], SUBMENU_ROUTES[5], SUBMENU_ROUTES[6], SUBMENU_ROUTES[7]],
    roles: [ROLES.MOVYON, ROLES.INSTALLER]
  },
];

@Injectable()
export class MenuItemService implements IMenuItemService {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
