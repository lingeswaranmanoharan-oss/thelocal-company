// apiInstance.js
import axios from 'axios';
import { getClientStorage } from '../Utils/functions';
import config from '../config/config';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Create axios instance without baseURL
const apiInstance = axios.create({
  baseURL: config.apiBaseUrl,
});

// Response interceptor to handle 401 and refresh token
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = error?.response?.data?.refreshToken;
        if (refreshToken) {
          // Store new token
          const updatedProfile = {
            ...getClientStorage(),
            token: refreshToken,
          };
          sessionStorage.setItem('loginCred', JSON.stringify(updatedProfile));

          // Retry queued requests
          processQueue(null, refreshToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${refreshToken}`;
          return apiInstance(originalRequest);
        } else {
          // sessionStorage.clear();
          // window.location.href = "/login";
          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err, null);
        // sessionStorage.clear();
        // window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiInstance;
