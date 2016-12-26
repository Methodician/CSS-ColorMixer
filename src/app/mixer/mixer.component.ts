import { MixerService } from './../services/mixer.service';
import { ColorService } from './../services/color.service';
import { StateService } from './../services/state.service';
import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';

import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularFire2';

import { RgbColor, IrgbColor } from './../models/rgb-color';

@Component({
  selector: 'mixer',
  templateUrl: './mixer.component.html',
  styleUrls: ['./mixer.component.css'],
  animations: [
    trigger('lastShiftState', [
      state('shifting', style({ transform: 'translateX(-100%)' })),
      state('sitting', style({ transform: 'translateX(-100%)' })),
      transition('sitting => shifting', animate('200ms ease-in'))
    ]),
    trigger('leftShiftState', [
      state('shifting', style({ transform: 'translateX(-200%)' })),
      state('unshifting', style({ transform: 'translateX(0)' })),
      state('sitting', style({ transform: 'translateX(-100%)' })),
      transition('sitting => shifting', animate('200ms ease-out')),
      transition('sitting => unshifting', animate('200ms ease-in'))
    ]),
    trigger('rightShiftState', [
      state('shifting', style({ transform: 'translateX(0) translateY(-100%)' })),
      state('unshifting', style({ transform: 'translateX(200%) translateY(-100%)' })),
      state('sitting', style({ transform: 'translateX(100%) translateY(-100%)' })),
      transition('sitting => shifting', animate('200ms ease-out')),
      transition('sitting => unshifting', animate('200ms ease-in'))
    ]),
    trigger('nextShiftState', [
      state('shifting', style({ transform: 'translateX(0) translateY(-100%)' })),
      state('sitting', style({ transform: 'translateX(100%) translateY(-100%)' })),
      transition('sitting => shifting', animate('200ms ease-out'))
    ])
  ]
})
export class MixerComponent implements OnInit {

  defaultPool: IrgbColor = new RgbColor(68, 68, 68);

  //  States from service:
  deleteOn = false;
  paletteOpen = false;

  //  Other states:
  averageOn = true;
  addOn = false;
  minusOn = false;
  poolSet = false;
  showHex = true;
  historyIndex = 0;
  colorHistorical = false;
  undoing = false;
  redoing = false;
  shiftState = 'sitting';
  //  colorsInitialized = false;
  //inInnerPool = false;
  //inPool = false;


  red: IrgbColor = new RgbColor(255, 0, 0);
  green: IrgbColor = new RgbColor(0, 255, 0);
  blue: IrgbColor = new RgbColor(0, 0, 255);
  white: IrgbColor = new RgbColor(255, 255, 255);
  black: IrgbColor = new RgbColor(0, 0, 0);


  poolColor: IrgbColor = this.defaultPool;
  lastColor: IrgbColor;

  //  draggingColor: IrgbColor = null;
  colorPoolHistory: IrgbColor[] = [];

  coreColors: IrgbColor[] = [this.red, this.green, this.blue, this.white, this.black];
  colors: IrgbColor[] = [];
  //colors: FirebaseListObservable<IrgbColor[]>;
  newestColor: IrgbColor;


  constructor(
    private db: AngularFireDatabase,
    private stateSvc: StateService,
    private colorSvc: ColorService,
    private mixerSvc: MixerService
  ) { }

  ngOnInit() {
    this.stateSvc.deleteState
      .subscribe(state =>
        this.deleteOn = state
      );
    this.stateSvc.paletteOpen
      .subscribe(state =>
        this.paletteOpen = state
      );
    this.colorSvc.colors
      .subscribe(colors => {
        this.colors = colors;
        this.newestColor = colors[colors.length - 1];
      })
    /*this.colors = this.db.list('colors');
    this.colors.subscribe(colors =>
      this.newestColor = colors[colors.length - 1]
    );*/
    this.setElementColor('colorPool', this.poolColor);
    this.colorPoolHistory.push(this.poolColor);
  }

  testPalette() {
    //this.colorSvc.addColorToPalette(this.lastColor, '-KZwa6c_in7E--t7KP-2');
    this.stateSvc.setPaletteOpen(!this.paletteOpen);
  }

