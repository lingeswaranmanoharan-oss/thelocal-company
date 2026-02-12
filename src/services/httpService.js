import axios from 'axios';
import { config } from '../config/config';

let inMemoryToken = null;
let tokenUpdateCallback = null;

export const setAccessToken = (token) => {
  inMemoryToken = token;
};

export const getAccessToken = () => inMemoryToken;

export const setTokenUpdateCallback = (responseCallback) => {
  console.log(responseCallback)
  tokenUpdateCallback = responseCallback;
};

// Create an Axios instance
const http = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});


let isRefreshing = false;
let refreshSubscribers = [];

const onRrefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};


http.interceptors.request.use(
  (config) => {
    if (inMemoryToken) {
      config.headers.Authorization = `Bearer ${inMemoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(http(originalRequest));
          });
        });
      }


      originalRequest._retry = true;
      isRefreshing = true;


      try {
        const response = await axios.post(
          config.apiBaseUrl + '/auth/refresh',
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data.data
        isRefreshing = false;
        if (accessToken) {
          inMemoryToken = accessToken;
          if (tokenUpdateCallback) tokenUpdateCallback(accessToken);
          onRrefreshed(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return http(originalRequest);
        }
      } catch (error) {
        isRefreshing = false;
        inMemoryToken = null;
        window.location.href = `/login?redirect=${window.location.pathname+window.location.search}`;
        return Promise.reject(error);
      }
    }
    return Promise.reject(error.response || error.message);
  }
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