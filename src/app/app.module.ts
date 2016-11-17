import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularFire2';
//import { HttpModule } from '@angular/http';

export const firebaseConfig = {
  apiKey: "AIzaSyA5rAiXARCh82cAjG4cfyeOgBMfgBJylpo",
  authDomain: "css-colormixer-test.firebaseapp.com",
  databaseURL: "https://css-colormixer-test.firebaseio.com",
  storageBucket: "css-colormixer-test.appspot.com",
  messagingSenderId: "518501943795"
}

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
