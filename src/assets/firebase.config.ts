import { AuthProviders, AuthMethods } from 'angularFire2';


export const firebaseConfig = {
    apiKey: "AIzaSyA5rAiXARCh82cAjG4cfyeOgBMfgBJylpo",
    authDomain: "css-colormixer-test.firebaseapp.com",
    databaseURL: "https://css-colormixer-test.firebaseio.com",
    storageBucket: "css-colormixer-test.appspot.com",
    messagingSenderId: "518501943795"
}

export const authConfig = {
    provider: AuthProviders.Google,
    method: AuthMethods.Popup
}