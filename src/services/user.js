import request from '@/utils/request';
import axios from '../umiRequestConfig';

export async function queryCurrent(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('entities/').concat(params),{
    headers: {
      'Authorization': 'Bearer '.concat(localStorage.getItem('accessToken'))
    }
  });
}

export async function queryMinJobs(user_id) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat('job-provider/'),
  {
    user_id
  }
  ,{
    headers: {
      'Authorization': 'Bearer '.concat(localStorage.getItem('accessToken'))
    }
  });
}


export async function query() {
  return request('/api/users');
}

export async function queryNotices() {
  return request('/api/notices');
}
