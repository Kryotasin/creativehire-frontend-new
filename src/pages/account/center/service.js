import axios from '../../../umiRequestConfig';

export async function queryCurrent(params) {
  return axios.get(
    REACT_APP_AXIOS_API_V1.concat('entities/candidate-complete-details/').concat(params.userID)
  );
}

export async function queryStructure() {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('metrics-structure/'));
}

export async function queryProjects(params) {
  return axios.get(
    REACT_APP_AXIOS_API_V1.concat('entities/portfolio/').concat(btoa(params.userID)),
  );
}

export async function resumeText(params) {
  return axios.post(
    REACT_APP_AXIOS_API_V1.concat(
      `entities/candidate-complete-details/${params.userID}`,
    ),
    params,
  );
}

export async function savedJobs(params) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat(''));
}

export async function queryTitleTypes(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('entities/fetch-title-types/'));
}

export async function queryEmploymentTypes(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('fetch-jobpost-types/'));
}

export async function queryDegreeTypes(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('entities/fetch-degree-types/'));
}

export async function queryWorkAuth(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('entities/fetch-work-auth-types/'));
}

export async function queryCompanies(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('organizations/fetch-companies/'));
}

export async function queryEmailVerificationStatus(params) {
  return axios.get(REACT_APP_AXIOS_API_V1.concat('entities/email-verified/'.concat(params.userID)));
}

export async function queryUserSettings(params) {
  
  if(params.type === 'fetch'){
    return axios.get(REACT_APP_AXIOS_API_V1.concat('entities/').concat('update-settings/').concat(params.id));
  }

  if(params.type === 'update'){
    delete params.type;
    return axios.post(REACT_APP_AXIOS_API_V1.concat('entities/').concat('update-settings/').concat(params.id), params);
  }

}

export async function queryWorkAuthUpdate(params) {
  return axios.post(
    REACT_APP_AXIOS_API_V1.concat('entities/').concat('candidate-partials/workauth/'),
    params,
  );
}

export async function queryRemoteUpdate(params) {
  return axios.post(
    REACT_APP_AXIOS_API_V1.concat('entities/').concat('candidate-partials/remote/'),
    params,
  );
}

export async function queryWorkExpEducationUpdate(params){
  return axios.post(REACT_APP_AXIOS_API_V1.concat(`entities/candidate-complete-details/${params.userID}`),
    params
  );
}
