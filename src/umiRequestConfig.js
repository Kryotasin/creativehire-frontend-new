// First we need to import axios.js
// import { extend } from 'umi-request';
import axios from 'axios';

// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: REACT_APP_AXIOS_BASEURL
});

// Where you would set stuff like your 'Authorization' header, etc ...
// if(Date.now() < JSON.parse(localStorage.getItem('accessTokenDecoded')).exp){
//     console.log("yues")
    
// }
// else{
//     console.log("noop")
// }
if(localStorage.getItem('accessToken') !== null){
    instance.defaults.headers.common['Authorization'] = 'Bearer '.concat(localStorage.getItem('accessToken'));
}



// Also add/ configure interceptors && all the other cool stuff


instance.interceptors.request.use(request => {
    // console.log(request);
    // Edit request config
    return request;
}, error => {
    // console.log(error);
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    // console.log(response);
    // Edit response config
    return response;
}, error => {
    // console.log(error);
    // return Promise.reject(error);
    const refreshToken = localStorage.getItem('refreshToken');
    
    if(refreshToken){
    return new Promise((resolve) => {
        const originalRequest = error.config;

        if(error.response && error.response.status === 401 && refreshToken !== null){
            // originalRequest._retry = true;

            const response = fetch(REACT_APP_AXIOS_BASEURL.concat('/').concat(REACT_APP_AXIOS_API_V1).concat('token/refresh/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh: refreshToken
                }),
            })
            .then((res) => res.json())
            .then((res) => {
                localStorage.removeItem('accessToken');
                localStorage.setItem('accessToken', res.access)
                console.log(localStorage.getItem('accessToken'))
            })
            .then((res) => {
                return axios(originalRequest)
            })
            resolve(response)
        }
        return Promise.reject(error)
    })
    }
        return Promise.reject(error);
    
});


export default instance;