import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IAuthenticationService } from '@npt/npt-template';
import moment from 'moment';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { BillingItemsService } from 'src/app/services/billing-items.service';
import { BILLING_STATUS } from '../../domain/bus-firenze-constants';
import { BillingItemsAgg } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-billing-items',
  templateUrl: './billing-items.component.html',
  styles: [`
  table { width: 100%; }
  @media(min-width: 1180px) {
    .mat-column-expandButton { max-width: 10%}
    .mat-column-gopId { max-width: 10%;}
    .mat-column-typeId { max-width: 30%;}
    .mat-column-price { max-width: 10%;}
    .mat-column-quantity { max-width: 10%;}
    .mat-column-priceTot { max-width: 10%;}
  }
  `
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BillingItemsComponent implements OnInit {
  public viewFleetTable = false;
  public dataSource = new MatTableDataSource<BillingItemsAgg>();
  public displayedColumns = ['expandButton', 'gopId', 'billingType', 'price', 'quantity', 'priceTot'];
  public roleMovyon: boolean;
  public complete = true;
  public billingStatus = [BILLING_STATUS.unknown, BILLING_STATUS.pending, BILLING_STATUS.success, BILLING_STATUS.failed];
  public maxDate = moment().toDate();
  public formGroup: FormGroup;
  public expandedElement: BillingItemsAgg | null;

  private fleetManagerId: number;

  constructor(
    private billingItemsService: BillingItemsService,
    @Inject('authService') private authService: IAuthenticationService) { }

  async ngOnInit(): Promise<void> {
    this.formGroup = new FormGroup({
      ctrlBillingStatus: new FormControl(BILLING_STATUS.pending),
      ctrlRangeStart: new FormControl(moment().subtract(30, 'day').toDate(), Validators.required),
      ctrlRangeEnd: new FormControl(moment().toDate(), Validators.required),
    });
    await this.authService.getUserRoles().then((res: string[]) => this.roleMovyon = res.includes(ROLES.MOVYON) || res.includes(ROLES.OPER_MOVYON));
    if (this.roleMovyon) {
      this.viewFleetTable = true;
    } else {
      this.getBillingItems();
    }
  }

  public getBillingItems(fmId?: number): void{
    this.complete = false;
    if (fmId) { // se è op o movyon verrà valorizzato flmId altrimenti se ruolo fm non verrà valorizzato
      this.fleetManagerId = fmId;
      this.viewFleetTable = false;
    }
    const start = moment(this.formGroup.get('ctrlRangeStart').value).format('yyyy-MM-DD');
    const end = moment(this.formGroup.get('ctrlRangeEnd').value).format('yyyy-MM-DD');
    const billingStatus = this.formGroup.get('ctrlBillingStatus').value;
    this.billingItemsService.getBillingItemsAggregate(start, end, billingStatus, this.fleetManagerId).subscribe(
      items => this.dataSource.data = items,
      () => this.complete = true,
      () => this.complete = true
    );
  }

}
