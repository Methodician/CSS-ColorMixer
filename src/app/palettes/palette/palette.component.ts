import { Subscription } from 'rxjs/Subscription';
import { ColorService } from './../../services/color.service';
import { IPalette } from './../../models/ipalette';
import { StateService } from './../../services/state.service';
import { IrgbColor } from './../../models/irgb-color';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.css']
  /*  styles: [`
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
  
  
  `]*/
})
export class PaletteComponent implements OnInit {
  @Input() palette: IPalette;

  addToPaletteState: string = null;
  addStateSub: Subscription;
  removeFromPaletteState: string = null;
  removeStateSub: Subscription;
  selectedPaleteState: string = null;
  selectedStateSub: Subscription;

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
    this.selectedStateSub = this.stateSvc.selectedPalette
      .subscribe(state =>
        this.selectedPaleteState = state
      )
  }

  removeStateOn() {
    return this.removeFromPaletteState == this.palette.$key;
  }
  addStateOn() {
    return this.addToPaletteState == this.palette.$key;
  }
  selectedStateOn() {
    return this.selectedPaleteState == this.palette.$key;
  }

  selectPalette() {
    this.stateSvc.setRemoveFromPaletteState();
    this.stateSvc.setAddToPaletteState();
    if (this.selectedStateOn())
      this.stateSvc.setSelectedPalette();
    else this.stateSvc.setSelectedPalette(this.palette.$key);
  }

  addColors() {
    this.stateSvc.setRemoveFromPaletteState();
    this.stateSvc.setSelectedPalette();
    if (this.addStateOn())
      this.stateSvc.setAddToPaletteState();
    else this.stateSvc.setAddToPaletteState(this.palette.$key);
  }

  removeColors() {
    this.stateSvc.setAddToPaletteState();
    this.stateSvc.setSelectedPalette();
    if (this.removeStateOn())
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
