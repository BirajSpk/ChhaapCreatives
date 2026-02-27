import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

/* Request Interceptor - attach auth token */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/* Response Interceptor for global error handling */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        /* Handle 401 Unauthorized globally if needed */
        if (error.response && error.response.status === 401) {
            /* Optional: Clear user state or redirect to login */
        }
        return Promise.reject(error);
    }
);

export default api;
