import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularFire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: FirebaseListObservable<any[]>;
  constructor(private af: AngularFire) {
    this.items = af.database.list('/items');
  }

  loginGoogle() {
    this.af.auth.login();
  }

  loginTwitter() {
    alert('Twitter login not implemented yet... Please use Google');
    /*this.af.auth.login({
      provider: AuthProviders.Twitter,
      method: AuthMethods.Redirect
    });*/
  }

  loginFacebook() {
    alert('Facebook login not implemented yet... Please use Google');
  }

  logout() {
    this.af.auth.logout();
  }
}
