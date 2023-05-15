/* eslint-disable @typescript-eslint/naming-convention */
import { Inject, Injectable } from '@angular/core';
import { IMenuItemService, Menu } from '@npt/npt-template';

/* Roles allowed by the application */
export const ROLES = Object.freeze({
  DRIVER: 'driver',
  INSTALLER: 'installer',
  MOVYON: 'movyon',
  OPER_MOVYON: 'opmovyon',
  FLEETMNG: 'fleet'
});

const menuItems = [
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
    state: 'manage', name: 'Fleet-manager', type: 'link', icon: 'manage_accounts',
    children: [], roles: [ROLES.MOVYON, ROLES.OPER_MOVYON]
  },
  {
    state: 'anagraphic-fleet', name: 'Anagraphic', type: 'link', icon: 'user',
    children: [], roles: [ROLES.FLEETMNG]
  },
  {
    state: 'vehicles', name: 'Vehicles', type: 'link', icon: 'car',
    children: [], roles: [ROLES.FLEETMNG]
  },
  {
    state: 'drivers', name: 'Drivers', type: 'link', icon: 'driver',
    children: [], roles: [ROLES.FLEETMNG]
  },
  {
    state: 'anagraphic-driver', name: 'Anagraphic', type: 'link', icon: 'manage_accounts',
    children: [], roles: [ROLES.DRIVER]
  },
  {
    state: 'association-driver', name: 'Association-vehicles', type: 'link', icon: 'car',
    children: [], roles: [ROLES.DRIVER]
  },
  {
    state: 'payments', name: 'Payments', type: 'link', icon: 'ticket',
    children: [], roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.FLEETMNG]
  },
  {
    state: 'validation', name: 'Validation', type: 'link', icon: 'rule',
    children: [], roles: [ROLES.MOVYON, ROLES.OPER_MOVYON]
  },
  {
    state: 'manage-obu', name: 'Manage-obu', type: 'link', icon: 'obu',
    roles: [ROLES.MOVYON, ROLES.OPER_MOVYON, ROLES.INSTALLER]
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

  constructor(@Inject('viewAppointmentsData') public viewAppointments: boolean) { }

  getMenuitem(): Menu[] {
    if (this.viewAppointments) {
      menuItems.push({
        state: 'appointments', name: 'Appointment', type: 'link', icon: 'appointment',
        roles: [ROLES.MOVYON, ROLES.INSTALLER]
      });
    }
    return menuItems;
  }
}
