import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { TicketService } from 'src/app/services/ticket.service';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';

@Component({
  selector: 'app-modal-test-ticket',
  templateUrl: './modal-test-ticket.component.html',
  styles: [
  ]
})
export class ModalTestTicketComponent implements OnInit {
  public FormGroup: FormGroup;
  public validTicket: {valid: boolean, type: string} = {valid: false, type : ''};

  private roleDriver: boolean;

  constructor(
    private ticketService: TicketService,
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    public dialogRef: MatDialogRef<ModalTestTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicleId: number, fleetManagerId: number },
    @Inject('authService') private authService: any,
    @Inject('hideActiveTicketData') public hideActiveTicket: boolean
  ) {
    this.roleDriver = this.authService.getUserRoles().includes(ROLES.DRIVER);
  }

  ngOnInit(): void {
    this.FormGroup = this.formBuilder.group({
      CtrlTicket: ['', Validators.required],
      CtrlActive: [false, Validators.required]
    });
  }

  public testTicket(): void {
    const ticket = this.FormGroup.get('CtrlTicket').value;
    this.ticketService.checkTicket(this.data.vehicleId, ticket).subscribe(
      (type) => {
        this.validTicket.valid = true;
        this.validTicket.type = type;
      },
      () => this.validTicket.valid = false
    );
  }

  public addTicket(): void {
    const ticket = this.FormGroup.get('CtrlTicket').value;
    const delayed = this.FormGroup.get('CtrlActive').value;
    this.ticketService.addTicket(this.roleDriver, this.data.vehicleId, ticket, delayed, this.data.fleetManagerId).subscribe(
      () => this.snackBar.showMessage('TICKET.ADD_SUCCESS', 'INFO'),
      () => null,
      () => this.dialogRef.close(true)
    );
  }

  public cleanTicket(): void {
    this.FormGroup.patchValue({
      CtrlTicket: ''
    });
  }

}
