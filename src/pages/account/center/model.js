import {
  queryCurrent,
  queryStructure,
  queryProjects,
  resumeText,
  queryTitleTypes,
  queryEmploymentTypes,
  queryDegreeTypes,
  queryWorkAuth,
  queryCompanies,
  queryEmailVerificationStatus,
  queryWorkAuthUpdate,
  queryRemoteUpdate,
  queryWorkExpEducationUpdate,
  queryUserSettings,
} from './service';
import { message } from 'antd';

const Model = {
  namespace: 'accountAndcenter',
  state: {
    currentUser: {},

    entity_part: {},
    candidate_part: {},
    keywords_part: {},

    settings_part: {},

    projectList: [],

    structure: {},
    fileuploading: false,

    userID: undefined,

    titleTypes: [],
    employmentTypes: [],
    degreeTypes: [],
    workAuthTypes: [],

    companies: [],

    emailVerificationStatus: undefined,

    saving: false, // used for wok authorization and remote work udpates
  },

  effects: {
    *fetchCurrent(payload, { call, put }) {
      const response = yield call(queryCurrent, payload.payload);

      if (response.status === 200) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });

        const struct = yield call(queryStructure);

        if (struct.status === 200) {
          yield put({
            type: 'saveStructure',
            payload: struct,
          });
        }
      }
    },

    *fetchProjects(payload, { call, put }) {
      const response = yield call(queryProjects, payload.payload);
      if (response.status === 200) {
        yield put({
          type: 'saveProjects',
          payload: response,
        });
      }
    },

    *fetchStructure(_, { call, put }) {
      const struct = yield call(queryStructure);

      if (struct.status === 200) {
        yield put({
          type: 'saveStructure',
          payload: struct,
        });
      }
    },

    *uploadResumeKeywords(payload, { call, put }) {
      const response = yield call(resumeText, payload.payload);

      if (response.status === 200) {
        yield put({
          type: 'saveKeywordsPart',
          payload: response.data,
        });
      }
    },

    *fetchTitleTypes(payload, { call, put }) {
      const response = yield call(queryTitleTypes);

      if (response.status === 200) {
        yield put({
          type: 'saveTitleTypes',
          payload: response.data,
        });
      }
    },

    *fetchEmploymentTypes(payload, { call, put }) {
      const response = yield call(queryEmploymentTypes);

      if (response.status === 200) {
        yield put({
          type: 'saveEmploymentTypes',
          payload: response.data,
        });
      }
    },

    *fetchDegreeTypes(payload, { call, put }) {
      const response = yield call(queryDegreeTypes);

      if (response.status === 200) {
        yield put({
          type: 'saveDegreeTypes',
          payload: response.data,
        });
      }
    },

    *fetchWorkAuthTypes(payload, { call, put }) {
      const response = yield call(queryWorkAuth);
      if (response.status === 200) {
        const workAuthTypesData = Object.assign({}, response.data);

        yield put({
          type: 'saveNewState',
          payload: { workAuthTypes: workAuthTypesData },
        });
      }
    },

    *fetchCompanies(payload, { call, put }) {
      const response = yield call(queryCompanies);

      if (response.status === 200) {
        yield put({
          type: 'saveCompanies',
          payload: response.data,
        });
      }
    },

    *fetchEmailVerificationStatus(payload, { call, put }) {
      const response = yield call(queryEmailVerificationStatus, payload.payload);

      if (response.status === 200) {
        yield put({
          type: 'saveEmailVerificationStatus',
          payload: response.data,
        });
      }
    },

    *fetchUserSettings(payload, { call, put }) {
      const response = yield call(queryUserSettings, payload.payload);

      if(response.status === 200){
        yield put({
          type: 'saveNewState',
          payload: { settings_part: response.data}
        })
      }
    },

    *updateObjects(payload, { call, put }) {
      switch (payload.payload.type) {
        case 'work_auth':
          const workAuthResponse = yield call(queryWorkAuthUpdate, payload.payload);

          if (workAuthResponse.status === 200) {
            yield put({
              type: 'saveSaving',
              payload: true,
            }); // set saving to true to enable spin

            const updatedCandidatePart = Object.assign({}, workAuthResponse.data);

            yield put({
              type: 'saveNewState',
              payload: { candidate_part: updatedCandidatePart },
            });

            yield put({
              type: 'saveSaving',
              payload: false,
            }); // set saving to false to disable spin

            message.success('Updated Work Authorization');
          }

          break;

        case 'remote':
          const remoteResponse = yield call(queryRemoteUpdate, payload.payload);

          if (remoteResponse.status === 200) {
            yield put({
              type: 'saveSaving',
              payload: true,
            }); // set saving to true to enable spin

            const updatedCandidatePart = Object.assign({}, remoteResponse.data);

            yield put({
              type: 'saveNewState',
              payload: { candidate_part: updatedCandidatePart },
            });

            yield put({
              type: 'saveSaving',
              payload: false,
            }); // set saving to false to disable spin

            message.success('Updated Remote work choice');
          }

          break;

        // case 'work_exp':
        //   const workExpResponse = yield call(queryWorkExpEducationUpdate, payload.payload);

        //   if (workExpResponse.status === 200) {
        //     yield put({
        //       type: 'saveSaving',
        //       payload: true,
        //     }); // set saving to true to enable spin

        //     console.log(workExpResponse.data)

        //     const updatedCandidatePart = Object.assign({}, workExpResponse.data);

        //     yield put({
        //       type: 'saveNewState',
        //       payload: { candidate_part: updatedCandidatePart },
        //     });

        //     yield put({
        //       type: 'saveSaving',
        //       payload: false,
        //     }); // set saving to false to disable spin

        //     yield put({
        //       type: 'setWorkExpSaved',
        //       payload: 'done'
        //     });

        //     yield put({
        //       type: 'setWorkExpSaved',
        //       payload: undefined
        //     });

        //     message.success('Updated Work Experience');
        //   }

        //   break;
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
      return {
        ...state,
        currentUser: action.payload.data || {},
        entity_part: action.payload.data.entity || {},
        candidate_part: action.payload.data.candidate || {},
        keywords_part: action.payload.data.keywords || {},
      };
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
      return { ...state, structure: action.payload.data || {} };
    },

    saveProjects(state, action) {
      return { ...state, projectList: action.payload.data || {} };
    },

    // saveResumeSkills(state, action) {
    //   return { ...state, currentUser: action.payload.data || {}};
    // },

    saveFileUploading(state, action) {
      return { ...state, fileuploading: action.payload || {} };
    },

    // saveSavedJobs(state, action) {
    //   return { ...state, savedJobs: action.payload || {} };
    // },

    saveTitleTypes(state, action) {
      return { ...state, titleTypes: action.payload || {} };
    },

    saveEmploymentTypes(state, action) {
      return { ...state, employmentTypes: action.payload || {} };
    },

    saveDegreeTypes(state, action) {
      return { ...state, degreeTypes: action.payload || {} };
    },

    // saveWorkAuthTypes(state, action) {
    //   return { ...state, workAuthTypes: action.payload || {} };
    // },

    // setUserID(state, action) {
    //   return { ...state, workAuthTypes: action.payload || {} };
    // },

    saveCompanies(state, action) {
      return { ...state, companies: action.payload || {} };
    },

    saveEmailVerificationStatus(state, action) {
      return { ...state, emailVerificationStatus: action.payload };
    },

    saveNewState(state, action) {
      return { ...Object.assign(state, action.payload) };
    },

    saveSaveing(state, action) {
      return { ...state, saving: action.payload };
    },

    resetState(state, action) {
      return { undefined };
    },

  },
};
export default Model;
