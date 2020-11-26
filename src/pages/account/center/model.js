import { queryCurrent, queryStructure, queryProjects, resumeText } from './service';

const Model = {
  namespace: 'accountAndcenter',
  state: {
    currentUser: {},

    entity_part: {},
    candidate_part: {},
    keywords_part: {},
    
    projectList: [],

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

    *fetchStructure(payload, { call, put }) {
      const struct = yield call(queryStructure);

        if(struct.status === 200){
          yield put({
            type: 'saveStructure',
            payload: struct,
          });
        }
    },

    *uploadResumeKeywords(payload, { call, put }) {
      const response = yield call(resumeText, payload.payload);
    
      if(response.status === 200){
        yield put({
          type: 'saveKeywordsPart',
          payload: response.data,
        });
      }
    },

    // *setfileuploading(val, { put }) {
    //     yield put({
    //       type: 'saveFileUploading',
    //       payload: val.payload
    //     });
    // },

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
      return { ...state, currentUser: action.payload.data || {}, entity_part: action.payload.data.entity || {}, candidate_part: action.payload.data.candidate || {}, keywords_part: action.payload.data.keywords || {}  };
    },

    saveEntityPart(state, action) {
      return { ...state, entity_part: action.payload || {} };
    },

    saveCandidatePart(state, action) {
      return { ...state, candidate_part: action.payload || {} };
    },

    saveKeywordsPart(state, action) {
      return { ...state, keywords_part: action.payload || {} };
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
