import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SnackBar {

  constructor(private snackBar: MatSnackBar, private translate: TranslateService) { }

  public showMessage(i18nKey: string, level: string): void {

    this.snackBar.open(this.translate.instant(i18nKey),
      '✖',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: [level]
      });
  }
}
