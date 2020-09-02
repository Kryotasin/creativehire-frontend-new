import axios from '../../../umiRequestConfig';

export async function queryCurrent(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('entities/update-candidate-professional-details/').concat(btoa(params.userID)));
}