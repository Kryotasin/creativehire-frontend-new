import axios from '../../../umiRequestConfig';


export async function AccountLogin(params) {
  
  return axios.post('api/v1/login/', {
    email: params.email,
    password: params.password
  });

}
