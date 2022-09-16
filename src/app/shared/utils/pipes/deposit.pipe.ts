import { Pipe, PipeTransform } from '@angular/core';
import { DepositType, DocumentObu, DocumentVehicle } from 'src/app/components/domain/bus-firenze-domain';

// controlla se ha un documento di tipo deposit, in caso di checkValid true controlla anche se è valido
@Pipe({
  name: 'hasDeposit'
})
export class HasDepositPipe implements PipeTransform {

  transform(documents: DocumentVehicle[], checkValid: boolean): boolean {
    let hasDeposit = false;
    const deposit: DepositType = 'deposit';
    documents.map(document => {
      if (document.type === deposit && !checkValid) { hasDeposit = true; }
      if (document.type === deposit && document.valid && checkValid) { hasDeposit = true; }
    });
    return hasDeposit;
  }
}

// controlla se ha una richiesta restituzione deposito, in caso di checkValid true controlla anche se è valido
@Pipe({
  name: 'hasRequest'
})
export class HasRequestDepositPipe implements PipeTransform {

  transform(documents: DocumentVehicle[], checkValid: boolean): boolean {
    let hasReqDeposit = false;
    const request: DepositType = 'request';
    documents.map(document => {
      if (document.type === request && !checkValid) { hasReqDeposit = true; }
      if (document.type === request && document.valid && checkValid) { hasReqDeposit = true; }
    });
    return hasReqDeposit;
  }
}

// ritorna la data di validità del deposito
@Pipe({
  name: 'depositDateValid'
})
export class DateValidPipe implements PipeTransform {

  transform(documents: DocumentVehicle[]): number {
    let dateValid = null;
    const deposit: DepositType = 'deposit';
    documents.map(document => {
      if (document.type === deposit && document.valid) { dateValid = document.valid; }
    });
    return dateValid;
  }
}

// ritorna la data di validità della richiesta di deposito
@Pipe({
  name: 'requestDateValid'
})
export class RequestDateValidPipe implements PipeTransform {

  transform(documents: DocumentVehicle[]): number {
    let dateValid = null;
    const request: DepositType = 'request';
    documents.map(document => {
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

// ricerca nei documenti il primo documento che ha come tipo 'remObu' o 'remObuFree' o 'remObuFail' e lo rende alla view
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

// ricerca nei documenti il primo documento che ha come tipo 'deposit' o 'revoke' o 'retention'
@Pipe({
  name: 'documentTypeDeposit'
})

export class DocumentTypeFind implements PipeTransform {
  transform(documents: DocumentObu[]): DocumentObu {
    let documentObu = null;
    const typeAccept = ['deposit', 'revoke', 'retention'];
    documentObu = documents.find((value: DocumentObu) => typeAccept.includes(value.type));
    return documentObu;
  }
}
