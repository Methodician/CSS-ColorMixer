import { IrgbColor } from './../models/irgb-color';
import { StateService } from './state.service';
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

  colorCount: number;
  colors: Subject<IrgbColor[]> = new BehaviorSubject<IrgbColor[]>([]);
  private _colors: FirebaseListObservable<IrgbColor[]> = null;

  palettes: Subject<any[]> = new BehaviorSubject<any[]>([]);
  private _palettes: Observable<any[]> = null;
  private paletteState: string;
  private paletteColorCount: number;

  constructor(
    private db: AngularFireDatabase,
    private stateSvc: StateService
  ) {
    this.init();
  }

  init() {

    this._colors = this.db.list('colors');

    this._colors.subscribe(colors => {
      this.colors.next(colors);
      this.colorCount = colors.length
    });

    this.updatePalettes();

    this._palettes.subscribe(palettes => {
      this.palettes.next(palettes);
    });

    this.stateSvc.addToPalette
      .subscribe(state => {
        this.paletteState = state
        if (state)
          this.updatePalettes();
      });
  }

  updatePalettes() {
    this._palettes = this.db.list('/palettes')
      .map(palettes => {
        palettes.map(palette => {
          palette.colorSet = [];
          for (var key in palette.colors) {
            if (!palette.colors.hasOwnProperty(key)) continue;
            let nextColor = palette.colors[key];
            let newColor: IrgbColor = new RgbColor(nextColor.r, nextColor.g, nextColor.b);
            newColor.$key = key;
            palette.colorSet.push(newColor);
          }
          if (this.paletteState == palette.$key)
            this.paletteColorCount = palette.colorSet.length;
        })
        return palettes;
      });
  }

  newColor(color: IrgbColor) {
    console.log(this.colorCount);
    if (this.colorCount >= 50)
      alert('You can\'t store more than 50 colors here. Please remove some with the yellow button to the right, or clear the bucket with the red button to the left. You can keep them in palettes for longer term storage.');
    else
      this._colors.push(new RgbColor(color.r, color.g, color.b));

    console.log(this.colorCount);

  }

  deleteColor(color: IrgbColor) {
    this._colors.remove(color.$key);
  }
  clearColors() {
    this._colors.remove();
  }



  addColorToPalette(color: IrgbColor, paletteId?: string) {
    let newColor = new RgbColor(color.r, color.g, color.b);
    if (paletteId)
      this.addToPalette(newColor, paletteId);
    else {
      alert('that palette does not exist');
    }
  }
  addToPalette(color: IrgbColor, paletteId: string) {
    if (this.paletteColorCount >= 7)
      alert('It\'s a good practice not to use too many colors in a palette. Please keep it under 8.')
    else
      this.db.list('palettes/' + paletteId + '/colors/').push(color);

  }
  removeFromPalette(color: IrgbColor, paletteId: string) {
    this.db.object('palettes/' + paletteId + '/colors/' + color.$key)
      .remove()
      .then(done => {
        console.log(done);
      })
      .catch(error => {
        console.log(error);
      });
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
  deletePalette(paletteId: string) {
    this.db.list('palettes/' + paletteId)
      .remove()
      .then(done => {
        console.log(done);
      })
      .catch(error => {
        console.log(error);
      });
  }

}
