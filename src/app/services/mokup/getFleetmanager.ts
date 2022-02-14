import { STATUS_VEHICLE } from 'src/app/components/domain/bus-firenze-constants';
import { FleetManager, Vehicle } from 'src/app/components/domain/bus-firenze-domain';

export const getFleetManager: FleetManager[] = [];

export const getVehicles: Vehicle[] = [
    {
        id: 1,
        fleetManagerId: 1,
        lpn: 'EY',
        lpnNat: 'EY',
        euroClass: 1,
        europeanGroup: 1,
        europeanGroupLabel: 'EY',
        numAxis: 1,
        maxWeight: 1,
        associationDate: new Date(),
        appointmentDate: new Date(),
        obuId: 'TEST',
        hardware: 1,
        contractType: 'BUY',
        allowContacted: true,
        expiresAt: new Date(),
        status: STATUS_VEHICLE.DELETED
    }
];
