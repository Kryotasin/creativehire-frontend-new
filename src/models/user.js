import {
  queryCurrent,
  queryRecommendedJobs,
  queryRandomJobs,
  queryJobsUpdateAppliedOrSavedState,
  querySavedJobs,
  queryAppliedJobs,
  querySearchJobs
} from '@/services/user';

import { message } from 'antd';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    reccommended_jobs: undefined,
    saved_jobs: undefined,
    random_jobs: undefined,
    applied_jobs: undefined,
    search_all: undefined,
    searching: false,
  },
  effects: {
    // *fetchCurrent(_, { call, put, delay }) {
    //   let maxTries = 5;
    //   const delayDuration = 1000;
      
    //   while (true) {
    //     try {
    //       const response = yield call(
    //         queryCurrent,
    //         JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id,
    //       );

    //       yield put({
    //         type: 'saveCurrentUser',
    //         payload: response.data,
    //       });
    //       break;
    //     } catch (err) {
    //       console.log(err, maxTries);
    //       maxTries -= 1;
    //       delay(delayDuration);
    //       if (maxTries === 0) {
    //         throw err;
    //       }
    //     }
    //   }
    // },

    *fetchRecommendedJobs(_, { call, put }) {
      const response = yield call(
        queryRecommendedJobs,
        JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id,
      );

      yield put({
        type: 'saveRecommendedJobs',
        payload: response.data,
      });
    },

    // *fetchSavedJobs(_, { call, put }) {

    //   const response = yield call(querySavedJobs, JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);

    //   yield put({
    //     type: 'saveSavedJobs',
    //     payload: response.data,
    //   });
    // },

    *fetchSearchJobs(payload, { call, put }) {

      yield put({
        type: 'saveSearching',
        payload: true,
      });

      const hide = message.loading('Loading results..', 0); 

      const response = yield call(querySearchJobs, payload.payload);
      
      if(response.status === 200){
        yield put({
          type: 'saveSearchAllJobs',
          payload: response.data,
        });
      }

      setTimeout(hide, 1500);

      yield put({
        type: 'saveSearching',
        payload: false,
      });
    },

    *fetchRandomJobs(payload, { call, put }) {
      const response = yield call(
        queryRandomJobs,
        payload.payload
      );

      yield put({
        type: 'saveRandomJobs',
        payload: response.data,
      });
    },

    *fetchSavedJobs(payload, { call, put }) {
      const response = yield call(querySavedJobs, payload.payload);

      if (response.status === 200) {
        yield put({
          type: 'saveSavedJobs',
          payload: response.data,
        });
      }
    },

    *fetchAppliedJobs(payload, { call, put }) {
      const response = yield call(queryAppliedJobs, payload.payload);

      if (response.status === 200) {
        // if(response.data==='No jobs found'){
        //   yield put({
        //     type: 'saveTitleTypes',
        //     payload: []
        //   })
        //   console.log(res)
        // }
        yield put({
          type: 'saveAppliedJobs',
          payload: response.data,
        });
      }
    },

    *updateJobMatch(payload, { call, select, put }) {
      const response = yield call(queryJobsUpdateAppliedOrSavedState, payload.payload);

      if (response.status === 200) {
        if (payload.payload.joblistType === 'All') {
          const updatedRandomJobs = yield select((state) => {
            const updateObjIndex = state.user.random_jobs.findIndex(
              (item) => item.jm_data.id === payload.payload.jmID,
            );
            const temp = Object.assign({}, state.user.random_jobs);
            temp[updateObjIndex] = response.data;
            const tempAsArray = Object.keys(temp).map((key) => temp[key]);
            return tempAsArray;
          });

          yield put({
            type: 'saveNewState',
            payload: { random_jobs: updatedRandomJobs },
          });
        }

        if (payload.payload.joblistType === 'Recommended') {
          const updatedRecommendedJobs = yield select((state) => {
            const updateObjIndex = state.user.reccommended_jobs.findIndex(
              (item) => item.jm_data.id === payload.payload.jmID,
            );
            const temp = Object.assign({}, state.user.reccommended_jobs);
            temp[updateObjIndex] = response.data;
            const tempAsArray = Object.keys(temp).map((key) => temp[key]);
            return tempAsArray;
          });

          yield put({
            type: 'saveNewState',
            payload: { reccommended_jobs: updatedRecommendedJobs },
          });
        }

        if (payload.payload.joblistType === 'Saved') {
          const updateSavedJobs = yield select((state) => {
            const updateObjIndex = state.user.saved_jobs.findIndex(
              (item) => item.jm_data.id === payload.payload.jmID,
            );
            const temp = Object.assign({}, state.user.saved_jobs);
            temp[updateObjIndex] = response.data;
            const tempAsArray = Object.keys(temp).map((key) => temp[key]);
            tempAsArray.splice(updateObjIndex, 1);
            return tempAsArray;
          });

          yield put({
            type: 'saveNewState',
            payload: { saved_jobs: updateSavedJobs },
          });
        }

        if (payload.payload.joblistType === 'Applied') {
          const updateAppliedJobs = yield select((state) => {
            const updateObjIndex = state.user.applied_jobs.findIndex(
              (item) => item.jm_data.id === payload.payload.jmID,
            );
            const temp = Object.assign({}, state.user.applied_jobs);
            temp[updateObjIndex] = response.data;
            const tempAsArray = Object.keys(temp).map((key) => temp[key]);
            // tempAsArray.splice(updateObjIndex, 1);
            return tempAsArray;
          });

          yield put({
            type: 'saveNewState',
            payload: { applied_jobs: updateAppliedJobs },
          });
        }

        if (payload.payload.joblistType === 'Search all') {

          const updateSearchAllJobs = yield select((state) => {
            const updateObjIndex = state.user.search_all.findIndex(
              (item) => item.jm_data.id === payload.payload.jmID,
            );
            const temp = Object.assign({}, state.user.search_all);
            temp[updateObjIndex] = response.data;
            const tempAsArray = Object.keys(temp).map((key) => temp[key]);
            if(payload.payload.savedQuery){
              tempAsArray.splice(updateObjIndex, 1);
            }
            return tempAsArray;
          });

          yield put({
            type: 'saveNewState',
            payload: { search_all: updateSearchAllJobs },
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

    saveNewState(state, action) {
      return { ...Object.assign(state, action.payload) };
    },
    
    saveAppliedJobs(state, action) {
      return { ...state, applied_jobs: action.payload || {} };
    },

    saveSearchAllJobs(state, action) {
      return { ...state, search_all: action.payload || {} };
    },

    saveSearching(state, action) {
      return { ...state, searching: action.payload };
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
