import { userRegister } from './service';

import jwt_decode from 'jwt-decode';


const Model = {
  namespace: 'userAndregister',
  state: {
    status: undefined,
  },
  effects: {
    *submit({ payload }, { call, put }) {

    try{ 
      localStorage.clear();
      const response = yield call(userRegister, payload);
      
      if(response.status === 201){
        yield put({
          type: 'registerHandle',
          payload: response,
          errors: ''
        });
  
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem('refreshTokenDecoded', JSON.stringify(jwt_decode(response.data.refresh)));
        localStorage.setItem('accessTokenDecoded', JSON.stringify(jwt_decode(response.data.access)));
      }
    }
    catch(errRes){
      const errs = Object.keys(errRes.response.data).map((key) => {
        // return [key.concat(" : ").concat(errRes.response.data[key])];
        return [errRes.response.data[key]];
      });

      yield put({
        type: 'registerHandle',
        payload: errRes.response,
        errors: errs
      });
    }


    },
  },
  reducers: {
    registerHandle(state, { payload, errors }) {
      return { ...state, status: payload.status, error: errors};
    },
  },
};
export default Model;
