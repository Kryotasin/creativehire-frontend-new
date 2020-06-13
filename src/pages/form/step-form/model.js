import { basicProjectDetails, newProject, metricsStructure } from './service';

const Model = {
  namespace: 'formAndstepForm',
  state: {
    current: 'link',
    link: undefined,
    basics: [],
    project: undefined,
    structure: null,
    loading: false,
  },
  effects: {
    *submitStepForm({ payload }, { call, put }) {
      // yield call(fakeSubmitForm, payload);
      console.log(payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put({
        type: 'saveCurrentStep',
        payload: 'result',
      });
    },


    *fetchBasicDetails({ payload }, { call, put }) {

      yield put({
        type: 'saveStepLoadingState',
        payload: true,
      });


      const basicdetails = yield call (basicProjectDetails, payload);


      if(basicdetails.status === 200){
        // Save teh project link
        yield put({
          type: 'saveProjectLink',
          payload,
        });

        // Save basic project info
        yield put({
          type: 'saveBasicData',
          payload: basicdetails.data,
        });

        // Change loading to false
        yield put({
          type: 'saveStepLoadingState',
          payload: false,
        });

        // Go to step 2
        yield put({
          type: 'saveCurrentStep',
          payload: 'basic',
        });
      }
    },

    *submitNewProject({ payload }, { call, put }) {

      yield put({
        type: 'saveStepLoadingState',
        payload: true,
      });


      const newproj = yield call(newProject, payload);

      if(newproj.status === 201){
        yield put({
          type: 'saveProjectSkills',
          payload: newproj.data,
        });

        const metrics_structure = yield call(metricsStructure);

        if(metrics_structure.status === 200){
          yield put({
            type: 'saveMetricsStructure',
            payload: metrics_structure.data,
          });
        }        

        yield put({
          type: 'saveStepLoadingState',
          payload: false,
        });

        // Go to step 3
        yield put({
          type: 'saveCurrentStep',
          payload: 'skills',
        });
      }


      
    },


  },
  reducers: {

    saveProjectLink(state, { payload }) {
      return { ...state, link: payload };
    },

    saveBasicData(state, { payload }) {
      return { ...state, basics: { ...state.basics, ...payload } };
    },

    saveProjectSkills(state, { payload }) {
      return { ...state, project: { ...state.project, ...payload } };
    },

    saveMetricsStructure(state, { payload }) {
      return { ...state, structure: { payload } };
    },


    saveStepLoadingState(state, { payload }){
      return { ...state, loading: payload}
    },

    saveCurrentStep(state, { payload }) {
      return { ...state, current: payload };
    },

  },
};
export default Model;
