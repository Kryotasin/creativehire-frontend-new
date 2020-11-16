import axios from '../../../umiRequestConfig';

export async function newJobpost(params, userID) {
  return axios.post('jobpost/', {
    org: params.org,
    link_jp: params.jobLink,
    title: params.jobTitle,
    description: params.jobDescription,
    entity: userID,
  });
}

export async function newProject(params,userID) {
  return axios.post('project/', {
    title: params.projectTitle,
    url: params.projectLink,
    author: userID
  });   
}

export async function newScan(params,userID) {
  return axios.post('scan-results/', {
    projectidList: params.projectidList,
    org: params.org,
    jobTitle: params.jobTitle,
    jobLink: params.jobLink,
    jobDescription: params.jobDescription,
    userID
  });
}
