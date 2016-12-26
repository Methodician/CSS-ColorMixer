import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { IrgbColor, RgbColor } from './../models/rgb-color';
import { AngularFireDatabase, FirebaseListObservable } from 'angularFire2';
import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {

  colors: Subject<IrgbColor[]> = new BehaviorSubject<IrgbColor[]>(null);
  private _colors: FirebaseListObservable<IrgbColor[]> = null;

  constructor(public db: AngularFireDatabase) {
    this.init();
  }

  init() {
    this._colors = this.db.list('colors');
    this._colors.subscribe(colors => {
      this.colors.next(colors);
    })
  }

  newColor(color: IrgbColor) {
    this._colors.push(new RgbColor(color.r, color.g, color.b));
  }

  /* addNewPalette() {
     return this.db.list('palettes').push({})
       .then(x => {
         return (x.key);
       })
   }*/

  addColorToPalette(color: IrgbColor, paletteId?: string) {
    if (paletteId)
      this.addToPalette(color, paletteId);
    else {
      this.db.list('palettes/').push({})
        .then(x => {
          this.addToPalette(color, x.key);
        });
    }

    //this._colors.update('/palettes/' + paletteId,)
  }
  addToPalette(color: IrgbColor, paletteId: string) {
    this.db.list('palettes/' + paletteId).push(color);
  }

  deleteColor(color: IrgbColor) {
    this._colors.remove(color.$key);
  }

}
