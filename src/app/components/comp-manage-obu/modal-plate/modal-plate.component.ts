import { Component, Inject, OnInit } from '@angular/core';
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
  public CtrlLpn: string;
  public CtrlLpnNat: string;
  private subscription: Subscription[] = [];

  constructor(
    private obuService: ObuService,
    public dialogRef: MatDialogRef<ModalPlateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Obu: Obu, lpn: string, lpnNat: string }
  ) { }

  ngOnInit(): void {
    this.CtrlLpn = this.data.lpn;
    this.CtrlLpnNat = this.data.lpnNat;
  }

  public changePlate(): void {
    const lpn = this.CtrlLpn;
    const nat = this.CtrlLpnNat;
    this.subscription.push(this.obuService.changePlate(this.data.Obu.obuId, this.data.Obu.vehicleId, lpn, nat).subscribe(
      () => {},
      () => { this.dialogRef.close(false); },
      () => this.dialogRef.close(true)));
  }
}
