import { firebaseConfig, authConfig } from './../assets/firebase.config';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule, AuthMethods, AuthProviders } from 'angularFire2';
//import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { MixerComponent } from './mixer/mixer.component';
import { ColorCircleComponent } from './color-circle/color-circle.component';
import { LeftUiComponent } from './left-ui/left-ui.component';
import { RightUiComponent } from './right-ui/right-ui.component';
import { PalettesComponent } from './palettes/palettes.component';

@NgModule({
  declarations: [
    AppComponent,
    MixerComponent,
    ColorCircleComponent,
    LeftUiComponent,
    RightUiComponent,
    PalettesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig, authConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
