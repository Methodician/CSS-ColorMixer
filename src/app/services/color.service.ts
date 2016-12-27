import { IrgbColor } from '../models/irgb-color';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { RgbColor } from './../models/rgb-color';
import { AngularFireDatabase, FirebaseListObservable } from 'angularFire2';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';


@Injectable()
export class ColorService {

  colors: Subject<IrgbColor[]> = new BehaviorSubject<IrgbColor[]>([]);
  private _colors: FirebaseListObservable<IrgbColor[]> = null;

  palettes: Subject<any[]> = new BehaviorSubject<any[]>([]);
  private _palettes: Observable<any[]> = null;

  constructor(public db: AngularFireDatabase) {
    this.init();
  }

  init() {
    this._colors = this.db.list('colors');
    this._colors.subscribe(colors => {
      this.colors.next(colors);
    });


    this._palettes = this.db.list('/palettes')
      .map(palettes => {
        palettes.map(palette => {
          palette.colorSet = [];
          for (var key in palette.colors) {
            if (!palette.colors.hasOwnProperty(key)) continue;
            palette.colorSet.push(palette.colors[key]);
          }
        })
        return palettes;
      });
    this._palettes.subscribe(palettes => {
      this.palettes.next(palettes);
    });
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
  }
  addToPalette(color: IrgbColor, paletteId: string) {
    this.db.list('palettes/' + paletteId + '/colors/').push(color);
  }
  createPalette(/*paletteId?: string, */paletteName?: string) {
    var name = paletteName;
    this.db.object('/palettesMade')
      .take(1)
      .subscribe(paletteNumber => {
        let newNumber = paletteNumber.$value + 1;
        if (!paletteName)
          name = 'Palette #' + newNumber;
        this.db.object('/palettesMade').set(newNumber);
        this.db.list('/palettes').push({ name: name });
      })
  }

  deleteColor(color: IrgbColor) {
    this._colors.remove(color.$key);
  }
  clearColors() {
    this._colors.remove();
  }

}
