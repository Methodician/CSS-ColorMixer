import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class StateService {

  constructor() { }

  deleteState: Subject<boolean> = new BehaviorSubject<boolean>(false);
  paletteOpen: Subject<boolean> = new BehaviorSubject<boolean>(false);
  addToPalette: Subject<string> = new BehaviorSubject<string>(null);
  removeFromPalette: Subject<string> = new BehaviorSubject<string>(null);
  selectedPalette: Subject<string> = new BehaviorSubject<string>(null);

  setDeleteState(state: boolean) {
    this.deleteState.next(state);
  }

  setPaletteOpen(state: boolean) {
    this.paletteOpen.next(state);
  }

  setAddToPaletteState(state?: string) {
    this.addToPalette.next(state);
  }

  setRemoveFromPaletteState(state?: string) {
    this.removeFromPalette.next(state);
  }

  setSelectedPalette(state?: string) {
    this.selectedPalette.next(state);
  }

}
