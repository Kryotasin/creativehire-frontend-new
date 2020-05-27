import axios from '../../../umiRequestConfig';


export async function AccountLogin(params) {
  
  return axios.post('api/v1/rest-auth/login/', {
    username: params.userName,
    password: params.password
  })

}
