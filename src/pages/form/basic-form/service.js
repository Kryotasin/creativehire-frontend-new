import axios from '../../../umiRequestConfig';

export async function newJobpost(params, userID) {
  return axios.post('jobpost/', {
    org: params.org,
    link_jp: params.jobLink,
    title: params.jobTitle,
    description: params.jobDescription,
    job_poster_id: userID,
  });
}

export async function newProject(params,userID) {
  return axios.post('project/', {
    title: params.projectTitle,
    url: params.projectLink,
    project_owner_id: userID
  });
}

export async function newScan(params,userID) {
  return axios.post('scan-results/', {
    projectTitle: params.projectTitle,
    projectLink: params.projectLink,
    org: params.org,
    jobTitle: params.jobTitle,
    jobLink: params.jobLink,
    jobDescription: params.jobDescription,
    userID
  });
}
