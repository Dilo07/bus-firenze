/* eslint-disable @typescript-eslint/naming-convention */
import { Inject, Injectable } from '@angular/core';
import { IMenuItemService, Menu } from '@npt/npt-template';

/* Roles allowed by the application */
export const ROLES = Object.freeze({
  DRIVER: 'driver',
  INSTALLER: 'installer',
  MOVYON: 'movyon',
  OPER_MOVYON: 'opmovyon',
  FLEETMNG: 'fleet',
  UNUSUED: 'unusued'
});

const SUBMENU_ROUTES = [
  { state: 'fleet-manager-manage', name: 'Fleet-manager', icon: 'manage_accounts', roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] },
  { state: 'deposit', name: 'Deposit', icon: 'euro_symbol', roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG] },
  { state: 'billing', name: 'Billing', icon: 'receipt_long', roles: [ROLES.UNUSUED] },
  { state: 'penalties', name: 'Penalties', icon: 'back_hand', roles: [ROLES.UNUSUED] },
  { state: 'fleet-manager-valid', name: 'Valid-Fleet-manager', icon: 'manage_accounts', roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] },
  { state: 'vehicle-valid', name: 'Vehicle-valid', icon: 'directions_car', roles: [ROLES.MOVYON, ROLES.OPER_MOVYON] },
  { state: 'vehicles', name: 'Vehicles', icon: 'directions_car', roles: [ROLES.FLEETMNG] },
  { state: 'drivers', name: 'Drivers', icon: 'airline_seat_recline_normal', roles: [ROLES.FLEETMNG] },
  { state: 'anagraphic-fleet', name: 'Anagraphic', icon: 'manage_accounts', roles: [ROLES.FLEETMNG] },
  /* { state: 'assign-obu', name: 'Assign-obu', icon: 'new_label', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'change-obu', name: 'Change-obu', icon: 'assignment_return', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'remove-obu', name: 'Remove-obu', icon: 'code_off', roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.INSTALLER] },
  { state: 'change-plate', name: 'Change-plate', icon: 'assignment_return', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'vehicle-document', name: 'Vehicle-document', icon: 'description', roles: [ROLES.MOVYON, ROLES.INSTALLER] }, */
  { state: 'add-appointment', name: 'Add-appointment', icon: 'add', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'manage-appointment', name: 'Manage-appointment', icon: 'manage_search', roles: [ROLES.MOVYON, ROLES.INSTALLER] },
  { state: 'anagraphic-driver', name: 'Anagraphic', icon: 'manage_accounts', roles: [ROLES.DRIVER] },
  { state: 'association-driver', name: 'Association-vehicles', icon: 'directions_car', roles: [ROLES.DRIVER] }
];

const MENUITEMS = [
  {
    state: 'dashboard', name: 'Dashboard', type: 'link', icon: 'home', children: [], roles: []
  },
  {
    state: 'real-time', name: 'Real-time', type: 'link', icon: 'location_on', children: [], roles: [ROLES.FLEETMNG]
  },
  {
    state: 'area-monitoring', name: 'Area-monitoring', type: 'link', icon: 'public',
    children: [], roles: [ROLES.MOVYON, ROLES.OPER_MOVYON]
  },
  {
    state: 'repair-shop', name: 'Repair-shop', type: 'link', icon: 'build',
    children: [], roles: [ROLES.MOVYON, ROLES.FLEETMNG]
  },
  {
    state: '', name: 'Manage', type: 'submenu', icon: 'manage_accounts',
    children: [SUBMENU_ROUTES[0], SUBMENU_ROUTES[1], SUBMENU_ROUTES[2], SUBMENU_ROUTES[3]], roles: [ROLES.MOVYON, ROLES.OPER_MOVYON]
  },
  {
    state: '', name: 'Validation', type: 'submenu', icon: 'rule',
    children: [SUBMENU_ROUTES[4], SUBMENU_ROUTES[5]], roles: [ROLES.MOVYON, ROLES.OPER_MOVYON]
  },
  {
    state: 'payments', name: 'Payments', type: 'submenu', icon: 'manage_accounts',
    children: [SUBMENU_ROUTES[1], SUBMENU_ROUTES[2]], roles: [ROLES.FLEETMNG]
  },
  {
    state: 'user-fleet-manager', name: 'User-Fleet', type: 'submenu', icon: 'directions_car',
    children: [SUBMENU_ROUTES[6], SUBMENU_ROUTES[7], SUBMENU_ROUTES[8]], roles: [ROLES.FLEETMNG]
  },
  {
    state: 'manage-obu', name: 'Manage-obu', type: 'link', icon: 'ad_units',
    roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.INSTALLER]
  },
  {
    state: 'appointment', name: 'Appointment', type: 'submenu', icon: 'contact_phone',
    children: [SUBMENU_ROUTES[9], SUBMENU_ROUTES[10]], roles: [ROLES.MOVYON, ROLES.INSTALLER]
  },
  {
    state: 'user-driver', name: 'User-Driver', type: 'submenu', icon: 'manage_accounts',
    children: [SUBMENU_ROUTES[11], SUBMENU_ROUTES[12],], roles: [ROLES.DRIVER]
  },
  {
    state: 'ticket', name: 'Ticket', type: 'link', icon: 'wysiwyg',
    children: [], roles: [ROLES.MOVYON, ROLES.FLEETMNG, ROLES.DRIVER]
  },
  {
    state: 'documents', name: 'Documents', type: 'link', icon: 'assignment',
    children: [], roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG]
  }
];

@Injectable()
export class MenuItemService implements IMenuItemService {
  constructor(@Inject('hideBillingData') private hideBilling: boolean) { }

  getMenuitem(): Menu[] {
    if (!this.hideBilling) {
      SUBMENU_ROUTES[2].roles.push(ROLES.FLEETMNG, ROLES.OPER_MOVYON, ROLES.MOVYON);
      SUBMENU_ROUTES[3].roles.push(ROLES.OPER_MOVYON, ROLES.MOVYON);
    }
    return MENUITEMS;
  }
}
