import React from 'react';
import axios from 'axios';
import { Redirect} from 'react-router-dom';
const API = axios.create({
    baseURL: "http://localhost:4000/api/v1/",
    headers: {
        // 'Access-Control-Allow-Headers': 'x-access-token',
        'Authorization': {
            toString () {
              return `Bearer ${localStorage.getItem('token')}`
            }
        }
       //'Content-Type': 'application/json; multipart/form-data;charset=utf-8;'
        //'Authorization': 'Bearer mama'
    }
});
// api.interceptors.request.use(function (config) {
//     console.log(`Here is the request data before the request is sent:  ${config}`);
  
//     return config;
//   })
/**
 * Axios Request Interceptor
 */
// api.interceptors.request.use(function (config) {
//     return new Promise((resolve, reject) => {
//       let interval = setInterval(() => {
//         if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
//           PENDING_REQUESTS++
//           clearInterval(interval)
//           resolve(config)
//         } 
//       }, INTERVAL_MS)
//     })
//   })

/**
 * Axios Response Interceptor
 */
// api.interceptors.response.use(function (response) {
//     console.log('interceptor', response)

// }, function (error) {
//     localStorage.clear();
//     return (
//         <Redirect  to="/login" />
//     )
//     // console.log('interceptor', error)
// })

export default  API