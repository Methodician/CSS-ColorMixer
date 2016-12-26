import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class StateService {

  constructor() { }

  deleteState: Subject<boolean> = new BehaviorSubject<boolean>(false);
  paletteOpen: Subject<boolean> = new BehaviorSubject<boolean>(true);

  setDeleteState(state: boolean) {
    this.deleteState.next(state);
  }

  setPaletteOpen(state: boolean) {
    this.paletteOpen.next(state); 
  }

}
