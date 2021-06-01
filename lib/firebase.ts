import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/analytics'

var firebaseConfig = {
    apiKey: "AIzaSyDFp0xgOMsTzwOkzhN4XL8oUQ1oaj6Adas",
    authDomain: "classes-management-7d1fc.firebaseapp.com",
    projectId: "classes-management-7d1fc",
    storageBucket: "classes-management-7d1fc.appspot.com",
    messagingSenderId: "256368361124",
    appId: "1:256368361124:web:5400fcea33f0d3978e7031",
    measurementId: "G-3FCD26YS6Q"
};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    //analytics is optional for this tutoral 
    const analytics = (): firebase.analytics.Analytics => firebase.analytics();
}

const storage = firebase.storage()

export {
    storage,
    firebase as default
}