import { userRegister } from './service';

const Model = {
  namespace: 'userAndregister',
  state: {
    status: undefined,
  },
  effects: {
    *submit({ payload }, { call, put }) {
    try{
           
      const response = yield call(userRegister, payload);

      yield put({
        type: 'registerHandle',
        payload: response,
        errors: ''
      });
    }
    catch(errRes){
      // for (let [key, value] of Object.entries(err.response.data)) {
      //   console.log(`${key}: ${value}`);
      // }
      const errs = Object.keys(errRes.response.data).map(function(key) {
        return [key.concat(" : ").concat(errRes.response.data[key])];
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
