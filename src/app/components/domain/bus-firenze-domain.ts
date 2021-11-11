export interface FleetManager {
    id: number;
    name: string;
    surname: string;
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

export interface Vehicle {
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
