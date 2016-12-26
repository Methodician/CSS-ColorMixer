import { Injectable } from '@angular/core';
import { RgbColor, IrgbColor } from './../models/rgb-color';


@Injectable()
export class MixerService {

  averageOn = true;

  constructor() { }

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

}
