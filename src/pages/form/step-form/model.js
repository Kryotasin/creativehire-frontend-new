import { fakeSubmitForm } from './service';

const Model = {
  namespace: 'formAndstepForm',
  state: {
    current: 'project',
    step: {
      projectName: 'ant-design@alipay.com',
      projectLink: 'test@example.com',
      jobTitle: 'Alex',
      org: '500',
    },
  },
  effects: {
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
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
  },
  reducers: {
    saveCurrentStep(state, { payload }) {
      return { ...state, current: payload };
    },

    saveStepFormData(state, { payload }) {
      return { ...state, step: { ...state.step, ...payload } };
    },
  },
};
export default Model;
