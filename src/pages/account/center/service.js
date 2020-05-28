import axios from '../../../umiRequestConfig';

export async function queryCurrent(params) {
  return axios.get('/userprofile/'.concat(params.userID));
}