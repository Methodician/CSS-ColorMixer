import { IrgbColor } from './../../models/irgb-color';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'palette',
  templateUrl: './palette.component.html',
  //styleUrls: ['./palette.component.css'],
  styles: [
    `
.fa {
  display: block;
}
.fa-trash {
  transform: translateY(-12px);
  color: red;
}
.fa-plus {
  margin-top: 2px;
  color: green;
}
.fa-minus {
  margin-top: 2px;
  color: orange;
}
.palette {
  margin-left: 7px;
}
.palette-buttons {
    display: inline-block;
}
.palette-body {
    display: inline-block;
}
color-circle {
  margin: 3px;
  display: inline-block;
}
p {
  margin: 0
}

:host /deep/ .colorCircle {
  height: 30px;
  width: 30px;
}
:host /deep/ label {
  display: none;
}

    `
  ]
})
export class PaletteComponent implements OnInit {
  @Input() palette: IrgbColor[] = [];
  constructor() { }

  ngOnInit() {
  }

}
