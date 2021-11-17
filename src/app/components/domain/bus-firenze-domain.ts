import { Coordinate } from '@npt/npt-map';

export class FleetManager {

    constructor() {
        this.name = '';
        this.surname = '';
        this.pIva = '';
        this.companyName = '';
        this.address = '';
        this.city = '';
        this.district = '';
        this.cap = '';
        this.contacts = [];
    }

    id: number;
    name: string;
    surname: string;
    fiscalCode: string;
    pIva: string;
    companyName: string;
    address: string;
    city: string;
    district: string;
    cap: string;
    contacts: Contact[];
}

export interface Contact {
    code: number;
    value: string;
}

export class Vehicle {
    id: number;
    fleetManagerId: number;
    lpn: string;
    lpnNat: string;
    euroClass: number;
    europeanGroup: number;
    europeanGroupLabel: string;
    numAxis: number;
    maxWeight: number;
    associationDate: Date;
    appointmentDate: Date;
    obuId: string;
    hardware: number;
}

export class VehicleTripPersistence {
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
