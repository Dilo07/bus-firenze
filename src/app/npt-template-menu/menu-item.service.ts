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
    state: 'manage', name: 'Manage', type: 'link', icon: 'manage_accounts',
    children: [], roles: [ROLES.MOVYON, ROLES.OPER_MOVYON]
  },
  {
    state: 'anagraphic-fleet', name: 'Anagraphic', type: 'link', icon: 'account_box',
    children: [], roles: [ROLES.FLEETMNG]
  },
  {
    state: 'vehicles', name: 'Vehicles', type: 'link', icon: 'directions_car',
    children: [], roles: [ROLES.FLEETMNG]
  },
  {
    state: 'drivers', name: 'Drivers', type: 'link', icon: 'airline_seat_recline_normal',
    children: [], roles: [ROLES.FLEETMNG]
  },
  {
    state: 'anagraphic-driver', name: 'Anagraphic', type: 'link', icon: 'manage_accounts',
    children: [], roles: [ROLES.DRIVER]
  },
  {
    state: 'association-driver', name: 'Association-vehicles', type: 'link', icon: 'directions_car',
    children: [], roles: [ROLES.DRIVER]
  },
  {
    state: 'payments', name: 'Payments', type: 'submenu', icon: 'euro_symbol',
    children: [SUBMENU_ROUTES[1], SUBMENU_ROUTES[2], SUBMENU_ROUTES[3]], roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG]
  },
  {
    state: 'validation', name: 'Validation', type: 'link', icon: 'rule',
    children: [], roles: [ROLES.MOVYON, ROLES.OPER_MOVYON]
  },
  {
    state: 'manage-obu', name: 'Manage-obu', type: 'link', icon: 'ad_units',
    roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.INSTALLER]
  },
  {
    state: 'appointments', name: 'Appointment', type: 'link', icon: 'contact_phone',
    roles: [ROLES.MOVYON, ROLES.INSTALLER]
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
    // nasconse se nel config app hideBilling è true altrimenti aggiunge i ruoli
    if (!this.hideBilling) {
      SUBMENU_ROUTES[2].roles.push(ROLES.FLEETMNG, ROLES.OPER_MOVYON, ROLES.MOVYON);
      SUBMENU_ROUTES[3].roles.push(ROLES.OPER_MOVYON, ROLES.MOVYON);
    }
    return MENUITEMS;
  }
}
