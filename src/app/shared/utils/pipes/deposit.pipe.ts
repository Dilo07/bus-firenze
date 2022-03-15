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

@Pipe({
  name: 'hasRequest'
})
export class HasRequestDepositPipe implements PipeTransform {

  transform(documents: DocumentVehicle[]): boolean {
    let hasReqDeposit = false;
    const deposit = DEPOSIT_TYPE;
    documents.map(document => { // controlla se ha una richiesta restituzione deposito
      if (document.type === deposit.REQUEST) { hasReqDeposit = true; }
    });
    return hasReqDeposit;
  }
}

@Pipe({
  name: 'dateValid'
})
export class DateValidPipe implements PipeTransform {

  transform(documents: DocumentVehicle[]): number {
    let dateValid = null;
    const deposit = DEPOSIT_TYPE;
    documents.map(document => { // ritorna la data di validità del deposito
      if (document.type === deposit.DEPOSIT && document.valid) { dateValid = document.valid; }
    });
    return dateValid;
  }
}

@Pipe({
  name: 'documentToValid'
})
export class DocumentToValidPipe implements PipeTransform {

  transform(documents: DocumentVehicle[]): string {
    let documentType = null;
    documents.map(document => { // ritorna il tipo di documento con validità a null
      if (!document.valid) { documentType = document.type; }
    });
    return documentType;
  }
}
