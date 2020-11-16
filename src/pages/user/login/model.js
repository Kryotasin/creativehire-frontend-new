import { history } from 'umi';
import { message } from 'antd';
import jwt_decode from 'jwt-decode';
import { AccountLogin } from './service';
import { getPageQuery, setAuthority } from './utils/utils';

let interval;

function check(redirect){
  if(localStorage.getItem('accessTokenDecoded') !== undefined || localStorage.getItem('accessTokenDecoded') !== null){
    clearInterval(interval);
    history.replace(redirect || '/home');
  }
}

const Model = {
  namespace: 'userAndlogin',
  state: {
    status: undefined,
    error: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      try{
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

        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem('refreshTokenDecoded', JSON.stringify(jwt_decode(response.data.refresh)));
        localStorage.setItem('accessTokenDecoded', JSON.stringify(jwt_decode(response.data.access)));

        

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
        
        interval = setInterval(check, 1500, redirect);
      }

      if(response.status === 401){
        console.log("401")
      }
    }
    catch(err) {
      yield put({
        type: 'changeLoginStatus',
        payload: err.response,
        errors: err.response.data.detail
      }); // Login failed
    }
    },

  },
  reducers: {
    changeLoginStatus(state, { payload, errors }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, error: errors };
    },
  },
};
export default Model;
