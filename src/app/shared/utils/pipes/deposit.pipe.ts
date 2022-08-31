import { Pipe, PipeTransform } from '@angular/core';
import { DepositType, DocumentObu, DocumentVehicle } from 'src/app/components/domain/bus-firenze-domain';

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

// ricerca nei documenti veicolo e ritorna il tipo di documento con validità null
@Pipe({
  name: 'documentToValid'
})
export class DocumentToValidPipe implements PipeTransform {

  transform(documents: DocumentVehicle[]): string {
    let documentType = null;
    documents.map(document => {
      if (!document.valid) { documentType = document.type; }
    });
    return documentType;
  }
}

// ricerca nei documenti il primo oggetto che ha come tipo 'remObu' o 'remObuFree' o 'remObuFail' e lo rende alla view
@Pipe({
  name: 'documentRemObu'
})
export class DocumentRemoveObu implements PipeTransform {
  transform(documents: DocumentObu[]): DocumentObu {
    let documentObu = null;
    documentObu = documents.find((value: DocumentObu) => (value.type === 'remObu' || value.type === 'remObuFree' || value.type === 'remObuFail'));
    return documentObu;
  }
}

// ricerca nei documenti se c'è un oggetto con type remObuFail, in caso affermativo ritorna true altrimenti false
@Pipe({
  name: 'documentRemObuFail'
})
export class DocumentRemoveObuFail implements PipeTransform {
  transform(documents: DocumentObu[]): boolean {
    let hasRemoveObuFail = false;
    const remObuFail: DepositType = 'remObuFail';
    documents.map(document => {
      if (document.type === remObuFail) {
        hasRemoveObuFail = true;
      }
    });
    return hasRemoveObuFail;
  }
}
