import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularFire2';

import { RgbColor, IrgbColor } from '../models/rgb-color';

@Component({
  selector: 'mixer',
  templateUrl: './mixer.component.html',
  styleUrls: ['./mixer.component.css']
})
export class MixerComponent implements OnInit {

  averageOn = true;
  addOn = false;
  minusOn = false;
  poolSet = false;
  showHex = true;
  //  historyIndex = 0;
  //  colorHistorical = false;
  //  undoingOrRedoing = false;
  //  colorsInitialized = false;
  //inInnerPool = false;
  //inPool = false;


  red: IrgbColor = new RgbColor(255, 0, 0);
  green: IrgbColor = new RgbColor(0, 255, 0);
  blue: IrgbColor = new RgbColor(0, 0, 255);
  white: IrgbColor = new RgbColor(255, 255, 255);
  black: IrgbColor = new RgbColor(0, 0, 0);


  poolColor: IrgbColor = new RgbColor(127, 127, 127);
  lastColor: IrgbColor;

  //  draggingColor: IrgbColor = null;
  colorPoolHistory: IrgbColor[] = [];

  coreColors: IrgbColor[] = [this.red, this.green, this.blue, this.white, this.black];
  //colors: IrgbColor[] = [];
  colors: FirebaseListObservable<IrgbColor[]>;


  constructor(public db: AngularFireDatabase) { }

  ngOnInit() {
    this.colors = this.db.list('colors');
    this.setElementColor('colorPool', this.poolColor);
    this.colorPoolHistory.push(this.poolColor);
  }

  pickColor(color: IrgbColor) {
    if (!this.poolSet) {
      /*if (this.draggingColor) {
        this.lastColor = this.colorPoolHistory[this.colorPoolHistory.length - 2];
        this.setElementColor('colorPoolLeft', this.lastColor);
      }
      if (this.undoingOrRedoing) {
        if (this.historyIndex == 0)
          this.lastColor = this.colorPoolHistory[this.colorPoolHistory.length - 1];
        else this.lastColor = this.colorPoolHistory[this.historyIndex - 1];

        this.setElementColor('colorPoolLeft', this.lastColor);
      }*/
      this.setElementColor('colorPoolRight', color);
      this.poolColor = color;
      this.poolSet = true;
    }
    else {
      var newColor: IrgbColor
      if (this.averageOn && !this.addOn && !this.minusOn)
        newColor = this.mixColors(this.poolColor, color);
      else if (this.addOn)
        newColor = this.addColors(this.poolColor, color);
      else if (this.minusOn)
        newColor = this.subtractColors(this.poolColor, color);
      this.setElementColor('colorPoolRight', newColor);
      this.lastColor = this.colorPoolHistory[this.colorPoolHistory.length - 1]
      this.setElementColor('colorPoolLeft', this.lastColor);
      this.poolColor = newColor;
    }
    this.colorPoolHistory.push(this.poolColor);
  }

  subtractColors(c1: IrgbColor, c2: IrgbColor): IrgbColor {
    let r = this.subtract(c1.r, this.averageOn ? this.average(c1.r, c2.r) : c2.r);
    let g = this.subtract(c1.g, this.averageOn ? this.average(c1.g, c2.g) : c2.g);
    let b = this.subtract(c1.b, this.averageOn ? this.average(c1.b, c2.b) : c2.b);
    return new RgbColor(r, g, b);
  }
  subtract(a: number, b: number) {
    var combo = a;
    if (a < b)
      combo = b - a;
    if (b < a)
      combo = a - b;
    else
      return 0;
    return combo;
  }
  addColors(c1: IrgbColor, c2: IrgbColor): IrgbColor {
    let r = this.combine(c1.r, this.averageOn ? this.average(c1.r, c2.r) : c2.r);
    let g = this.combine(c1.g, this.averageOn ? this.average(c1.g, c2.g) : c2.g);
    let b = this.combine(c1.b, this.averageOn ? this.average(c1.b, c2.b) : c2.b);
    return new RgbColor(r, g, b);
  }
  combine(a: number, b: number) {
    var combo = a + b;
    if (combo > 255)
      return 255;
    else return combo;
  }
  mixColors(c1: IrgbColor, c2: IrgbColor): IrgbColor {
    let r = this.average(c1.r, c2.r);
    let g = this.average(c1.g, c2.g);
    let b = this.average(c1.b, c2.b);
    return new RgbColor(r, g, b);
  }
  average(a: number, b: number) {
    return Math.round((a + b) / 2);
  }

  toggleAvg() {
    //this.method = 'Average';
    this.averageOn = !this.averageOn;
  }
  toggleAdd() {
    //this.method = 'Add';
    this.addOn = !this.addOn;
    if (this.addOn)
      this.minusOn = false;
  }
  toggleMinus() {
    //this.method = 'Minus';
    this.minusOn = !this.minusOn;
    if (this.minusOn)
      this.addOn = false;
  }

  saveColor(side: string) {
    if (side == 'right')
      this.pushColor(this.poolColor);
    if (side == 'left')
      this.pushColor(this.lastColor)
  }
  pushColor(color: IrgbColor) {
    let newColor = new RgbColor(color.r, color.g, color.b);
    this.colors.push(newColor);
  }

  resetPool() {
    let freshPool = new RgbColor(127, 127, 127);
    this.poolColor = freshPool;
    this.setElementColor('colorPoolRight', freshPool);
    this.poolSet = false;
  }

  setElementColor(elementId: string, color: IrgbColor) {
    document.getElementById(elementId)
      .style.backgroundColor = color.rgb;
  }

  clearColors() {
    this.colors.remove();
  }
  toggleHex() {
    this.showHex = !this.showHex;
  }



}


