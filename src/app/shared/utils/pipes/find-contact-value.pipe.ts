import { Pipe, PipeTransform } from '@angular/core';
import { Driver, FleetManager } from 'src/app/components/domain/bus-firenze-domain';

@Pipe({
  name: 'findContactValue'
})
export class FindContactValuePipe implements PipeTransform {

  transform(fleetManager: FleetManager | Driver, code: number): string {
    let res = '';
    fleetManager.contacts.find(contact => {
      if (contact.code === code) {
        res = contact.value;
      }
    });
    return res;
  }

}
