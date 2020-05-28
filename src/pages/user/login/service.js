import axios from '../../../umiRequestConfig';


export async function AccountLogin(params) {
  
  return axios.post('authenticate/', {
    username: params.userName,
    password: params.password
  });

}
