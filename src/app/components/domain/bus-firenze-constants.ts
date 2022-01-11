import { RefreshOption } from './bus-firenze-domain';

export const TimesRefresh =
    [
        { label: '1 Minute', code: RefreshOption._1_minute },
        { label: '5 Minutes', code: RefreshOption._5_minutes },
        { label: '10 Minutes', code: RefreshOption._10_minutes },
        { label: '30 Minutes', code: RefreshOption._30_minutes }
    ];


export const Nations = [
    { value: 'IT' },
    { value: 'AL' },
    { value: 'AT' },
    { value: 'BE' },
    { value: 'BG' },
    { value: 'CH' },
    { value: 'CZ' },
    { value: 'DE' },
    { value: 'ES' },
    { value: 'FR' },
    { value: 'GB' },
    { value: 'HR' },
    { value: 'HU' },
    { value: 'NL' },
    { value: 'PT' },
    { value: 'SI' }
];

export const STATUS_VEHICLE = Object.freeze({
    DELETED: 'DELETED',
    TEMP: 'TEMP',
    REGISTERED: 'REGISTERED',
    UNKNOWN: 'UNKNOWN'
});

export const CONTRACT_TYPE = {
    RENT: 'RENT',
    BUY: 'BUY'
};

export const TICKETS_TYPE = {
    TICKET: 'Ticket',
    ABBONAMENTO: 'Abbonamento',
    VOUCHER: 'Voucher'
};
