import request from '@/utils/request';
import axios from '../umiRequestConfig';

export async function queryCurrent(params) {
  return axios.get('/userprofile/'.concat(params));
}


export async function query() {
  return request('/api/users');
}

export async function queryNotices() {
  return request('/api/notices');
}
