import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-field-driver',
  templateUrl: './form-field-driver.component.html',
  styleUrls: ['./form-field-driver.component.css']
})
export class FormFieldDriverComponent {
  @Input() personForm: FormGroup;
  @Input() centerLabel = false;

  constructor() { }


}
