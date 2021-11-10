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
    vehicleId?: number;
}

export interface Contact{
    code: number;
    value: string;
}
