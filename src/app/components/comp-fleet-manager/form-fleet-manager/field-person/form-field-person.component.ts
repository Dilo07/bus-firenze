import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-field-person',
  templateUrl: './form-field-person.component.html',
  styles: [
  ]
})
export class FormFieldPersonComponent {
  @Input() personForm: FormGroup;
  @Input() readlOnlyMail: boolean;
  @Input() opacity: string;

  constructor() { }

}
