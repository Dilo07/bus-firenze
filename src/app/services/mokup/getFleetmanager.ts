import { FleetManager, Vehicle } from 'src/app/components/domain/bus-firenze-domain';

export const getFleetManager: Partial<FleetManager>[] = [
  {
    id: 1, name: 'pippo', surname: 'pluto', contractCode: '111', idSap: 1,
    fiscalCode: '', companyType: '', pIva: '', companyName: '', address: '',
    city: '', district: '', cap: '', contacts: [], fileId: 1, country: '',
    extraUE: true, codeDest: '', failedCheck: false, documents: []
  },
];

export const getVehicles: Vehicle[] = [];
