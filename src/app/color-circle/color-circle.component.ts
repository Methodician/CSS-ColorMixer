import { IrgbColor, RgbColor } from '../models/rgb-color';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'color-circle',
  templateUrl: './color-circle.component.html',
  styleUrls: ['./color-circle.component.css']
})
export class ColorCircleComponent implements OnInit {
  @Input() color: IrgbColor = new RgbColor(0, 0, 0);
  @Input() sizeMultiplier: number = 1;
  @Output() clicked = new EventEmitter();

  baseSize: number = 55;

  constructor() { }
  ngOnInit() {
  }

  click() {
    this.clicked.emit(this.color);
  }

}
