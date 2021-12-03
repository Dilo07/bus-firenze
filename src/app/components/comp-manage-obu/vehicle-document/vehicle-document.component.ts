import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vehicle-document',
  templateUrl: './vehicle-document.component.html',
  styles: [
  ]
})
export class VehicleDocumentComponent implements OnInit {
  public Search: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.Search = this.formBuilder.group({
      CtrlSearch: ['']
    });
  }

}
