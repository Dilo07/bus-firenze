import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';

declare const window: any;
const defaultUtilScript = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.1/js/utils.js';

@Directive({
  selector: '[ng2TelInput]'
})
export class Ng2telinputDirective implements OnInit {
  @Input() ng2TelInputOptions: { [key: string]: any } = {};
  @Output() hasError: EventEmitter<boolean> = new EventEmitter();
  @Output() ng2TelOutput: EventEmitter<any> = new EventEmitter();
  @Output() countryChange: EventEmitter<any> = new EventEmitter();
  @Output() intlTelInputObject: EventEmitter<any> = new EventEmitter();

  public ngTelInput: any;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: string) {
  }

  @HostListener('blur') onBlur(): void {
    const isInputValid: boolean = this.isInputValid();
    if (isInputValid) {
      const telOutput = this.ngTelInput.getNumber();
      this.hasError.emit(isInputValid);
      this.ng2TelOutput.emit(telOutput);
    } else {
      this.hasError.emit(isInputValid);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ng2TelInputOptions = {
        ...this.ng2TelInputOptions,
        utilsScript: this.getUtilsScript(this.ng2TelInputOptions)
      };
      this.ngTelInput = window.intlTelInput(this.el.nativeElement, {
        ...this.ng2TelInputOptions
      });

      this.el.nativeElement.addEventListener('countrychange', () => {
        this.countryChange.emit(this.ngTelInput.getSelectedCountryData());
      });

      this.intlTelInputObject.emit(this.ngTelInput);
    }
  }

  isInputValid(): boolean {
    return this.ngTelInput.isValidNumber();
  }

  setCountry(country: any): void {
    this.ngTelInput.setCountry(country);
  }

  getUtilsScript(options: any): any {
    return options.utilsScript || defaultUtilScript;
  }

}
