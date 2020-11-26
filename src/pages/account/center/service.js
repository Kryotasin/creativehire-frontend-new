import axios from '../../../umiRequestConfig';

export async function queryCurrent(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('entities/candidate-complete-details/').concat(params.userID));
}


export async function queryStructure() {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('metrics-structure/'));
}

export async function queryProjects(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('entities/portfolio/').concat(btoa(params.userID)));
}

export async function resumeText(params) {
  return axios.put(REACT_APP_AXIOS_API_V1.concat(`entities/candidate-complete-details/${btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id)}`), params)
}