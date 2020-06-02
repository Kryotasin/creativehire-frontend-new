import { getMyScans } from './service';

const Model = {
  namespace: 'listAndcardList',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getMyScans, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
  },
  reducers: {
    queryList(state, action) {
      return { ...state, list: action.payload };
    },
  },
};
export default Model;
