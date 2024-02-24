import { Vehicle, VehicleTripPersistence } from 'src/app/components/domain/bus-firenze-domain';

export const vehicleTrip: VehicleTripPersistence[] = [
  {
    ticketNumber: 'error', ticketExpiresAt: 1673123668000, id: 1,
    obuId: '000490000055002', start: 1673123668000, end: 1673123668000, type: 'multipolygon',
    shape:
    {
      points: {
        dimension: 3, measures: 0, coordinates: [
          { x: 11.162036855536002, y: 43.826351857093215 },
          { x: 11.156911633529887, y: 43.828662427402435 },
          { x: 11.154670644311096, y: 43.82825844298026 },
          { x: 11.152669190802158, y: 43.82796980523159 },
          { x: 11.15138796120604, y: 43.82513881580519 },
          { x: 11.151548336800346, y: 43.813061763875226 }
        ]
      }
    },
    duration: 1, engine: true, tripLength: 1,
  },
  {
    ticketNumber: 'active', ticketExpiresAt: 1708815600000, id: 2,
    obuId: '000490000086209', start: 1708556400000, end: 1708682317608, type: 'multipolygon',
    shape:
    {
      points: {
        dimension: 3, measures: 0, coordinates: [
          { x: 11.174131222007162, y: 43.83515168742397 },
          { x: 11.164588053474205, y: 43.839605176657955 },
          { x: 11.164749500192272, y: 43.84272588544866 },
          { x: 11.170439751205123, y: 43.849074659565645 },
          { x: 11.171881696065839, y: 43.850634625888404 }
        ]
      }
    },
    duration: 1, engine: true, tripLength: 1,
  },
  {
    ticketNumber: 'warning', ticketExpiresAt: 1708683720000, id: 3,
    obuId: '000490000086209', start: 1708556400000, end: 1708683073721, type: 'multipolygon',
    shape:
    {
      points: {
        dimension: 3, measures: 0, coordinates: [
          { x: 11.20234926466344, y: 43.80034036125713 },
          { x: 11.16975612339948, y: 43.82115796033128 },
          { x: 11.145080919384213, y: 43.83707863797346 },
          { x: 11.139455341379346, y: 43.84113520785766 },
          { x: 11.121427755250181, y: 43.85226048937517 },
          { x: 11.120562627269834, y: 43.85361111647569 },
          { x: 11.125465166389944, y: 43.85361113973016 },
          { x: 11.139453854133905, y: 43.85101439749528 },
          { x: 11.140895894052392, y: 43.85018236477475 }
        ]
      }
    },
    duration: 1, engine: true, tripLength: 1,
  },
];

export const vehicleDetails002: Vehicle = {
  "euroClass": 3,
  "fleetManagerId": 271,
  "europeanGroup": 3,
  "europeanGroupLabel": "EUROPEAN_VEHICLE.GROUP3",
  "numAxis": 5,
  "maxWeight": 3221,
  "associationId": 646,
  "associationDate": 1708613816046,
  "obuId": "000490000055002",
  "hardware": 4,
  "installer": null,
  "fileId": null,
  "appointmentDate": null,
  "deleted": null,
  "status": "REGISTERED",
  "expiresAt": null,
  "contractType": "RENT",
  "allowContacted": true,
  "certificateId": 1855,
  "valid": true,
  "id": 476,
  "lpn": "VEICOLO002",
  "lpnNat": "IT",
  "documents": [
    {
      "fileId": 1855,
      "valid": 1708613798000,
      "sink": null,
      "type": "deposit"
    }
  ],
  "documentsObu": null,
  "parentId": null
};

export const vehicleDetails209: Vehicle = {
  "euroClass": 3,
  "fleetManagerId": 271,
  "europeanGroup": 3,
  "europeanGroupLabel": "EUROPEAN_VEHICLE.GROUP3",
  "numAxis": 5,
  "maxWeight": 3221,
  "associationId": 646,
  "associationDate": 1708613816046,
  "obuId": "000490000086209",
  "hardware": 4,
  "installer": null,
  "fileId": null,
  "appointmentDate": null,
  "deleted": null,
  "status": "REGISTERED",
  "expiresAt": null,
  "contractType": "RENT",
  "allowContacted": true,
  "certificateId": 1855,
  "valid": true,
  "id": 476,
  "lpn": "VEICOLO209",
  "lpnNat": "IT",
  "documents": [
    {
      "fileId": 1855,
      "valid": 1708613798000,
      "sink": null,
      "type": "deposit"
    }
  ],
  "documentsObu": null,
  "parentId": null
};
