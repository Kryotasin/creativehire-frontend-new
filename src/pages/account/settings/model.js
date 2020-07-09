import {queryCurrent } from './service';

const Model = {
  namespace: 'accountAndsettings',
  state: {
    currentUser: {},
    isLoading: false,
  },
  effects: {

    *fetchCurrent(payload, { call, put }) {
      const response = yield call(queryCurrent, payload.payload);
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

    changeNotifyCount(state = {}, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },

    changeLoading(state, action) {
      return { ...state, isLoading: action.payload };
    },
  },
};
export default Model;
