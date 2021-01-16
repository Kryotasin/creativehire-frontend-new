// First we need to import axios.js
// import { extend } from 'umi-request';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import asyncLocalStorage from './asyncLocalStorage';

// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: REACT_APP_AXIOS_BASEURL,
    // headers: {'Authorization': `Bearer ${localStorage.getItem('accessToken')}`}
});

let isRefreshing = false;

let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    })
    
    failedQueue = [];
  }

  
// Where you would set stuff like your 'Authorization' header, etc ...
if(localStorage.getItem('accessToken') !== null && localStorage.getItem('accessToken') !== undefined && localStorage.getItem('accessToken') !== 'undefined'){
    // console.log(jwt_decode(localStorage.getItem('accessToken')).exp - new Date().getTime()/1000)
}

if(localStorage.getItem('refreshToken') !== null && localStorage.getItem('refreshToken') !== undefined && localStorage.getItem('refreshToken') !== 'undefined'){
    // console.log(jwt_decode(localStorage.getItem('refreshToken')).exp - new Date().getTime()/1000)
}


// Also add/ configure interceptors && all the other cool stuff
instance.interceptors.request.use(request => {
    // Edit request config

    asyncLocalStorage.getItem('accessToken')
    .then((token) => {
        if(token !== null || token !== undefined){
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    });

    // if(){
        
    //     instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    // }

// console.log(request)
    return request;
}, error => {
    // console.log(error);
    return Promise.reject(error);
});



instance.interceptors.response.use(response => {
    // console.log('response',response);
    
    // Edit response config
    return response;
}, (error) => {
    // console.log('error', error);
    // Object.keys(error).forEach((k)=> console.log(k, error[k]))
    // return Promise.reject(error);

    const refreshToken = localStorage.getItem('refreshToken');
    const originalRequest = error.config;

    if(refreshToken !== null && refreshToken !== undefined){
        const refreshTokenCheck = jwt_decode(refreshToken);        
        if(Math.floor(new Date() / 1000) - refreshTokenCheck.exp > 0) {
            console.log('Expired refresh token...');
        }
    }

    if(error.response && error.response.status === 401 && !originalRequest._retry && refreshToken && refreshToken !== null && refreshToken !== undefined && !refreshToken.message){
    
        if(isRefreshing){
            return new Promise(function(resolve, reject) {
                failedQueue.push({resolve, reject})
              }).then(token => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return instance(originalRequest);
              }).catch(err => {
                return Promise.reject(err);
              });
        }

        originalRequest._retry = true;

        isRefreshing = true;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessTokenDecoded');

        return new Promise(function (resolve, reject) {
            fetch(REACT_APP_AXIOS_BASEURL.concat('/').concat(REACT_APP_AXIOS_API_V1).concat('token/refresh/'), {
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
                localStorage.setItem('accessToken', String(res.access));
                localStorage.setItem('accessTokenDecoded', JSON.stringify(jwt_decode(res.access)));
            })
            .then(() => {
                // console.log("one")
                const token = localStorage.getItem('accessToken');
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                processQueue(null, token);
                resolve(instance(originalRequest));    
            })            
            .catch((err) => {
                processQueue(err, null);
                reject(err);
            })
            .finally(() => {isRefreshing = false; })
        });

                         


    }
    else{
        return Promise.reject(error); 
    }
});


instance.cancelTokenSource = axios.CancelToken.source();

export default instance;