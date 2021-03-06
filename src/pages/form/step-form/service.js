import axios from '../../../umiRequestConfig';

export async function basicProjectDetails(params) {
  return axios.post('project/basicdetails/', {
    url: params.projectLink,
  });
}

export async function newProject(params) {
  return axios.post('project/', {
    url: params.projectLink,
    title: params.projectName,
    summary: params.projectSummary,
    author: atob(localStorage.getItem('userID')),
    img: params.projectImage
  });
}

export async function metricsStructure() {
  return axios.get('metrics-structure/')
}