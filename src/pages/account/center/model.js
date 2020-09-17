import { queryCurrent, queryStructure, queryProjects } from './service';

const Model = {
  namespace: 'accountAndcenter',
  state: {
    currentUser: {},
    projectList: [],
    structure: {},
  },
  effects: {
    *fetchCurrent(payload, { call, put }) {
      const response = yield call(queryCurrent, payload.payload);
      
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      
      if(response.status === 200){
        const struct = yield call(queryStructure);

        if(struct.status === 200){
          yield put({
            type: 'saveStructure',
            payload: struct,
          });
        }
      }
    },

    *fetchProjects(payload, { call, put }) {
      const response = yield call(queryProjects, payload.payload);
    
      if(response.status === 200){
        yield put({
          type: 'saveProjects',
          payload: response,
        });
      }

    }

  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload.data || {} };
    },

    saveStructure(state, action) {
      return { ...state, structure: action.payload.data || {}};
    },

    saveProjects(state, action) {
      return { ...state, projectList: action.payload.data || {}};
    }

  },
};
export default Model;
