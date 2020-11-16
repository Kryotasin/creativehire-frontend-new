import jwt_decode from 'jwt-decode';

import { registerUserAndGetLinksService, urlFetcher } from './service';

const Model = {
  namespace: 'userAndregister',
  state: {
    loading: false,
    current: 'link',
    errorMessages: undefined,
    status: undefined,
    portfolio: undefined,
    project_links_list: [],
    completionStatus: undefined,

  },
  effects: {
    *registerUserAndGetLinks({ payload }, { call, put }) {

      yield put({
        type: 'saveLoadingStatus',
        payload: true
      });

    try{ 
      localStorage.clear();
      const response = yield call(registerUserAndGetLinksService, payload);
      
      if(response.status === 201){
  
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem('refreshTokenDecoded', JSON.stringify(jwt_decode(response.data.refresh)));
        localStorage.setItem('accessTokenDecoded', JSON.stringify(jwt_decode(response.data.access)));

        yield put({
          type: 'registerHandle',
          payload: response,
          errors: ''
        });

        

        if(payload.portfolio){

          yield put({
            type: 'savePortfolioLink',
            payload: payload.portfolio
          });

          const project_links_list = yield call(urlFetcher, payload.portfolio);

          yield put({
            type: 'saveProjectLinksList',
            payload: project_links_list.data
          });

          yield put({
            type: 'saveCurrentStep',
            payload: 'urls'
          });

        }
        else{
          yield put({
            type: 'savePortfolioLink',
            payload: payload.portfolio
          });
          yield put({
            type: 'saveCurrentStep',
            payload: 'success'
          });
        }

      }
    }
    catch(errRes){
      
      const errs = Object.keys(errRes.response.data).map((key) => {
        // return [key.concat(" : ").concat(errRes.response.data[key])];
        return [errRes.response.data[key]];
      });
      

      yield put({
        type: 'registerHandle',
        payload: errRes.response,
        errors: errs
      });
    }


    yield put({
      type: 'saveLoadingStatus',
      payload: false
    });
    },


    *setCompletion({ payload }, { put }) {
      yield put({
        type: 'saveCompeltionStatus',
        payload
      });
    }

  },
  reducers: {
    registerHandle(state, { payload, errors }) {
      return { ...state, status: payload.status, errorMessages: errors};
    },

    saveCurrentStep(state, { payload }) {
      return { ...state, current: payload };
    },

    savePortfolioLink(state, { payload }) {
      return { ...state, portfolio: payload };
    },

    saveProjectLinksList(state, { payload }) {
      return { ...state, project_links_list: payload };
    },

    saveLoadingStatus(state, { payload }) {
      return { ...state, loading: payload };
    },

    saveCompeltionStatus(state, { payload }) {
      return { ...state, completionStatus: payload };
    },
  },
};
export default Model;
