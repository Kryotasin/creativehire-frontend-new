import axios from '../../../umiRequestConfig';

export async function userRegister(params) {
  return axios.post('api/v1/register/',{
    first_name: params.firstName,
    last_name: params.lastName,
    password1: params.password,
    password2: params.confirm,
    email: params.email,
    type: params.type,
})
}
