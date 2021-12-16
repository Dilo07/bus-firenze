import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-modal-test-ticket',
  templateUrl: './modal-test-ticket.component.html',
  styles: [
  ]
})
export class ModalTestTicketComponent implements OnInit {
  public FormGroup: FormGroup;
  public validTicket: boolean;

  private roleDriver: boolean;

  constructor(
    private ticketService: TicketService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalTestTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicleId: number },
    @Inject('authService') private authService: any
  ) {
    this.roleDriver = this.authService.getUserRoles().includes(ROLES.DRIVER);
  }

  ngOnInit(): void {
    this.FormGroup = this.formBuilder.group({
      CtrlTicket: ['', Validators.pattern('^[A-Za-z0-9]+$')],
      CtrlActive: [false, Validators.required]
    });
  }

  public testTicket(): void {
    const ticket = this.FormGroup.get('CtrlTicket').value;
    if (ticket.length !== 7) {
      this.validTicket = false;
    } else {
      this.ticketService.checkTicket(this.data.vehicleId, ticket).subscribe(
        () => this.validTicket = true
      );
    }
  }

  public addTicket(): void {
    const ticket = this.FormGroup.get('CtrlTicket').value;
    this.ticketService.addTicket(this.roleDriver, this.data.vehicleId, ticket).subscribe(
      data => console.log(data)
    );
  }

}