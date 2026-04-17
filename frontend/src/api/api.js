import axios from 'axios';

const api = axios.create({

    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
    withCredentials: true,
    
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;

        if (
            status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/user/refresh-token')
        ) {
            originalRequest._retry = true;

            try {
                await api.post('/user/refresh-token');
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;