import axios from "axios";



const API = axios.create({
    baseURL : import.meta.env.VITE_API_URL,
    headers : {
        "Content-Type" : "application/json"
    },
});

// attach token to the request automatically

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if(token)
        req.headers.Authorization = `Bearer ${token}`;

    return req;
});

export default API;