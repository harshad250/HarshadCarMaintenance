// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCk3tUMnXZakeEt9jPQfU_c7EawxmMoE2g",
    authDomain: "login-registration-fireb-7b100.firebaseapp.com",
    projectId: "login-registration-fireb-7b100",
    storageBucket: "login-registration-fireb-7b100.appspot.com",
    messagingSenderId: "386818563770",
    appId: "1:386818563770:android:75049752bdf9e9dfb82c83"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Make sure Firebase Auth is enabled in your Firebase Console
const auth = firebase.auth();
window.auth = auth;
