import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { TicketService } from 'src/app/services/ticket.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';
import { TICKETS_TYPE } from '../../domain/bus-firenze-constants';
import { Ticket } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-modal-test-ticket',
  templateUrl: './modal-test-ticket.component.html',
  styles: [`
  mat-button-toggle-group {
    flex-wrap: wrap;
  }
  `
  ]
})
export class ModalTestTicketComponent implements OnInit {
  public FormGroup: FormGroup;
  public validTicket: { valid: boolean, ticket: Ticket } = { valid: false, ticket: null };
  public ticketType: string;
  public ticketsType = TICKETS_TYPE;

  private roleDriver: boolean;

  constructor(
    private ticketService: TicketService,
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    public dialogRef: MatDialogRef<ModalTestTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicleId: number, fleetManagerId: number, extend: boolean },
    @Inject('authService') private authService: any,
    @Inject('hideActiveTicketData') public hideActiveTicket: boolean
  ) {
    this.roleDriver = this.authService.getUserRoles().includes(ROLES.DRIVER);
  }

  ngOnInit(): void {
    this.FormGroup = this.formBuilder.group({
      CtrlVoucher: [''],
      CtrlProgressive: [''],
      CtrlCode: [''],
      CtrlYear: [moment().year()],
      CtrlActive: [false, Validators.required]
    });
  }

  public changeValidator(): void {
    this.FormGroup.patchValue({
      CtrlVoucher: '',
      CtrlProgressive: '',
      CtrlCode: '',
      CtrlYear: moment().year(),
    });
    this.validTicket.valid = false;
    this.validTicket.ticket = null;
    if (this.ticketType === this.ticketsType.VOUCHER) {
      this.FormGroup.controls.CtrlVoucher.setValidators([Validators.minLength(7), Validators.maxLength(7), Validators.required]);
      this.FormGroup.controls.CtrlProgressive.setValidators(null);
      this.FormGroup.controls.CtrlCode.setValidators(null);
      this.FormGroup.controls.CtrlYear.setValidators(null);
    } else {
      this.FormGroup.controls.CtrlVoucher.setValidators(null);
      this.FormGroup.controls.CtrlProgressive.setValidators([Validators.required]);
      this.FormGroup.controls.CtrlCode.setValidators([Validators.minLength(3), Validators.maxLength(3), Validators.required]);
      this.FormGroup.controls.CtrlYear.setValidators([Validators.required]);
    }
    this.FormGroup.controls.CtrlVoucher.updateValueAndValidity();
    this.FormGroup.controls.CtrlProgressive.updateValueAndValidity();
    this.FormGroup.controls.CtrlCode.updateValueAndValidity();
    this.FormGroup.controls.CtrlYear.updateValueAndValidity();
  }

  public testTicket(): void {
    this.FormGroup.controls.CtrlVoucher.updateValueAndValidity();
    this.FormGroup.controls.CtrlProgressive.updateValueAndValidity();
    this.FormGroup.controls.CtrlCode.updateValueAndValidity();
    this.FormGroup.controls.CtrlYear.updateValueAndValidity();
    console.log(this.FormGroup.invalid);
    let ticketTest = '';
    if (!this.FormGroup.invalid) {
      if (this.ticketType !== this.ticketsType.VOUCHER) {
        ticketTest = this.FormGroup.get('CtrlProgressive').value + '/'
          + this.FormGroup.get('CtrlCode').value + '/' + this.FormGroup.get('CtrlYear').value;
      } else if (this.ticketType === this.ticketsType.VOUCHER) {
        ticketTest = this.FormGroup.get('CtrlVoucher').value;
      }
      console.log(ticketTest);
      this.ticketService.checkTicket(this.data.vehicleId, ticketTest).subscribe(
        (infoTicket) => {
          this.validTicket.valid = true;
          this.validTicket.ticket = infoTicket;
        },
        () => this.validTicket.valid = false
      );
    }
  }

  public addTicket(): void {
    const ticketSave = this.validTicket.ticket.ticketId;
    const delayed = this.FormGroup.get('CtrlActive').value;
    this.ticketService.addTicket(
      this.roleDriver,
      this.data.vehicleId,
      ticketSave,
      delayed,
      this.data.extend,
      this.data.fleetManagerId).subscribe(
        () => this.snackBar.showMessage('TICKET.ADD_SUCCESS', 'INFO'),
        () => null,
        () => this.dialogRef.close(true)
      );
  }

  public cleanTicket(): void {
    this.FormGroup.patchValue({
      CtrlVoucher: ''
    });
  }

}
