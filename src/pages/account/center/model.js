import { queryCurrent } from './service';

const Model = {
  namespace: 'accountAndcenter',
  state: {
    currentUser: {},
    list: [],
  },
  effects: {
    *fetchCurrent(payload, { call, put }) {
      const response = yield call(queryCurrent, payload.payload);
      // console.log(response)
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload.data || {} };
    },

  },
};
export default Model;
