import { queryCurrent, queryStructure, queryProjects, resumeText } from './service';

const Model = {
  namespace: 'accountAndcenter',
  state: {
    currentUser: {},
    projectList: [],
    candidate_store: undefined,

    structure: {},
    fileuploading: false,
  },
  effects: {
    *fetchCurrent(payload, { call, put }) {
      const response = yield call(queryCurrent, payload.payload);
      

      if(response.status === 200){

        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
        
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
    },

    *uploadResumeKeywords(payload, { call, put }) {
      const response = yield call(resumeText, payload.payload);
    
      if(response.status === 200){
        // yield put({
        //   type: 'saveProjects',
        //   payload: response.data,
        // });
        console.log(response)
        // yield put({
        //   type: 'saveFileUploading',
        //   payload: false
        // });
      }
        // console.log(response)
    },

    *setfileuploading(val, { put }) {
    
        yield put({
          type: 'saveFileUploading',
          payload: val.payload
        });
        
    },

    // *uploadProfileData(payload, { call, put }) {
    //   const response = yield call(resumeText, payload.payload);
    
    //   if(response.status === 200){
    //     yield put({
    //       type: 'saveProjects',
    //       payload: response.data,
    //     });
    //   }
    // },

  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload.data || {}, candidate_store: action.payload.data.candidate || {} };
    },

    saveCandidateStore(state, action) {
      return { ...state, candidate_store: action.payload || {} };
    },

    saveStructure(state, action) {
      return { ...state, structure: action.payload.data || {}};
    },

    saveProjects(state, action) {
      return { ...state, projectList: action.payload.data || {}};
    },

    // saveResumeSkills(state, action) {
    //   return { ...state, currentUser: action.payload.data || {}};
    // },

    saveFileUploading(state, action) {
      return { ...state, fileuploading: action.payload || {}};
    },

  },
};
export default Model;