/*

  clearColors() {
    this.colors.remove();
  }
  toggleHex() {
    this.showHex = !this.showHex;
  }

  undo() {
    if (this.colorPoolHistory.length > 1) {
      this.undoingOrRedoing = true;
      if (this.historyIndex < 1) {
        let len = this.colorPoolHistory.length;
        this.historyIndex = len - 2
        this.colorHistorical = true;
      } else if (this.historyIndex > 0) {
        this.historyIndex--;
      }

      let color = this.colorPoolHistory[this.historyIndex];
      this.poolSet = false;
      this.pickColor(color);
      this.colorPoolHistory.pop();
    }
    this.undoingOrRedoing = false;
  }
  redo() {
    if (this.colorPoolHistory.length > 1) {
      this.undoingOrRedoing = true;
      let len = this.colorPoolHistory.length;
      if (this.historyIndex >= len - 1) {
        this.historyIndex = 0
        this.colorHistorical = true;
      } else if (this.historyIndex <= len - 1) {
        this.historyIndex++;
      }

      let color = this.colorPoolHistory[this.historyIndex];
      this.poolSet = false;
      this.pickColor(color);
      this.colorPoolHistory.pop();
    }
    this.undoingOrRedoing = false;
  }

  enterPool(e: any) {
    this.colorHistorical = false;
    this.pickColor(this.draggingColor);
    console.log('color picked');
  }
  leavePool(e: any) {
    let len = this.colorPoolHistory.length;
    this.colorPoolHistory.pop();
    this.poolSet = false;
    this.pickColor(this.colorPoolHistory[len - 2]);
    this.colorPoolHistory.pop();

    console.log('color reverted');
    console.log(this.colorPoolHistory);

  }
  startColorDrag(e: any) {
    let color: IrgbColor = JSON.parse(e);
    this.draggingColor = color;
  }
  endColorDrag() {
    this.draggingColor = null;
  }

  pickColor(color: IrgbColor) {
    if (!this.poolSet) {
      if (this.draggingColor) {
        this.lastColor = this.colorPoolHistory[this.colorPoolHistory.length - 2];
        this.setElementColor('colorPoolLeft', this.lastColor);
      }
      if (this.undoingOrRedoing) {
        if (this.historyIndex == 0)
          this.lastColor = this.colorPoolHistory[this.colorPoolHistory.length - 1];
        else this.lastColor = this.colorPoolHistory[this.historyIndex - 1];

        this.setElementColor('colorPoolLeft', this.lastColor);
      }
      this.setElementColor('colorPoolRight', color);
      this.poolColor = color;
      this.poolSet = true;
    }
    else {
      var newColor: IrgbColor
      if (this.averageOn && !this.addOn && !this.minusOn)
        newColor = this.mixColors(this.poolColor, color);
      else if (this.addOn)
        newColor = this.addColors(this.poolColor, color);
      else if (this.minusOn)
        newColor = this.subtractColors(this.poolColor, color);
      this.setElementColor('colorPoolRight', newColor);
      this.lastColor = this.colorPoolHistory[this.colorPoolHistory.length - 1]
      this.setElementColor('colorPoolLeft', this.lastColor);
      this.poolColor = newColor;
    }
    this.colorPoolHistory.push(this.poolColor);
  }

  subtractColors(c1: IrgbColor, c2: IrgbColor): IrgbColor {
    let r = this.subtract(c1.r, this.averageOn ? this.average(c1.r, c2.r) : c2.r);
    let g = this.subtract(c1.g, this.averageOn ? this.average(c1.g, c2.g) : c2.g);
    let b = this.subtract(c1.b, this.averageOn ? this.average(c1.b, c2.b) : c2.b);
    return new rgbColor(r, g, b);
  }
  subtract(a: number, b: number) {
    var combo = a;
    if (a < b)
      combo = b - a;
    if (b < a)
      combo = a - b;
    else
      return 0;
    return combo;
  }
  addColors(c1: IrgbColor, c2: IrgbColor): IrgbColor {
    let r = this.combine(c1.r, this.averageOn ? this.average(c1.r, c2.r) : c2.r);
    let g = this.combine(c1.g, this.averageOn ? this.average(c1.g, c2.g) : c2.g);
    let b = this.combine(c1.b, this.averageOn ? this.average(c1.b, c2.b) : c2.b);
    return new rgbColor(r, g, b);
  }
  combine(a: number, b: number) {
    var combo = a + b;
    if (combo > 255)
      return 255;
    else return combo;
  }
  mixColors(c1: IrgbColor, c2: IrgbColor): IrgbColor {
    let r = this.average(c1.r, c2.r);
    let g = this.average(c1.g, c2.g);
    let b = this.average(c1.b, c2.b);
    return new rgbColor(r, g, b);
  }
  average(a: number, b: number) {
    return Math.round((a + b) / 2);
  }

  toggleAvg() {
    this.method = 'Average';
    this.averageOn = !this.averageOn;
  }
  toggleAdd() {
    this.method = 'Add';
    this.addOn = !this.addOn;
    if (this.addOn)
      this.minusOn = false;
  }
  toggleMinus() {
    this.method = 'Minus';
    this.minusOn = !this.minusOn;
    if (this.minusOn)
      this.addOn = false;
  }

  saveColor(side: string) {
    if (side == 'right')
      this.colors.push(this.poolColor);
    if (side == 'left')
      this.colors.push(this.lastColor)

  }
  setElementColor(elementId: string, color: IrgbColor) {
    document.getElementById(elementId)
      .style.backgroundColor = color.rgb;
  }

  resetPool() {
    let freshPool = new rgbColor(127, 127, 127);
    this.poolColor = freshPool;
    this.setElementColor('colorPoolRight', freshPool);
    this.poolSet = false;
  }
*/
