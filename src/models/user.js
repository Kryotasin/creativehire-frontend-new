import { queryCurrent, queryRecommendedJobs, querySavedJobs, queryRandomJobs, queryJobsUpdateAppliedOrSavedState } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    reccommended_jobs: undefined,
    saved_jobs: undefined,
    random_jobs: undefined
  },
  effects: {
    *fetchCurrent(_, { call, put, delay }) {

      let maxTries = 5;
      const delayDuration = 1000;

      while(true){
        try{
          const response = yield call(queryCurrent, JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);
  
          yield put({
            type: 'saveCurrentUser',
            payload: response.data,
          });
          break;
        }
        catch(err){
          console.log(err, maxTries);
          maxTries -= 1;
          delay(delayDuration);
          if(maxTries === 0){
            throw err;
          }
        }
      }

      
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

    *updateJobMatch(payload, { call, select, put }) {      

      const response = yield call(queryJobsUpdateAppliedOrSavedState, payload.payload);

      if(response.status === 200){
        if(payload.payload.joblistType === 'All'){
          const updatedRandomJobs = yield select(state =>
            {
              const updateObjIndex = state.user.random_jobs.findIndex(item => item.jm_data.id === payload.payload.jmID);
              const temp = Object.assign({}, state.user.random_jobs);
              temp[updateObjIndex] = response.data;
              const tempAsArray = Object.keys(temp).map((key) => temp[key]);
              return tempAsArray;
            }
          );
  
          yield put({
            type: 'saveNewState',
            payload: {'random_jobs': updatedRandomJobs},
          });
        }

        if(payload.payload.joblistType === 'Recommended'){
          const updatedRecommendedJobs = yield select(state =>
            {
              const updateObjIndex = state.user.reccommended_jobs.findIndex(item => item.jm_data.id === payload.payload.jmID);
              const temp = Object.assign({}, state.user.reccommended_jobs);
              temp[updateObjIndex] = response.data;
              const tempAsArray = Object.keys(temp).map((key) => temp[key]);
              return tempAsArray;
            }
          );
  
          yield put({
            type: 'saveNewState',
            payload: {'reccommended_jobs': updatedRecommendedJobs},
          });
        }
      }
      
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

    saveNewState(state, action){
      return { ...Object.assign(state, action.payload) }
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