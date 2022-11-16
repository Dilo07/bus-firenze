import { DriverVehicle } from 'src/app/components/domain/bus-firenze-domain';

export const driversByVehicle: DriverVehicle[] = [
  { id: 1, displayName: 'Marco', status: true, dateIns: new Date() },
  { id: 2, displayName: 'Stefano', status: false, dateIns: new Date() }
];

export const vehiclesByDriver: DriverVehicle[] = [
  { id: 3, displayName: 'EY5442', status: true, dateIns: new Date() },
  { id: 4, displayName: 'EY5443', status: false, dateIns: new Date() }
];
