import { Pipe, PipeTransform } from '@angular/core';
import { DEPOSIT_TYPE } from 'src/app/components/domain/bus-firenze-constants';
import { DocumentVehicle } from 'src/app/components/domain/bus-firenze-domain';

@Pipe({
  name: 'hasDeposit'
})
export class HasDepositPipe implements PipeTransform {

  transform(documents: DocumentVehicle[], checkValid: boolean): boolean {
    let hasDeposit = false;
    const deposit = DEPOSIT_TYPE;
    documents.map(document => { // controlla se ha deposito in caso di checkValid true controlla anche se è valido
      if (document.type === deposit.DEPOSIT && !checkValid) { hasDeposit = true; }
      if (document.type === deposit.DEPOSIT && document.valid && checkValid) { hasDeposit = true; }
    });
    return hasDeposit;
  }

}
