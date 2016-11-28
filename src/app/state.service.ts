import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class StateService {

  constructor() { }

  deleteState: Subject<boolean> = new BehaviorSubject<boolean>(false);

  setDeleteState(state: boolean) {
    this.deleteState.next(state);
  }

}
