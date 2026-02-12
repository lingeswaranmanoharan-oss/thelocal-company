import axios from 'axios';
import { config } from '../config/config';
import StorageService from './storageService';

// Create an Axios instance
const http = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRrefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

http.interceptors.request.use(
  (config) => {
    const token = StorageService.get('hrmToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  //   async (error) => {
  //     const originalRequest = error.config;
  //     if (error.response?.status === 403 && !originalRequest._retry) {
  //       if (isRefreshing) {
  //         return new Promise((resolve) => {
  //           refreshSubscribers.push((newToken: string) => {
  //             originalRequest.headers.Authorization = `Bearer ${newToken}`;
  //             resolve(http(originalRequest));
  //           });
  //         });
  //       }

  //       originalRequest._retry = true;
  //       isRefreshing = true;

  //       try {
  //         const token = localStorage.getItem('authToken');
  //         if (token) {
  //           const { refresh_token }: any = JSON.parse(token);
  //           const { client_id, client_secret } = config.keyCloakConfig;

  //           const payload = new URLSearchParams({
  //             client_id,
  //             client_secret,
  //             refresh_token,
  //             grant_type: 'refresh_token'
  //           });

  //           const { data: newAccessToken }: any = await axios.post(
  //             config.apiBaseUrl + '/aaa-service/token',
  //             payload,
  //             { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  //           );

  //           localStorage.setItem("authToken", JSON.stringify(newAccessToken));

  //           isRefreshing = false;
  //           onRrefreshed(newAccessToken.access_token);

  //           originalRequest.headers.Authorization = `Bearer ${newAccessToken.access_token}`;
  //           return http(originalRequest);
  //         }
  //       } catch (error) {
  //         isRefreshing = false;
  //         localStorage.removeItem("authToken");
  //         window.location.href = `/login?redirect=${window.location.pathname+window.location.search}`;
  //         return Promise.reject(error);
  //       }
  //     }

  //     return Promise.reject(error.response || error.message);
  //   }
);

// Add utility methods for HTTP operations
const HttpService = {
  get: (url, config) => http.get(url, config),
  post: (url, data, config) => http.post(url, data, config),
  put: (url, data, config) => http.put(url, data, config),
  patch: (url, data, config) => http.patch(url, data, config),
  delete: (url, config) => http.delete(url, config),
};

export default HttpService;
