// First we need to import axios.js
// import { extend } from 'umi-request';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: REACT_APP_AXIOS_BASEURL
});

let isRefreshing = false;

let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        // console.log("here", prom)
    //   if (error) {
    //     prom.reject(error);
    //   } else {
    //     prom.resolve(token);
    //   }
    })
    
    failedQueue = [];
  }

// Where you would set stuff like your 'Authorization' header, etc ...
if(localStorage.getItem('accessToken') !== null && localStorage.getItem('accessToken') !== undefined && localStorage.getItem('accessToken') !== 'undefined'){
    // console.log(jwt_decode(localStorage.getItem('accessToken')).exp - new Date().getTime()/1000)
}


// Also add/ configure interceptors && all the other cool stuff
instance.interceptors.request.use(request => {
    // Edit request config
    // console.log(request);

    if(localStorage.getItem('accessToken') !== null && localStorage.getItem('accessToken') !== undefined && localStorage.getItem('accessToken') !== 'undefined'){
        // console.log(jwt_decode(localStorage.getItem('accessToken')).exp - new Date().getTime()/1000)
        const token = localStorage.getItem('accessToken');
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
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

            if(!isRefreshing){
                isRefreshing = true;
                localStorage.removeItem('accessToken');
                localStorage.removeItem('accessTokenDecoded');

                const refreshRequest = fetch(REACT_APP_AXIOS_BASEURL.concat('/').concat(REACT_APP_AXIOS_API_V1).concat('token/refresh/'), {
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
                    // console.log(res.access)
                    localStorage.setItem('accessToken', res.access);
                    localStorage.setItem('accessTokenDecoded', JSON.stringify(jwt_decode(res.access)));
                })
                .then(() => {
                    // console.log("one")
                    const token = localStorage.getItem('accessToken');
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    processQueue(null, token);

                    return axios(originalRequest);
                })
                .finally(() => {isRefreshing = false})
                // console.log("two")
                resolve(refreshRequest)
            }
            else{
                failedQueue.push(originalRequest)
                // console.log(failedQueue)
            }
        }
        return Promise.reject(error)
    })
    }
        return Promise.reject(error); 
});


export default instance;