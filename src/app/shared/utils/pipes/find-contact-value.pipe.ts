import { Pipe, PipeTransform } from '@angular/core';
import { FleetManager } from 'src/app/components/domain/bus-firenze-domain';

@Pipe({
  name: 'findContactValue'
})
export class FindContactValuePipe implements PipeTransform {

  transform(fleetManager: FleetManager, code: number): string {
    let res = '';
    fleetManager.contacts.find(contact => {
      if (contact.code === code) {
        res = contact.value;
      }
    });
    return res;
  }

}
