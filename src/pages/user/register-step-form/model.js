import jwt_decode from 'jwt-decode';

import { registerUserAndGetLinksService, urlFetcher } from './service';
import { message } from 'antd';
import asyncLocalStorage from '../../../asyncLocalStorage';

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
        payload: true,
      });      
      
      const msgKey = 'registration';

      try {
        localStorage.clear();        
        message.loading({ content: 'Registration in progress...', msgKey });
        
        const response = yield call(registerUserAndGetLinksService, payload);
        
        
        if (response.status === 201) {
          message.loading({content: 'Registered! Fetching your projects...', msgKey});

          // localStorage.setItem("refreshToken", String(response.data.refresh));
          // localStorage.setItem("accessToken", String(response.data.access));
          // localStorage.setItem('refreshTokenDecoded', JSON.stringify(jwt_decode(response.data.refresh)));
          // localStorage.setItem('accessTokenDecoded', JSON.stringify(jwt_decode(response.data.access)));
          const setAccessToken = asyncLocalStorage.setItem('accessToken', response.data.access);
          const setRefreshToken = asyncLocalStorage.setItem('refreshToken', response.data.refresh);

          Promise.all([setAccessToken, setRefreshToken])
          .then(function () {
            return asyncLocalStorage.getItem('accessToken');
          })          
          .then(function () {
            return asyncLocalStorage.getItem('refreshToken');
          });        
          
          yield put({
            type: 'registerHandle',
            payload: response,
            errors: '',
          });

          // Get all project links           
          yield put({
            type: 'savePortfolioLink',
            payload: payload.portfolio,
          });

          const project_links_list = yield call(urlFetcher, payload.portfolio);

          if(project_links_list.status === 200){
              yield put({
                type: 'saveProjectLinksList',
                payload: project_links_list.data,
              });

              yield put({
                type: 'saveCurrentStep',
                payload: 'urls',
              });

              message.success({ content: 'Done! Select your projects.', msgKey, duration: 2 });
          }          
          else {
            message.warning({ content: 'FaNo project link...', msgKey, duration: 2 });

            yield put({
              type: 'saveCurrentStep',
              payload: 'success',
            });
          }
        
        }
        else{
          message.error({ content: 'Failed...', msgKey, duration: 2 });
        }
      } 
  
    catch (errRes) {
      message.error({ content: 'Failed...', msgKey, duration: 2 });
      
      const errs = Object.keys(errRes.response.data).map((key) => {
        // return [key.concat(" : ").concat(errRes.response.data[key])];
        return [errRes.response.data[key]];
      });
      
      
      yield put({
        type: 'registerHandle',
        payload: errRes.response,
        errors: errs,
      });
      }

      yield put({
        type: 'saveLoadingStatus',
        payload: false,
      });
    },

    *setCompletion({ payload }, { put }) {
      yield put({
        type: 'saveCompeltionStatus',
        payload,
      });
    },
  },
  reducers: {
    registerHandle(state, { payload, errors }) {
      return { ...state, status: payload.status, errorMessages: errors };
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
