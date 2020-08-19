import axios from '../../../umiRequestConfig';

export async function queryCurrent(params) {
  return axios.get('/entities/'.concat(params.userID));
}