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

:host /deep/ .colorCircle {
  height: 30px;
  width: 30px;
}
:host /deep/ label {
  display: none;
}
`]
})
export class PaletteComponent implements OnInit {
  @Input() palette: IPalette;

  addToPaletteState: string = null;
  removeFromPaletteState: boolean = false;
  constructor(
    private stateSvc: StateService,
    private colorSvc: ColorService
  ) { }

  ngOnInit() {
    this.stateSvc.addToPalette
      .subscribe(state =>
        this.addToPaletteState = state
      );
  }

  addColors() {
    this.removeFromPaletteState = false;
    if (this.addToPaletteState == this.palette.$key)
      this.stateSvc.setAddToPaletteState();
    else this.stateSvc.setAddToPaletteState(this.palette.$key);
  }

  removeColors() {
    this.stateSvc.setAddToPaletteState();
    this.removeFromPaletteState = !this.removeFromPaletteState;
  }

  deletePalette() {
    this.colorSvc.deletePalette(this.palette.$key);
  }

}
