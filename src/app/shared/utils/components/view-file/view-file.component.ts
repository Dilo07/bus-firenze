import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'on',
        style({
          'background-color': 'darkseagreen',
          'z-index': '10',
          padding: '6px',
          'border-style': 'solid',
          position: 'fixed',
          right: '10%',
          width: '50%',
          height: '60%'
        })
      ),
      state(
        'off',
        style({
          'z-index': '10',
          'border-style': 'solid',
          position: 'fixed',
          right: '-90%',
        })
      ),
      transition('on => off', animate('500ms')),
      transition('off => on', animate('500ms')),
    ]),
  ]
})
export class ViewFileComponent implements OnChanges {
  @Input() file: { type: string; url: string | ArrayBuffer; close?: boolean };
  public viewDoc: 'on' | 'off' = 'off';
  public zoom = 0.6;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.file.url) { this.viewDoc = 'on'; }
  }

  public changeZoom(zoomIn: boolean): void {
    if (zoomIn && this.zoom <= 1) {
      this.zoom += 0.1;
    } else if (!zoomIn && this.zoom >= 0.2) {
      this.zoom -= 0.1;
    }
  }

  public close(): void {
    if (this.viewDoc === 'on') {
      this.viewDoc = 'off';
      this.zoom = 0.6;
    }
  }

}
