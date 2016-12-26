import { StateService } from './services/state.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private paletteOpen = false;
  constructor(private stateSvc: StateService) {
  }

  ngOnInit() {
    this.stateSvc.paletteOpen
      .subscribe(open =>
        this.paletteOpen = open
      );
  }

  //  loginGoogle() {
  //    this.af.auth.login();
  //  }

  //  loginTwitter() {
  //    alert('Twitter login not implemented yet... Please use Google');
  /*this.af.auth.login({
    provider: AuthProviders.Twitter,
    method: AuthMethods.Redirect
  });*/
  //  }

  //  loginFacebook() {
  //    alert('Facebook login not implemented yet... Please use Google');
  //  }

  //  logout() {
  //    this.af.auth.logout();
  //  }
}
