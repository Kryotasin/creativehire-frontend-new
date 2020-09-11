import axios from '../../../umiRequestConfig';


export async function AccountLogin(params) {
  
  return axios.post(REACT_APP_AXIOS_API_V1.concat('token/'), {
    username: params.email,
    password: params.password
  });

}
