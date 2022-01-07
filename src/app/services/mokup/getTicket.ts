import { Ticket } from 'src/app/components/domain/bus-firenze-domain';

export const ActiveTicket: Ticket[] = [
    {
        ticketId: '1',
        vehicleId: 1,
        lpn: 'LPN1',
        lpnNat: 'IT',
        userIns: { id: 1, name: 'Marco', surname: 'Rossi', guid: 'guid'},
        userDel: { id: 1, name: 'Pippo', surname: 'Rossi', guid: 'guid'},
        dateIns: new Date(),
        dateSink: new Date(),
        dateDel: new Date(),
        ticketStart: new Date(),
        ticketEnd: new Date(),
        ticketSubscription: true,
        type: 'abbonamento',
        code: 'G'
    },
    {
        ticketId: '2',
        vehicleId: 2,
        lpn: 'LPN2',
        lpnNat: 'IT',
        userIns: { id: 1, name: 'Pietro', surname: 'Rossi', guid: 'guid'},
        userDel: { id: 1, name: 'Giuseepe', surname: 'Rossi', guid: 'guid'},
        dateIns: new Date(),
        dateSink: new Date(),
        dateDel: new Date(),
        ticketStart: new Date(),
        ticketEnd: new Date(),
        ticketSubscription: true,
        type: 'abbonamento',
        code: 'G'
    }
];
