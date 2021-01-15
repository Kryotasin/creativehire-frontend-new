import request from '@/utils/request';
import axios from '../umiRequestConfig';

export async function queryCurrent(params) {
  return axios.get(
    REACT_APP_AXIOS_API_V1.concat('entities/').concat('detail-view/').concat(params)
  );
}

export async function queryRecommendedJobs(user_id) {
  return axios.post(
    REACT_APP_AXIOS_API_V1.concat('recommended-job-provider/'),
    {
      user_id,
    }
  );
}

export async function queryRandomJobs(params) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat('random-job-provider/'), {
    user_id: params.userID,
  });
}

export async function queryJobsUpdateAppliedOrSavedOrVisitedState(params) {
  if (params.applyOrSaveOrVisited === 'apply') {
    return axios.post(REACT_APP_AXIOS_API_V1.concat('applied-state-update/'), {
      jobmatch_id: params.jmID,
    });
  }

  if (params.applyOrSaveOrVisited === 'save') {
    return axios.post(REACT_APP_AXIOS_API_V1.concat('save-state-update/'), {
      jobmatch_id: params.jmID,
    });
  }
  if (params.applyOrSaveOrVisited === 'visited') {
    return axios.post(REACT_APP_AXIOS_API_V1.concat('update-viewed-by-candidate/'), {
      jobmatch_id: params.jmID,
    });
  }
}

export async function querySavedJobs(params) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat('saved-job-provider/'), {
    user_id: params.userID,
    size: 'all',
  });
}


export async function queryAppliedJobs(params) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat('applied-job-provider/'), {
    user_id: params.userID,
    size: 'all',
  });
}

export async function querySearchJobs(params) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat('job-search/'), params);
}

export async function queryUpdateJobpostViewCount(params) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat('update-jobpost-count/'), params)
}

//                     UNUSED

export async function query() {
  return request('/api/users');
}

export async function queryNotices() {
  return request('/api/notices');
}
