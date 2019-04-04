import axios from 'axios';
export default axios.create({
    baseURL: "http://localhost:4000/api/v1/",
    headers: {
        // 'Access-Control-Allow-Headers': 'x-access-token',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
});