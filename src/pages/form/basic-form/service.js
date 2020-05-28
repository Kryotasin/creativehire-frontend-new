import axios from '../../../umiRequestConfig';

export async function newProject(params, userID) {
  return axios.post('jobpost/', {
    org: params.org,
    link_jp: params.jobLink,
    title: params.jobTitle,
    description: params.jobDescription,
    job_poster_id: userID,
  });
}

export async function newJobpost(params,userID) {
  return axios.post('project/', {
    title: params.projectTitle,
    url: params.projectLink,
    project_owner_id: userID
  });
}

export async function newScan(params,userID, projectID, jobpostID) {
  return axios.post('/api/forms', {
    projectid: projectID,
    userid: userID,
    jobid: jobpostID,
    org: params.org,
    jobtitle: params.jobtitle,
    project_title: params.projtitle
  });
}
