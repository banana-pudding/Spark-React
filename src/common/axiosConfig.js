import axios from "axios";

if (localStorage.jwtToken) {
    axios.defaults.headers.common["Authorization"] = localStorage.jwtToken;
}

const instance = axios.create({});

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        console.log("ERROR", error);
        if (error.response.status == 401) {
            localStorage.removeItem("jwtToken");
            axios.defaults.headers.common["Authorization"] = null;
        }

        return Promise.reject(error);
    }
);

export default instance;
