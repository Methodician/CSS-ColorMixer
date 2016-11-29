import { IrgbColor, RgbColor } from '../models/rgb-color';
import { Subject } from 'rxjs/Subject';
import { StateService } from './../state.service';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, trigger, state, style, transition, animate } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'color-circle',
  templateUrl: './color-circle.component.html',
  styleUrls: ['./color-circle.component.css'],
  animations: [
    trigger('jiggleState', [
      state('sitting', style({ transform: 'rotate(0deg)' })),
      state('left', style({ transform: 'rotate(-2deg)' })),
      state('right', style({ transform: 'rotate(2deg)' })),
      transition('sitting => left', animate('250ms ease-in')),
      transition('right => left', animate('250ms ease-in')),
      transition('left => right', animate('250ms ease-in')),
      transition('left => sitting', animate('100ms ease-in'))
    ]),/*YOU NEED TO IDENTIFY THE NEWEST ONE IN THE LIST UPON LOAD AND ONLY ANIMATE THAT*/
    trigger('growIn', [
      transition('void => grow', [
        style({ width: '0' }),
        animate(1000, style({ width: '*' }))
      ])
    ])

  ]
})


export class ColorCircleComponent implements OnInit, OnDestroy {
  @Input() color: IrgbColor = new RgbColor(0, 0, 0);
  @Input() showHex = true;
  //@Input() deleteOn = false;
  @Input() deleteable = true;
  @Input() newestColorKey = null;
  @Output() clicked = new EventEmitter();

  deleteOn = false;
  jiggleState = 'sitting';
  jiggling = false;
  growIn = 'in';

  stateSub: Subscription;

  constructor(private stateSvc: StateService) { }
  ngOnInit() {
    this.stateSub = this.stateSvc.deleteState
      .subscribe(deleteOn => {
        this.deleteOn = deleteOn;
        if (deleteOn && this.deleteable)
          this.jiggle();
      })
    if (this.color.$key == this.newestColorKey && !this.deleteOn)
      this.growIn = 'grow';

  }

  jiggle() {
    if (!this.jiggling) {
      this.jiggleState = 'left';
      this.jiggling = true;
    }
    setTimeout(() => {
      this.jiggleState = 'right';
      setTimeout(() => {
        this.jiggleState = 'left';
        if (this.deleteOn)
          this.jiggle();
        else {
          this.jiggleState = 'sitting';
          this.jiggling = false;
        }
      }, 250)
    }, 250);

  }


  click() {
    if (!this.deleteable && this.deleteOn) {
      return;
    }
    this.clicked.emit(this.color);
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }

}
