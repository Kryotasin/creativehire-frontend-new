// First we need to import axios.js
// import { extend } from 'umi-request';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: REACT_APP_AXIOS_BASEURL
});

// Where you would set stuff like your 'Authorization' header, etc ...
if(localStorage.getItem('accessToken') !== null){
    // console.log(localStorage.getItem('accessToken'))
    instance.defaults.headers.common['Authorization'] = 'Bearer '.concat(localStorage.getItem('accessToken'));
}


// Also add/ configure interceptors && all the other cool stuff
instance.interceptors.request.use(request => {
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

    if(refreshToken !== null && refreshToken !== undefined){
        const refreshTokenCheck = jwt_decode(refreshToken);
    }

    if(refreshToken && refreshToken !== null && refreshToken !== undefined && !refreshToken.message){
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
                localStorage.removeItem('accessTokenDecoded');
                localStorage.setItem('accessToken', res.access);
                localStorage.setItem('accessTokenDecoded', JSON.stringify(jwt_decode(res.access)));
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