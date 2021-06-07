import axios from "axios";

// if (localStorage.jwtToken) {
//     axios.defaults.headers.common["Authorization"] = localStorage.jwtToken;
// }

const instance = axios.create({});

/* -------------------------------------------------------------------------- */
/*               For every request, grab the jwt in localstorage              */
/* -------------------------------------------------------------------------- */
instance.interceptors.request.use(
    function (config) {
        config.headers.Authorization = localStorage.jwtToken;
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

/* -------------------------------------------------------------------------- */
/*                         Remove jwt if user invalid                         */
/* -------------------------------------------------------------------------- */
instance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        console.log("ERROR", error);

        if (error.response.status == 401) {
            localStorage.removeItem("jwtToken");
            axios.defaults.headers.common["Authorization"] = null;
            window.location.replace("/login");
        }

        return Promise.reject(error);
    }
);

export default instance;
