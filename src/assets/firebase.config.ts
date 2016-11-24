import { AuthProviders, AuthMethods } from 'angularFire2';

// TEST
/*export const firebaseConfig = {
    apiKey: "AIzaSyA5rAiXARCh82cAjG4cfyeOgBMfgBJylpo",
    authDomain: "css-colormixer-test.firebaseapp.com",
    databaseURL: "https://css-colormixer-test.firebaseio.com",
    storageBucket: "css-colormixer-test.appspot.com",
    messagingSenderId: "518501943795"
}*/

// PROD
export const firebaseConfig = {
    apiKey: "AIzaSyAc4xI67Kr3-lqqsSTKXvKGsVF6flq-Zi8",
    authDomain: "css-colormixer.firebaseapp.com",
    databaseURL: "https://css-colormixer.firebaseio.com",
    storageBucket: "css-colormixer.appspot.com",
    messagingSenderId: "1057907796380"
}

export const authConfig = {
    provider: AuthProviders.Google,
    method: AuthMethods.Popup
}