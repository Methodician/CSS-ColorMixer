import { MixerService } from './services/mixer.service';
import { ColorService } from './services/color.service';
import { StateService } from './services/state.service';
import { firebaseConfig, authConfig } from './../assets/firebase.config';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule, AuthMethods, AuthProviders } from 'angularFire2';
//import { HttpModule } from '@angular/http';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'angular2-perfect-scrollbar';


import { AppComponent } from './app.component';
import { MixerComponent } from './mixer/mixer.component';
import { ColorCircleComponent } from './color-circle/color-circle.component';
import { PalettesComponent } from './palettes/palettes.component';
import { ReversePipe } from './reverse.pipe';
import { PaletteComponent } from './palettes/palette/palette.component';


const PERVECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
}

@NgModule({
  declarations: [
    AppComponent,
    MixerComponent,
    ColorCircleComponent,
    PalettesComponent,
    ReversePipe,
    PaletteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig, authConfig),
    PerfectScrollbarModule.forRoot(PERVECT_SCROLLBAR_CONFIG)
  ],
  providers: [
    StateService,
    ColorService,
    MixerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
