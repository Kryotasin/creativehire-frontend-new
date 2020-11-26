import { queryCurrent, queryRecommendedJobs, querySavedJobs, queryRandomJobs } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    reccommended_jobs: undefined,
    saved_jobs: undefined,
    random_jobs: undefined,
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

    *fetchRecommendedJobs(_, { call, put }) {

      const response = yield call(queryRecommendedJobs, JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);

      yield put({
        type: 'saveRecommendedJobs',
        payload: response.data,
      });
    },

    *fetchSavedJobs(_, { call, put }) {

      const response = yield call(querySavedJobs, JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);

      yield put({
        type: 'saveSavedJobs',
        payload: response.data,
      });
    },

    *fetchRandomJobs(_, { call, put }) {

      const response = yield call(queryRandomJobs, JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);

      yield put({
        type: 'saveRandomJobs',
        payload: response.data,
      });
    },


  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    saveRecommendedJobs(state, action) {
      return { ...state, reccommended_jobs: action.payload || {} };
    },

    saveSavedJobs(state, action) {
      return { ...state, saved_jobs: action.payload || {} };
    },

    saveRandomJobs(state, action) {
      return { ...state, random_jobs: action.payload || {} };
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