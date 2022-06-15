import { Pipe, PipeTransform } from '@angular/core';
import { DepositType, DocumentVehicle } from 'src/app/components/domain/bus-firenze-domain';

@Pipe({
  name: 'hasDeposit'
})
export class HasDepositPipe implements PipeTransform {

  transform(documents: DocumentVehicle[], checkValid: boolean): boolean {
    let hasDeposit = false;
    const deposit: DepositType = 'deposit';
    documents.map(document => { // controlla se ha deposito in caso di checkValid true controlla anche se è valido
      if (document.type === deposit && !checkValid) { hasDeposit = true; }
      if (document.type === deposit && document.valid && checkValid) { hasDeposit = true; }
    });
    return hasDeposit;
  }

}

@Pipe({
  name: 'hasRequest'
})
export class HasRequestDepositPipe implements PipeTransform {

  transform(documents: DocumentVehicle[], checkValid: boolean): boolean {
    let hasReqDeposit = false;
    const request: DepositType = 'request';
    documents.map(document => { // controlla se ha una richiesta restituzione deposito
      if (document.type === request && !checkValid) { hasReqDeposit = true; }
      if (document.type === request && document.valid && checkValid) { hasReqDeposit = true; }
    });
    return hasReqDeposit;
  }
}

@Pipe({
  name: 'depositDateValid'
})
export class DateValidPipe implements PipeTransform {

  transform(documents: DocumentVehicle[]): number {
    let dateValid = null;
    const deposit: DepositType = 'deposit';
    documents.map(document => { // ritorna la data di validità del deposito
      if (document.type === deposit && document.valid) { dateValid = document.valid; }
    });
    return dateValid;
  }
}

@Pipe({
  name: 'requestDateValid'
})
export class RequestDateValidPipe implements PipeTransform {

  transform(documents: DocumentVehicle[]): number {
    let dateValid = null;
    const request: DepositType = 'request';
    documents.map(document => { // ritorna la data di validità della richiesta
      if (document.type === request && document.valid) { dateValid = document.valid; }
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

@Pipe({
  name: 'documentRemObu'
})
export class DocumentRemoveObu implements PipeTransform {
  transform(documents: DocumentVehicle[]): boolean {
    let hasRemoveObu = false;
    const remObu: DepositType = 'remObu';
    documents.map(document => {
      if (document.type === remObu) {
        hasRemoveObu = true;
      }
    });
    return hasRemoveObu;
  }
}
