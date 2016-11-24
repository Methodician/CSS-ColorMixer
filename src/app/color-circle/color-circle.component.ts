import { RgbColor } from '../models/rgb-color';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'color-circle',
  templateUrl: './color-circle.component.html',
  styleUrls: ['./color-circle.component.css']
})
export class ColorCircleComponent implements OnInit {
  @Input() color = new RgbColor(0, 0, 0);
  @Input() sizeMultiplier: number = 1;
  @Output() clicked = new EventEmitter();

  baseSize: number = 100;

  constructor() { }
  ngOnInit() {
    let mediaQueryPhone = window.matchMedia( "(max-width: 568px)" );
    if(mediaQueryPhone.matches)
      this.baseSize = 50;
  }

  click() {
    this.clicked.emit(this.color);
  }

}
