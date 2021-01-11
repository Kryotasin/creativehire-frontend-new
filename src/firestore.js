import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const app = firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore(app);

// export const messaging = firestore.md.firebase_.messaging;

navigator.serviceWorker
     .register('firebase-messaging-sw.js')
     .then((registration) => {
      firestore.md.firebase_.messaging().useServiceWorker(registration);
     });

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    // await messaging.requestPermission();
    const token = await messaging.getToken({vapidKey: 'BMYqb2tre5pNAjYUvv5p3d8XO4Cdpjn282k6c-CJxsaheEacW2ILSJK3ke_pzNXtDGpFvrYJt36VhkEW7ck924A'}).then((currentToken) => {
      if (currentToken) {console.log(currentToken)
        // sendTokenToServer(currentToken);
        // updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No registration token available. Request permission to generate one.');
        // Show permission UI.
        // updateUIForPushPermissionRequired();
        // setTokenSentToServer(false);
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      showToken('Error retrieving registration token. ', err);
      // setTokenSentToServer(false);
    });
    
    return token;
  } catch (error) {
    console.error(error);
  }
}

export default firestore;