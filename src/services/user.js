import request from '@/utils/request';
import axios from '../umiRequestConfig';

export async function queryCurrent(params) {
  return axios.get(
    REACT_APP_AXIOS_API_V1.concat('entities/').concat('detail-view/').concat(params),
    {
      headers: {
        Authorization: 'Bearer '.concat(localStorage.getItem('accessToken')),
      },
    },
  );
}

export async function queryRecommendedJobs(user_id) {
  return axios.post(
    REACT_APP_AXIOS_API_V1.concat('recommended-job-provider/'),
    {
      user_id,
    },
    {
      headers: {
        Authorization: 'Bearer '.concat(localStorage.getItem('accessToken')),
      },
    },
  );
}

export async function queryRandomJobs(user_id) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat('random-job-provider/'), {
    user_id,
  });
}

export async function queryJobsUpdateAppliedOrSavedState(params) {
  if (params.applyOrSave === 'apply') {
    return axios.post(REACT_APP_AXIOS_API_V1.concat('applied-state-update/'), {
      jobmatch_id: params.jmID,
    });
  }

  if (params.applyOrSave === 'save') {
    return axios.post(REACT_APP_AXIOS_API_V1.concat('save-state-update/'), {
      jobmatch_id: params.jmID,
    });
  }
}

//                     UNUSED

export async function query() {
  return request('/api/users');
}

export async function queryNotices() {
  return request('/api/notices');
}
