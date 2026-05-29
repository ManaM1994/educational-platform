import axios from 'axios';
import { store } from '@/store/store';
import { clearUser } from '@/features/auth/authSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';
    const isMeRequest = requestUrl.includes('/me/');
    const isAuthRequest =
      requestUrl.includes('/login/') ||
      requestUrl.includes('/register/') ||
      requestUrl.includes('/logout/');

    if (error.response?.status === 401 && !originalRequest._retry && !isMeRequest && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post('/auth/token/refresh/');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(clearUser());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
