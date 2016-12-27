import { Subscription } from 'rxjs/Subscription';
import { ColorService } from './../../services/color.service';
import { IPalette } from './../../models/ipalette';
import { StateService } from './../../services/state.service';
import { IrgbColor } from './../../models/irgb-color';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'palette',
  templateUrl: './palette.component.html',
  //styleUrls: ['./palette.component.css'],
  styles: [`
.fa {
  display: block;
}
.fa-trash {
  transform: translateY(-12px);
  color: red;
}
.fa-plus {
  margin-top: 2px;
  color: green;
}
.fa-minus {
  margin-top: 2px;
  color: orange;
}
.palette {
  margin-left: 7px;
}
.palette-buttons {
    display: inline-block;
}
.palette-body {
    display: inline-block;
}
color-circle {
  margin: 3px;
  display: inline-block;
}
p {
  margin: 0
}


`]
})
export class PaletteComponent implements OnInit {
  @Input() palette: IPalette;

  addToPaletteState: string = null;
  addStateSub: Subscription;
  removeFromPaletteState: string = null;
  removeStateSub: Subscription;

  constructor(
    private stateSvc: StateService,
    private colorSvc: ColorService
  ) { }

  ngOnInit() {
    this.addStateSub = this.stateSvc.addToPalette
      .subscribe(state =>
        this.addToPaletteState = state
      );
    this.removeStateSub = this.stateSvc.removeFromPalette
      .subscribe(state =>
        this.removeFromPaletteState = state
      );
  }

  removeStateOn() {
    return this.removeFromPaletteState == this.palette.$key;
  }

  addColors() {
    this.stateSvc.setRemoveFromPaletteState();
    if (this.addToPaletteState == this.palette.$key)
      this.stateSvc.setAddToPaletteState();
    else this.stateSvc.setAddToPaletteState(this.palette.$key);
  }

  removeColors() {
    this.stateSvc.setAddToPaletteState();
    if (this.removeFromPaletteState == this.palette.$key)
      this.stateSvc.setRemoveFromPaletteState();
    else this.stateSvc.setRemoveFromPaletteState(this.palette.$key);
  }

  clickColor($event) {
    if (this.removeFromPaletteState == this.palette.$key) {
      this.colorSvc.removeFromPalette($event, this.palette.$key);
    }
  }

  deletePalette() {
    this.colorSvc.deletePalette(this.palette.$key);
  }

  ngOnDestroy() {
    if (this.addStateSub)
      this.addStateSub.unsubscribe();
    if (this.removeStateSub)
      this.removeStateSub.unsubscribe();
  }

}
