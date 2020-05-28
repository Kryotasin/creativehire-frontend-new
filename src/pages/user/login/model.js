import { history } from 'umi';
import { message } from 'antd';
import { AccountLogin } from './service';
import { getPageQuery, setAuthority } from './utils/utils';

const Model = {
  namespace: 'userAndlogin',
  state: {
    status: undefined,
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

        localStorage.setItem('userID', response.data['id']);
        localStorage.setItem('userKey', response.data['token']);

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

        history.replace(redirect || '/');
      }
    }
    catch(err) {
      yield put({
        type: 'changeLoginStatus',
        payload: err.response,
        errors: err.response.data['non_field_errors'][0]
      }); // Login failed
    }
    },

  },
  reducers: {
    changeLoginStatus(state, { payload, errors }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, userKey: payload.data['token'], userID: payload.data['id'], error: errors };
    },
  },
};
export default Model;
