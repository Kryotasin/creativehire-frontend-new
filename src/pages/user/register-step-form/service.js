import axios from '../../../umiRequestConfig';

export async function registerUserAndGetLinksService(params) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat('register/'),{
    first_name: params.firstName,
    last_name: params.lastName,
    password1: params.password,
    password2: params.confirm,
    email: params.email,
    type: params.type,
})
}

export async function urlFetcher(params) {
  return axios.post(REACT_APP_AXIOS_API_V1.concat('url-fetcher/'),{
    url: params
})
}