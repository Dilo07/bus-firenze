import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { VehicleTripPersistence } from 'src/app/components/domain/bus-firenze-domain';

@Pipe({
  name: 'statusVehicle'
})
export class StatusVehiclePipe implements PipeTransform {

  transform(trip: VehicleTripPersistence): 'redIcon' | 'yellowIcon' | 'greenIcon' {
    const now = moment.now();
    const nowPlus15 = moment(now).add(15, 'minutes').valueOf();
    if (!trip.ticketNumber || trip.ticketExpiresAt < now) {
      return 'redIcon';
    } else if (trip.ticketExpiresAt > now && trip.ticketExpiresAt < nowPlus15) {
      return 'yellowIcon';
    } else {
      return 'greenIcon';
    }
  }

}
