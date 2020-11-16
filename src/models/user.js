import { queryCurrent, queryMinJobs } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    reccommended_jobs: undefined,
    all_jobs: undefined
  },
  effects: {

    *fetchCurrent(_, { call, put }) {

      const response = yield call(queryCurrent, JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);

      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },

    *fetchMinJobs(_, { call, put }) {

      const response = yield call(queryMinJobs, JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);

      yield put({
        type: 'saveMinJobs',
        payload: response.data,
      });
    },


  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    saveMinJobs(state, action) {
      return { ...state, reccommended_jobs: action.payload || {}, all_jobs: action.payload.all_jobs || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;