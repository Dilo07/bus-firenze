import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Subscription } from 'rxjs';
import { ObuService } from 'src/app/services/obu.service';
import { Obu } from '../../domain/bus-firenze-domain';
import { SnackBar } from 'src/app/shared/utils/classUtils/snackBar';

@Component({
  selector: 'app-modal-obu',
  templateUrl: './modal-obu.component.html',
  styles: [`
  :host zxing-scanner::ng-deep {
    /* max-height: 70vh; */
    /* width: 70%; */
    object-fit: contain;
}
  `
  ]
})
export class ModalObuComponent implements OnInit, OnDestroy {
  @ViewChild(ZXingScannerComponent) scanner: ZXingScannerComponent;

  public FormGroup: FormGroup;
  public validObu: boolean;
  public complete = true;
  public scannerEnabled = false;

  private subscription: Subscription[] = [];
  private isGunScanner = false;
  private interval: any;

  constructor(
    public dialogRef: MatDialogRef<ModalObuComponent>,
    private formBuilder: FormBuilder,
    private obuService: ObuService,
    private cdr: ChangeDetectorRef,
    private snackBar: SnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Obu) { }

  ngOnInit(): void {
    // se ci sono dati è un edit form altrimenti è un add form
    if (this.data.obuId) {
      this.FormGroup = this.formBuilder.group({
        CtrlObuId: [this.data.obuId, Validators.required]
      });
    } else {
      this.FormGroup = this.formBuilder.group({
        CtrlObuId: ['', Validators.required]
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.scanner) {
      this.scanner.enable = false;
    }
  }

  public addObu(): void {
    const newObu = this.FormGroup.get('CtrlObuId').value;
    this.subscription.push(this.obuService.addObu(newObu, this.data.vehicleId).subscribe(
      () => {
        this.snackBar.showMessage('OBU.ASSIGN_SUCCESS', 'INFO');
      },
      error => console.log(error),
      () => this.dialogRef.close(true)));
  }

  public changeObu(): void {
    const oldObu = this.data.obuId;
    const newObu = this.FormGroup.get('CtrlObuId').value;
    this.subscription.push(this.obuService.updateObu(oldObu, this.data.vehicleId, newObu).subscribe(
      () => {
        this.snackBar.showMessage('OBU.CHANGE_SUCCESS', 'INFO');
      },
      error => console.log(error),
      () => this.dialogRef.close(true)));
  }

  public cleanObu(): void {
    this.FormGroup.patchValue({
      CtrlObuId: ''
    });
  }

  /* Funzione per verificare se l'obu è presente nel db e se non è già associato.
    Se scannerizzano un bar code da pistola l'ultimo carattere (il 16esimo) è 'Enter' ovvero ''
    quindi il controllo viene fatto solo al 15 esimo carattere e
    la variabile isGunScanner è valorizzata a vero quando la chiamata ha esito positivo, false per esito con errore,
    se la variabile è valorizzata a vero non controlla l'ultimo carattere enter ovvero ''
    e non modifica il campo input con '' ma lascia l'obu id scannerizzato.
  */
  public testObu(): void {
    const obu = this.FormGroup.get('CtrlObuId').value;
    if (obu.length !== 15) {
      this.validObu = false;
    } else {
      if (this.isGunScanner) {
        this.isGunScanner = false;
        return;
      } else {
        this.subscription.push(this.obuService.testObu(obu).subscribe(
          () => { // se testobu è passato
            const scanObu = this.FormGroup.get('CtrlObuId').value;
            if (scanObu === '') {
              this.isGunScanner = true;
              this.FormGroup.patchValue({
                CtrlObuId: obu
              });
            }
            this.validObu = true;
          },
          () => { // se testobu fallisce
            const scanObu = this.FormGroup.get('CtrlObuId').value;
            if (scanObu === '') {
              this.isGunScanner = true;
              this.FormGroup.patchValue({
                CtrlObuId: obu
              });
            }
            this.validObu = false;
          }));
      }
    }
  }

  // funziona chiamata quando la telecamera ha acquisito il qar code o il bar code
  public scanSuccessHandler(event: any): void {
    console.log(event);
    if (event.substr(0, 4) === 'http') { // qar code
      const url = new URL(event);
      const value = url.searchParams.get('c');
      this.FormGroup.patchValue({
        CtrlObuId: value.substr(1, 15)
      });
    } else { // bar code
      this.FormGroup.patchValue({
        CtrlObuId: event
      });
    }
    this.scannerEnabled = false;
  }

  // funzione che abilita o disabilita la telecamera
  public enabledScanCode(): void {
    if (this.scannerEnabled) {
      this.complete = true;
      this.scannerEnabled = false;
      this.scanner.enable = false;
    } else {
      this.complete = false;
      this.scannerEnabled = true;
      this.cdr.detectChanges();
      this.subscription.push(this.scanner.camerasFound.subscribe(() => {
        this.interval = setTimeout(() => { this.complete = true; }, 1500);
      }));
    }
  }

}
