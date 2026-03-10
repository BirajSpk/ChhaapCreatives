import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

/**
 * Smart token storage: 
 * - localStorage if rememberMe is checked (persist across browser restart)
 * - sessionStorage if not checked (clear on browser close)
 */
const getStorageType = () => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    return rememberMe ? 'localStorage' : 'sessionStorage';
};

/* Request Interceptor - attach auth token */
api.interceptors.request.use(
    (config) => {
        // Try both storages
        let token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/* Response Interceptor for global error handling and token storage */
api.interceptors.response.use(
    (response) => {
        // Store token returned from API based on rememberMe preference
        const { accessToken, rememberMe } = response.data.data || {};
        if (accessToken) {
            const storage = rememberMe !== undefined ? (rememberMe ? 'localStorage' : 'sessionStorage') : getStorageType();
            
            if (storage === 'localStorage') {
                localStorage.setItem('token', accessToken);
                sessionStorage.removeItem('token');
            } else {
                sessionStorage.setItem('token', accessToken);
                localStorage.removeItem('token');
            }
        }
        return response;
    },
    (error) => {
        /* Handle 401 Unauthorized globally */
        if (error.response && error.response.status === 401) {
            // Clear both storage types on auth failure
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            localStorage.removeItem('rememberMe');
        }
        return Promise.reject(error);
    }
);

export default api;
