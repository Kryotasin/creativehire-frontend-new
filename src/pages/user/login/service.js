import axios from '../../../umiRequestConfig';


export async function AccountLogin(params) {
  
  return axios.post('api/v1/token/', {
    username: params.email,
    password: params.password
  });

}
