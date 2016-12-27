import { FirebaseListObservable } from 'angularFire2';
import { ColorService } from './../services/color.service';
import { StateService } from './../services/state.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'palettes',
  templateUrl: './palettes.component.html',
  styleUrls: ['./palettes.component.css']
})
export class PalettesComponent implements OnInit {

  private paletteOpen = false;

  palettes: any[];
  constructor(
    private stateSvc: StateService,
    private colorSvc: ColorService
  ) { }

  ngOnInit() {
    this.stateSvc.paletteOpen
      .subscribe(open =>
        this.paletteOpen = open
      );

    this.colorSvc.palettes
      .subscribe(palettes =>
        this.palettes = palettes
      );
  }

  addPalette() {
    this.colorSvc.createPalette()
  }


}
