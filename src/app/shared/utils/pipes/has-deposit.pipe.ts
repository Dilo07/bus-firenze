import { Pipe, PipeTransform } from '@angular/core';
import { DocumentVehicle } from 'src/app/components/domain/bus-firenze-domain';

@Pipe({
  name: 'hasDeposit'
})
export class HasDepositPipe implements PipeTransform {

  transform(documents: DocumentVehicle[], isValidDeposit: boolean): boolean {
    let hasDeposit = false;
    documents.map(document => {
      if (document.type === 'deposit' && !isValidDeposit) { hasDeposit = true; }
      if (document.type === 'deposit' && document.valid && isValidDeposit) { hasDeposit = true; }
    });
    return hasDeposit;
  }

}
