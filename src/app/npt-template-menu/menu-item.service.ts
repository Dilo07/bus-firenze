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
  { state: 'drivers', name: 'Drivers', icon: 'airline_seat_recline_normal', roles: [ROLES.FLEETMNG] },
  { state: 'anagraphic-fleet', name: 'Anagraphic', icon: 'manage_accounts', roles: [ROLES.FLEETMNG] },
  { state: 'assign-obu', name: 'Assign-obu', icon: 'new_label', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'change-obu', name: 'Change-obu', icon: 'assignment_return', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'remove-obu', name: 'Remove-obu', icon: 'code_off', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'change-plate', name: 'Change-plate', icon: 'assignment_return', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'vehicle-document', name: 'Vehicle-document', icon: 'description', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'add-appointment', name: 'Add-appointment', icon: 'contact_phone', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'manage-appointment', name: 'Manage-appointment', icon: 'contact_phone', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'anagraphic-driver', name: 'Anagraphic', icon: 'manage_accounts', roles: [ROLES.DRIVER] },
  { state: 'association-driver', name: 'Association-vehicles', icon: 'directions_car', roles: [ROLES.DRIVER] },
  { state: 'manage-ticket', name: 'Manage-ticket', icon: 'receipt_long', roles: [ROLES.MOVYON, ROLES.FLEETMNG, ROLES.DRIVER] },
  { state: 'active-ticket', name: 'Active-ticket', icon: 'receipt_long', roles: [ROLES.MOVYON, ROLES.FLEETMNG, ROLES.DRIVER] },
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
    state: 'repair-shop', name: 'Repair-shop', type: 'link', icon: 'build',
    children: [], roles: [ROLES.MOVYON, ROLES.FLEETMNG]
  },
  {
    state: '', name: 'Fleet-manager', type: 'submenu', icon: 'manage_accounts',
    children: [SUBMENU_ROUTES[0], SUBMENU_ROUTES[1]], roles: [ROLES.MOVYON, ROLES.OPER_MOVYON]
  },
  {
    state: 'user-fleet-manager', name: 'User-Fleet', type: 'submenu', icon: 'manage_accounts',
    children: [SUBMENU_ROUTES[2], SUBMENU_ROUTES[3], SUBMENU_ROUTES[4]], roles: [ROLES.FLEETMNG]
  },
  {
    state: 'manage-obu', name: 'Manage-obu', type: 'submenu', icon: 'assignment',
    children: [SUBMENU_ROUTES[5], SUBMENU_ROUTES[6], SUBMENU_ROUTES[7], SUBMENU_ROUTES[8], SUBMENU_ROUTES[9]],
    roles: [ROLES.MOVYON, ROLES.INSTALLER]
  },
  {
    state: 'appointment', name: 'Appointment', type: 'submenu', icon: 'assignment',
    children: [SUBMENU_ROUTES[10], SUBMENU_ROUTES[11]], roles: [ROLES.MOVYON, ROLES.INSTALLER]
  },
  {
    state: 'user-driver', name: 'User-Driver', type: 'submenu', icon: 'manage_accounts',
    children: [SUBMENU_ROUTES[12], SUBMENU_ROUTES[13]], roles: [ROLES.DRIVER]
  },
  /* {
    state: 'ticket', name: 'Ticket', type: 'submenu', icon: 'manage_accounts',
    children: [SUBMENU_ROUTES[14], SUBMENU_ROUTES[15]], roles: [ROLES.MOVYON, ROLES.FLEETMNG, ROLES.DRIVER]
  }, */
];

@Injectable()
export class MenuItemService implements IMenuItemService {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
