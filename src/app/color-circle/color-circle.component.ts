import { RgbColor } from '../models/rgb-color';
import { IrgbColor } from '../models/irgb-color';
import { Subject } from 'rxjs/Subject';
import { StateService } from './../services/state.service';
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
        animate(250, style({ width: '*' }))
      ])
    ])

  ]
})


export class ColorCircleComponent implements OnInit, OnDestroy {
  @Input() color: IrgbColor = new RgbColor(0, 0, 0);
  @Input() inPalette = false;
  @Input() showHex = true;
  @Input() deleteable = true;
  @Input() newestColorKey = null;
  @Output() clicked = new EventEmitter();
  @Input() deleteOn = false;

  addToPalette = false;
  //deleteOn = false;
  jiggleState = 'sitting';
  jiggling = false;
  growIn = 'in';

  deleteSub: Subscription;
  addSub: Subscription;


  constructor(private stateSvc: StateService) { }
  ngOnInit() {
    if (!this.inPalette) {
      this.deleteSub = this.stateSvc.deleteState
        .subscribe(deleteOn => {
          this.deleteOn = deleteOn;
          if (deleteOn && this.deleteable)
            this.jiggle();
        });
      this.addSub = this.stateSvc.addToPalette
        .subscribe(addState => {
          if (addState)
            this.addToPalette = true;
          else this.addToPalette = false;
        })
    }

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
    if ((!this.deleteable && this.deleteOn) || (!this.addToPalette && !this.deleteOn)) {
      return;
    }
    this.clicked.emit(this.color);
  }

  ngOnDestroy() {
    if (this.deleteSub)
      this.deleteSub.unsubscribe();
    if (this.addSub)
      this.addSub.unsubscribe();
  }

}
