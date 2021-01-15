importScripts('https://www.gstatic.com/firebasejs/8.2.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.2/firebase-messaging.js');

const firebaseConfig = {
    apiKey: 'AIzaSyCiEA09zrrTRcjvWQmrfhD3apvkvKxxjY4',
    authDomain: 'creative-hire.firebaseapp.com',
    databaseURL: 'https://creative-hire.firebaseio.com',
    projectId: 'creative-hire',
    storageBucket: 'creative-hire.appspot.com',
    messagingSenderId: '670428904180',
    appId: '1:670428904180:web:35e59368ff728a4d8dbca1',
    measurementId: 'G-LWN3E48BC7'
  };

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('onBackgroundMessage: ', payload)
});