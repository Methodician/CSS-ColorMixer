import { Subject } from 'rxjs/Subject';
import { StateService } from './../state.service';
import { RgbColor } from '../models/rgb-color';
import { Component, OnInit, Input, Output, EventEmitter, trigger, state, style, transition, animate } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'color-circle',
  templateUrl: './color-circle.component.html',
  styleUrls: ['./color-circle.component.css'],
  animations: [
    trigger('jiggleState', [
      state('sitting', style({
        transform: 'rotate(0deg)'
      })),
      transition('sitting => left', [
        animate(500, style({ transform: 'rotate(-7deg)' }))
      ]),
      transition('right => left', [
        animate(500, style({ transform: 'rotate(-7deg)' }))
      ]),
      transition('left => right', [
        animate(500, style({ transform: 'rotate(7deg)' }))
      ])
    ])
})

export class ColorCircleComponent implements OnInit {
  @Input() color = new RgbColor(0, 0, 0);
  @Input() showHex = true;
  //@Input() deleteOn = false;
  @Input() deleteable = true;
  @Output() clicked = new EventEmitter();

  deleteOn = false;
  jiggleState = 'sitting';

  stateSub: Subscription;

  constructor(private stateSvc: StateService) { }
  ngOnInit() {
    this.stateSub = this.stateSvc.deleteState
      .subscribe(deleteOn => {
        this.deleteOn = deleteOn;
        if (deleteOn)
          this.jiggle();
      })

  }

  jiggle() {

    setTimeout(() => {
      this.jiggleState = 'left';
      setTimeout(() => {
        this.jiggleState = 'right';
        if (this.deleteOn)
          this.jiggle();
      }, 1000)
    }, 1000);

  }


  click() {
    if (!this.deleteable && this.deleteOn) {
      return;
    }
    this.clicked.emit(this.color);
  }

}
