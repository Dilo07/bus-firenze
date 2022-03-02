import { Coordinate } from '@npt/npt-map';

export class FleetManager {
    id: number;
    name: string;
    surname: string;
    contractCode: string;
    idSap: number;
    fiscalCode: string;
    companyType: string;
    pIva: string;
    companyName: string;
    address: string;
    city: string;
    district: string;
    cap: string;
    contacts: Contact[];
    fileId: number;
    country: string;
    extraUE: boolean;
    codeIpa: string;
}

export interface Contact {
    code: number;
    value: string;
}

export class CompleteFleetManager extends FleetManager {
    constructor() {
        super();
        this.vehicles = [];
    }

    vehicles: Vehicle[];
    ticketId?: string;
}

export class Driver {
    id: number;
    name: string;
    surname: string;
    contacts: Contact[];
    fleetManagerId: number;
}

export interface DriverVehicle {
    id: number;
    displayName: string;
    status: boolean;
    dateIns: Date;
}

export class Vehicle {
    id: number;
    fleetManagerId: number;
    certificateId: number;
    lpn: string;
    lpnNat: string;
    euroClass: number;
    europeanGroup: number;
    europeanGroupLabel: string;
    expiresAt: Date;
    numAxis: number;
    maxWeight: number;
    associationDate: Date;
    appointmentDate: Date;
    obuId: string;
    hardware: number;
    contractType: string;
    allowContacted: boolean;
    status: string;
}

export class VehicleTripPersistence {
    ticketNumber: string;
    ticketExpiresAt: number;
    id: number;
    start: number;
    end: number;
    obuId: string;
    type: string;
    shape: LineString;
    duration: number;
    engine: boolean;
    tripLength: number;
}

export class LineString {
    SRID: number;
    points: Points;
}

export class Points {
    dimension: number;
    measures: number;
    coordinates: Coordinate[];
}

export interface ColumnSort {
    active: string;
    direction: 1 | -1;
}

export class Obu {
    vehicleId: number;
    obuId: string;
}

export interface TripStat {
    innerLength: number;
    outerLength: number;
    innerDuration: number;
    outerDuration: number;
}

export interface RepairShops {
    name: string;
    surname: string;
    mobile_number: string;
    name_shop: string;
    address: string;
}

export interface Ticket {
    ticketId: string;
    vehicleId: number;
    lpn: string;
    lpnNat: string;
    userIns: User;
    userDel: User;
    dateIns: Date;
    dateSink: Date;
    dateDel: Date;
    ticketStart: Date;
    ticketEnd: Date;
    ticketSubscription: boolean;
    type: string;
    code: string;
}

export interface User {
    id: number;
    name: string;
    surname: string;
    guid: string;
}

export interface RefreshInterface {
    label: string;
    code: RefreshOption._1_minute | RefreshOption._5_minutes | RefreshOption._10_minutes | RefreshOption._30_minutes;
}

export enum RefreshOption {
    _1_minute,
    _5_minutes,
    _10_minutes,
    _30_minutes
}
