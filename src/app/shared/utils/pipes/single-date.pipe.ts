import { Pipe, PipeTransform } from '@angular/core';
import { BillingType } from 'src/app/components/domain/bus-firenze-domain';

@Pipe({
  name: 'singleDate'
})
export class SingleDatePipe implements PipeTransform {
  public singleDateType: BillingType[] = ['INSTALL', 'UNINSTALL', 'MISSED_APPOINTMENT', 'CANCELLED_APPOINTMENT'];

  transform(checkType: BillingType): boolean {
    const res = this.singleDateType.includes(checkType);
    return res;
  }

}
