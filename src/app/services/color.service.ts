import { IPalette } from './../models/ipalette';
import { IrgbColor } from './../models/irgb-color';
import { StateService } from './state.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { RgbColor } from './../models/rgb-color';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularFire2';
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
  private paletteId: string;
  private paletteColorCount: number;

  private _selectedPalette: FirebaseObjectObservable<IPalette> = null;
  selectedPalette: Subject<IPalette> = new BehaviorSubject<IPalette>(null);

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

    this.setCurrentPalette();

    this.stateSvc.addToPalette
      .subscribe(state => {
        this.paletteId = state;
        this.setCurrentPalette(state);
        if (state)
          this.updatePalettes();
      });

    this.stateSvc.removeFromPalette
      .subscribe(state => {
        this.paletteId = state;
        this.setCurrentPalette(state);
      })

    this.stateSvc.selectedPalette
      .subscribe(state => {
        this.paletteId = state;
        this.setCurrentPalette(state);
      })
  }

  updatePalettes() {
    this._palettes = this.db.list('/palettes')
      .map(palettes => {
        palettes.map(palette => {
          this.mapPalette(palette);
          /*palette.colorSet = [];
          for (var key in palette.colors) {
            if (!palette.colors.hasOwnProperty(key)) continue;
            let nextColor = palette.colors[key];
            let newColor: IrgbColor = new RgbColor(nextColor.r, nextColor.g, nextColor.b);
            newColor.$key = key;
            palette.colorSet.push(newColor);
          }*/
          /*if (this.paletteId == palette.$key)
            this.paletteColorCount = palette.colorSet.length;*/
        })
        return palettes;
      });
  }


  setCurrentPalette(paletteId?: string) {
    /*    if (!paletteId) {
          this._selectedPalette = null;
          this.selectedPalette.next(null);
        }
        else {*/
    this._selectedPalette = this.db.object('/palettes/' + paletteId);
    this._selectedPalette.subscribe(palette => {
      let nextPalette = this.mapPalette(palette);
      this.paletteColorCount = nextPalette.colorSet.length;
      this.selectedPalette.next(nextPalette);
    });
    /*.map(palette => {
      //return this.mapPalette(palette);
      //this.selectedPalette.next(this.mapPalette(palette));
      palette.colorSet = [];
      for (var key in palette.colors) {
        if (!palette.colors.hasOwnProperty(key)) continue;
        let nextColor = palette.colors[key];
        let newColor: IrgbColor = new RgbColor(nextColor.r, nextColor.g, nextColor.b);
        newColor.$key = key;
        palette.colorSet.push(newColor);
      }
      return palette;
    })*/
    /*}*/
  }

  mapPalette(palette: IPalette) {
    palette.colorSet = [];
    for (var key in palette.colors) {
      if (!palette.colors.hasOwnProperty(key)) continue;
      let nextColor = palette.colors[key];
      let newColor: IrgbColor = new RgbColor(nextColor.r, nextColor.g, nextColor.b);
      newColor.$key = key;
      palette.colorSet.push(newColor);
    }
    return palette;
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
