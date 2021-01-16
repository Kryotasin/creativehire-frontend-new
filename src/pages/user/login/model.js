import { history } from 'umi';
import { message } from 'antd';
import { AccountLogin } from './service';
import { getPageQuery, setAuthority } from './utils/utils';

import asyncLocalStorage from '../../../asyncLocalStorage';

let interval;

function check(redirect, verif){
  if(localStorage.getItem('accessTokenDecoded') !== undefined || localStorage.getItem('accessTokenDecoded') !== null && localStorage.getItem('accessTokenDecoded') === verif){
    clearInterval(interval);
    history.replace(redirect || '/home');
  }
  else{
    console.log('waiting...')
  }
}

const Model = {
  namespace: 'userAndlogin',
  state: {
    status: undefined,
    error: undefined,
    submitting: false
  },
  effects: {
    *login({ payload }, { call, put }) {
      try{
        yield put({
          type: 'changeSubmiting',
          submitting: true,
        }); // Change submitting to True
        const response = yield call(AccountLogin, payload);

        yield put({
        type: 'changeLoginStatus',
        payload: response,
        errors: ''
        }); // Login successfully

        if (response.status === 200) {       

          message.success('Login succesful!');        

          // Set in localStorage
          
          localStorage.clear();

          // localStorage.setItem("refreshToken", String(response.data.refresh));
          // localStorage.setItem("accessToken", String(response.data.access));
          // localStorage.setItem('refreshTokenDecoded', JSON.stringify(jwt_decode(response.data.refresh)));
          // localStorage.setItem('accessTokenDecoded', JSON.stringify(jwt_decode(response.data.access)));

          const setAccessToken = asyncLocalStorage.setItem('accessToken', response.data.access);
          const setRefreshToken = asyncLocalStorage.setItem('refreshToken', response.data.refresh);

          Promise.all([setAccessToken, setRefreshToken])
          .then(function () {
            return asyncLocalStorage.getItem('accessToken');
          })          
          .then(function () {
            return asyncLocalStorage.getItem('refreshToken');
          })        
          .finally((c) =>{
            const urlParams = new URL(window.location.href);
            const params = getPageQuery();
            let { redirect } = params;

            if (redirect) {
              const redirectUrlParams = new URL(redirect);

              if (redirectUrlParams.origin === urlParams.origin) {
                redirect = redirect.substr(urlParams.origin.length);

                if (redirect.match(/^\/.*#/)) {
                  redirect = redirect.substr(redirect.indexOf('#') + 1);
                }
              } else {
                window.location.href = redirect;
                return;
              }
            }

            // interval = setInterval(check, 2000, redirect, JSON.stringify(jwt_decode(response.data.access)));
            history.replace(redirect || '/home');
          });

        }
        if(response.status === 401){
          console.log("401")
        }
      }
      catch(err) {

        if(!err.response){console.log(err)
          yield put({
            type: 'changeLoginStatus',
            payload: {'status': 521},
            errors: 'Our server seems to be down. Please contact admin@creativehire.co if problem persists.'
          }); // Server is down
        }
        else{
          yield put({
            type: 'changeLoginStatus',
            payload: err.response,
            errors: err.response.data.detail
          }); // Login failed
        }
      }
      yield put({
        type: 'changeSubmiting',
        submitting: false,
      }); // Change submitting to False
    },

  },
  reducers: {
    changeLoginStatus(state, { payload, errors }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, error: errors };
    },

    changeSubmiting(state, payload) {
      return { ...state, submitting: payload.submitting}
    },
  },
};
export default Model;
