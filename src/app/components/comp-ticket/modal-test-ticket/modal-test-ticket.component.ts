import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAuthenticationService, SnackBar } from '@npt/npt-template';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { TicketService } from 'src/app/services/ticket.service';
import { TICKETS_TYPE } from '../../domain/bus-firenze-constants';
import { FleetManager, Ticket, VehicleWithoutTicket } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-modal-test-ticket',
  templateUrl: './modal-test-ticket.component.html',
  styles: [` `]
})
export class ModalTestTicketComponent implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  public validTicket: { valid: boolean; ticket: Ticket } = { valid: false, ticket: null };
  public ticketType = 'contrassegno';
  public ticketsType = TICKETS_TYPE;

  private roleDriver: boolean;
  private subscription: Subscription[] = [];

  constructor(
    private ticketService: TicketService,
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    public dialogRef: MatDialogRef<ModalTestTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicleList: VehicleWithoutTicket[]; vehicleId: number; fleetManagerId: number; extend: boolean },
    @Inject('authService') private authService: IAuthenticationService,
    @Inject('hideActiveTicketData') public hideActiveTicket: boolean
  ) {
    this.authService.getUserRoles().then((res: string[]) => this.roleDriver = res.includes(ROLES.DRIVER));
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      ctrlVoucher: [''],
      ctrlProgressive: [''],
      ctrlCode: [''],
      ctrlYear: [moment().year()],
      ctrlActive: [false]
    });
    if (!this.data.extend) { this.formGroup.addControl('ctrlVehicle', this.formBuilder.control('', Validators.required)); }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public changeValidator(): void {
    this.formGroup.patchValue({
      ctrlVoucher: '',
      ctrlProgressive: '',
      ctrlCode: '',
      ctrlYear: moment().year(),
    });
    this.validTicket.valid = false;
    this.validTicket.ticket = null;
    if (this.ticketType === this.ticketsType.voucher) {
      this.formGroup.controls.ctrlVoucher.setValidators([Validators.minLength(7), Validators.maxLength(7), Validators.required]);
      this.formGroup.controls.ctrlProgressive.setValidators(null);
      this.formGroup.controls.ctrlCode.setValidators(null);
      this.formGroup.controls.ctrlYear.setValidators(null);
    } else {
      this.formGroup.controls.ctrlVoucher.setValidators(null);
      this.formGroup.controls.ctrlProgressive.setValidators([Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.required]);
      this.formGroup.controls.ctrlCode.setValidators([Validators.minLength(3), Validators.maxLength(3), Validators.required]);
      this.formGroup.controls.ctrlYear.setValidators([Validators.required]);
    }
  }

  public testTicket(): void {
    this.updateControls();
    let ticketTest = '';
    if (!this.formGroup.invalid) {
      if (this.ticketType !== this.ticketsType.voucher) {
        ticketTest = this.formGroup.get('ctrlProgressive').value + '/'
          + this.formGroup.get('ctrlCode').value + '/' + this.formGroup.get('ctrlYear').value;
      } else if (this.ticketType === this.ticketsType.voucher) {
        ticketTest = this.formGroup.get('ctrlVoucher').value;
      }
      const vehicleId = this.data.extend ? this.data.vehicleId : this.formGroup.get('ctrlVehicle').value;
      this.subscription.push(this.ticketService.checkTicket(vehicleId, ticketTest).subscribe({
        next: (infoTicket) => {
          this.validTicket.valid = true;
          this.validTicket.ticket = infoTicket;
        },
        error: () => this.validTicket.valid = false
      }));
    }
  }

  public addTicket(): void {
    const ticketSave = this.validTicket.ticket.ticketId;
    const delayed = this.formGroup.get('ctrlActive').value;
    const vehicleId = this.data.extend ? this.data.vehicleId : this.formGroup.get('ctrlVehicle').value;
    this.subscription.push(this.ticketService.addTicket(
      this.roleDriver,
      vehicleId,
      ticketSave,
      delayed,
      this.data.extend,
      this.data.fleetManagerId)
      .subscribe({
        next: () => this.snackBar.showMessage('TICKET.ADD_SUCCESS', 'INFO'),
        complete: () => this.dialogRef.close(true)
      }));
  }

  public cleanTicket(): void {
    this.formGroup.patchValue({
      ctrlVoucher: ''
    });
  }

  private updateControls(): void {
    this.formGroup.controls.ctrlVoucher.updateValueAndValidity();
    this.formGroup.controls.ctrlProgressive.updateValueAndValidity();
    this.formGroup.controls.ctrlCode.updateValueAndValidity();
    this.formGroup.controls.ctrlYear.updateValueAndValidity();
  }

}
