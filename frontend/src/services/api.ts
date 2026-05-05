import axios from 'axios';
import { logout, setAccessToken } from '../store/authSlice';
import { store } from '../store';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = error.config?.url ?? '';
    const isAuthRequest =
      requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh-token');
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !isAuthRequest && !originalRequest?._retry) {
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (storedRefreshToken) {
        try {
          originalRequest._retry = true;
          const refreshResponse = await axios.post(
            `${baseURL}/auth/refresh-token`,
            { refreshToken: storedRefreshToken },
            { withCredentials: true }
          );
          const nextAccessToken = refreshResponse.data.data.accessToken as string;
          store.dispatch(setAccessToken(nextAccessToken));
          if (originalRequest.headers?.set) {
            originalRequest.headers.set('Authorization', `Bearer ${nextAccessToken}`);
          } else {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${nextAccessToken}`,
            };
          }
          return api(originalRequest);
        } catch {
          // Fall through to normal logout handling.
        }
      }
    }

    if (error.response?.status === 401 && !isAuthRequest) {
      store.dispatch(logout());
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.assign('/login');
    }

    return Promise.reject(error);
  }
);

export default api;
