import axios from '../../../umiRequestConfig';

export async function queryCurrent(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('entities/').concat(params.userID));
}