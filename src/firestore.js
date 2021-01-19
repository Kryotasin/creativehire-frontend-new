import firebase from 'firebase';
import { Button, notification } from 'antd';
import axios from '../src/umiRequestConfig';
import asyncLocalStorage from './asyncLocalStorage';
import jwt_decode from 'jwt-decode';

let messageTokenFirebase;



const sendTokenToServer = (token, userID) => {
  const data = {
    'user_id': btoa(userID), 
    'token': token
  };

  return axios.post(REACT_APP_AXIOS_API_V1.concat('reporting/post-login-session-record/'), data)
} 

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

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

export const messageTokenRunner = () =>{
  messaging.getToken({vapidKey: "BMYqb2tre5pNAjYUvv5p3d8XO4Cdpjn282k6c-CJxsaheEacW2ILSJK3ke_pzNXtDGpFvrYJt36VhkEW7ck924A"})
  .then(async (currentToken) => {
    if (currentToken) {
      messageTokenFirebase = currentToken;
  
      return asyncLocalStorage.getItem('accessToken') 
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }

  })
  .then((token) => {
    return JSON.parse(JSON.stringify(jwt_decode(token)))
  })
  .then((token) => {
    return sendTokenToServer(messageTokenFirebase, token.user_id)
  })
  .then((res) => {
    if(res.status !== 200 || !Number.isInteger(res.data)){
      return asyncLocalStorage.setItem('messageToken', -1)
    }

    if(res.status === 200){
      return asyncLocalStorage.setItem('messageToken', messageTokenFirebase)
    }
    return Error('Failed')
  })
  .finally((res) => {
    if(res === 'Failed'){      
      return asyncLocalStorage.setItem('messageToken', -1)
    }
  })

.catch(async (err) => {
  console.log('An error occurred while retrieving token. ', err);
  await asyncLocalStorage.setItem('messageToken', -1);
  // showToken('Error retrieving registration token. ', err);
  // setTokenSentToServer(false);
});
}

// Notification definition -------------------------------------------

const close = () => {
  console.log(
    'Notification was closed. Either the close button was clicked or duration time elapsed.',
  );
};


messaging.onMessage((payload) => {
  
  console.log('onMessage: ', payload);
  const key = `open${Date.now()}`;
  const btn = (
    <Button type="primary" size="small" onClick={() => notification.close(key)}>
      Close
    </Button>
  );
  notification.info({
    message: payload.notification.title,
    description: payload.notification.body,
    btn,
    key,
    onClose: close,
    onClick: () => {
      let url = REACT_APP_FRONTEND_BASEURL.concat('/search-jobs/?');

      if(payload.data['gcm.notification.visited'] === '1'){        
        url = url.concat(`visited=${(btoa('True'))}&`);
      }
      
      if(payload.data['gcm.notification.today'] === '1'){        
        url = url.concat(`posted_today=${(btoa('True'))}&`);
      }

      window.open(url, '_blank');
      
    }
  });
});