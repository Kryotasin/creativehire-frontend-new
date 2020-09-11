import axios from '../../../umiRequestConfig';

export async function queryCurrent(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('entities/candidate-professional-details/').concat(btoa(params.userID)));
}

export async function getSkills(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('entities/candidate-professional-details/').concat(btoa(params.userID)));
}

export async function updateSkills(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('entities/candidate-professional-details/').concat(btoa(params.userID)));
}
//westelm