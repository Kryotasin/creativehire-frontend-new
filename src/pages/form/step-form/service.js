import axios from '../../../umiRequestConfig';

export async function basicProjectDetails(params) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat('project/basicdetails/'), {
    url: params.projectLink,
  });
}

export async function newProject(params) {
  console.log(params.projectAuthor)
  return axios.post(REACT_APP_AXIOS_API_V1.concat('project/'), {
    project_url: params.projectLink,
    project_title: params.projectName,
    project_summary: params.projectSummary,
    project_author: params.projectAuthor,
    project_img: params.projectImage,
  });
}

export async function submitProjectSkills(params) {
  return axios.put(REACT_APP_AXIOS_API_V1.concat(`project-keywords/${params.id}/`), {'project_keywords': params.skills});
}
