import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ObuService } from 'src/app/services/obu.service';
import { Nations } from '../../domain/bus-firenze-constants';
import { Obu } from '../../domain/bus-firenze-domain';

@Component({
  selector: 'app-modal-plate',
  templateUrl: './modal-plate.component.html',
  styles: [`
  @media(max-width: 1180px) {
    .form{
        width: 100%;
    }
  }

  @media(min-width: 1180px) {
    .form{
        width: 40%;
        white-space: pre-wrap;
    }
  }
  `
  ]
})
export class ModalPlateComponent implements OnInit {
  public nations = Nations;
  public FormGroup: FormGroup;
  private subscription: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private obuService: ObuService,
    public dialogRef: MatDialogRef<ModalPlateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Obu: Obu, lpn: string, lpnNat: string }
  ) { }

  ngOnInit(): void {
    this.FormGroup = this.formBuilder.group({
      CtrlLpn: [this.data.lpn, Validators.pattern('^[A-Za-z0-9]+$')],
      CtrlLpnNat: [this.data.lpnNat, Validators.required]
    });
  }

  public changePlate(): void {
    const lpn = this.FormGroup.get('CtrlLpn').value;
    const nat = this.FormGroup.get('CtrlLpnNat').value;
    this.subscription.push(this.obuService.changePlate(this.data.Obu.obuId, this.data.Obu.vehicleId, lpn, nat).subscribe(
      () => {},
      () => { this.dialogRef.close(false); },
      () => this.dialogRef.close(true)));
  }
}