  pickColor(color: IrgbColor) {
    if (this.deleteOn) {
      this.deleteColor(color);
    }
    else {
      this.selectColor(color);
    }
  }

  selectColor(color: IrgbColor) {
    if (!this.poolSet) {
      if (this.undoing || this.redoing) {
        if (this.historyIndex == 0)
          this.lastColor = this.colorPoolHistory[this.colorPoolHistory.length - 1];
        else this.lastColor = this.colorPoolHistory[this.historyIndex - 1];
        if (this.redoing) {
          this.setElementColor('colorPoolNext', color);
          this.shiftState = 'shifting';
        }
        if (this.undoing) {
          this.setElementColor('colorPoolLast', this.lastColor);
          this.shiftState = 'unshifting';
        }
        setTimeout(() => {
          this.setElementColor('colorPoolLeft', this.lastColor);
          this.setElementColor('colorPoolRight', color);
          this.shiftState = 'sitting'
        }, 200);
      } else {
        this.setElementColor('colorPoolRight', color);
      }
      this.poolColor = color;
      this.poolSet = true;
    }
    else {
      this.shiftState = 'shifting';

      var newColor: IrgbColor
      if (this.averageOn && !this.addOn && !this.minusOn)
        newColor = this.mixerSvc.mixColors(this.poolColor, color);
      else if (this.addOn)
        newColor = this.mixerSvc.addColors(this.poolColor, color);
      else if (this.minusOn)
        newColor = this.mixerSvc.subtractColors(this.poolColor, color);
      this.historyIndex = this.colorPoolHistory.length;
      this.lastColor = this.colorPoolHistory[this.historyIndex - 1]
      this.poolColor = newColor;
      this.setElementColor('colorPoolNext', newColor)
      setTimeout(() => {
        this.setElementColor('colorPoolRight', newColor);
        this.setElementColor('colorPoolLeft', this.lastColor);
        this.shiftState = 'sitting';
      }, 200);
    }
    this.colorPoolHistory.push(this.poolColor);
  }


  undo() {
    if (this.colorPoolHistory.length > 1) {
      this.undoing = true;
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
    this.undoing = false;
  }
  redo() {
    if (this.colorPoolHistory.length > 1) {
      this.redoing = true;
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
    this.redoing = false;
  }

  /*subtractColors(c1: IrgbColor, c2: IrgbColor): IrgbColor {
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
  }*/

  toggleAvg() {
    //this.method = 'Average';
    this.averageOn = !this.averageOn;
    this.mixerSvc.averageOn = this.averageOn;
    if (!this.averageOn && !this.addOn && !this.minusOn)
      this.addOn = true;
  }
  toggleAdd() {
    //this.method = 'Add';
    this.addOn = !this.addOn;
    if (this.addOn)
      this.minusOn = false;
    if (!this.addOn && !this.minusOn && !this.averageOn)
      this.averageOn = true;
  }
  toggleMinus() {
    //this.method = 'Minus';
    this.minusOn = !this.minusOn;
    if (this.minusOn)
      this.addOn = false;
    if (!this.addOn && !this.minusOn && !this.averageOn)
      this.averageOn = true;
  }

  toggleDelete() {
    this.stateSvc.setDeleteState(!this.deleteOn);
  }

  saveColor(side: string) {
    if (side == 'right')
      this.colorSvc.newColor(this.poolColor);
    if (side == 'left')
      this.colorSvc.newColor(this.lastColor);
  }
  deleteColor(color: IrgbColor) {
    this.colorSvc.deleteColor(color);
  }

  resetPool() {
    this.poolColor = this.defaultPool;
    this.setElementColor('colorPoolRight', this.defaultPool);
    this.poolSet = false;
  }

  setElementColor(elementId: string, color: IrgbColor) {
    document.getElementById(elementId)
      .style.backgroundColor = color.rgb;
  }

  clearColors() {
    this.colorSvc.clearColors();
  }
  toggleHex() {
    this.showHex = !this.showHex;
  }
}
