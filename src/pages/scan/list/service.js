import axios from '../../../umiRequestConfig';

export async function getMyScans(params) {
  return axios.post('my-scans/', {
    uid: params.userID
  });
}
