import axios from '../../../umiRequestConfig';

export async function basicProjectDetails(params) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat('project/basicdetails/'), {
    url: params.projectLink,
    img_only: 0,
  });
}

export async function newProject(params) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat('project-post/'), {
    project_url: params.projectLink,
    project_title: params.projectName,
    project_summary: params.projectSummary,
    project_author: params.projectAuthor,
    project_img: params.projectImage,
  });
}

export async function submitProjectSkills(params) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat('project-keywords/'), {
    id: params.id,
    project_keywords: params.skills,
  });
}
