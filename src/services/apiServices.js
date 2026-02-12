import axios from 'axios';
import { apiStatusConstants } from '../utils/enum';
import HttpService from './httpService';

const getContentDisposition = (response) => {
  const contentDis = response.headers['content-disposition']
    .replace('attachment;', '')
    .replace(' filename=', '');
  const file = new File([response.data], contentDis, {
    type: response.data.type,
  });

  return file;
};

const handleErrors = ({ response, apiDispatch, callBackFunction, responseType }) => {
  if (response.success === true) {
    callBackFunction && callBackFunction(response.data);
    apiDispatch &&
      apiDispatch({
        apiStatus: apiStatusConstants.success,
        payload: response,
      });
  } else {
    apiDispatch &&
      apiDispatch({
        apiStatus: apiStatusConstants.failure,
        payload: responseType === 'blob' ? getContentDisposition(response) : response,
      });
    callBackFunction &&
      callBackFunction(responseType === 'blob' ? getContentDisposition(response) : response);
  }
};

const apiServices = {
  getService: async ({ apiUrl, apiDispatch, callBackFunction, controller, responseType, type }) => {
    apiDispatch && apiDispatch({ apiStatus: apiStatusConstants.inProgress });
    try {
      const options = {
        headers: {
          'Content-Type':
            type === 'file' ? '*/*' : type === 'm' ? 'multipart/form-data' : 'application/json',
        },
        responseType: responseType || 'json',
      };
      if (controller) {
        options.signal = controller?.signal;
      }
      const response = await HttpService.get(apiUrl, options);
      handleErrors({ response, apiDispatch, callBackFunction });
    } catch (e) {
      if (controller && (axios.isCancel?.(e) || e.name === 'CanceledError')) {
        return;
      }
      const errorData = e.response?.data || {
        success: false,
        message: e.message,
      };
      callBackFunction && callBackFunction(errorData);
      apiDispatch && apiDispatch({ apiStatus: apiStatusConstants.failure });
    }
  },

  postApiService: async ({
    apiUrl,
    apiDispatch,
    callBackFunction,
    controller,
    responseType,
    type,
    body,
  }) => {
    apiDispatch && apiDispatch({ apiStatus: apiStatusConstants.inProgress });
    try {
      const options = {
        headers: {
          'Content-Type':
            type === 'file' ? '*/*' : type === 'm' ? 'multipart/form-data' : 'application/json',
        },
        responseType: responseType || 'json',
      };
      if (controller) {
        options.signal = controller?.signal;
      }
      const response = await HttpService.post(apiUrl, body, options);
      handleErrors({ response, apiDispatch, callBackFunction, responseType });
    } catch (e) {
      const errorData = e.response?.data || {
        success: false,
        message: e.message,
      };
      callBackFunction && callBackFunction(errorData);
      apiDispatch && apiDispatch({ apiStatus: apiStatusConstants.failure });
    }
  },

  putApiService: async ({
    apiUrl,
    apiDispatch,
    callBackFunction,
    controller,
    responseType,
    type,
    body,
  }) => {
    apiDispatch && apiDispatch({ apiStatus: apiStatusConstants.inProgress });
    try {
      const options = {
        headers: {
          'Content-Type':
            type === 'file' ? '*/*' : type === 'm' ? 'multipart/form-data' : 'application/json',
        },
        responseType: responseType || 'json',
      };
      if (controller) {
        options.signal = controller?.signal;
      }
      const response = await HttpService.put(apiUrl, body, options);
      handleErrors({ response, apiDispatch, callBackFunction });
    } catch (e) {
      const errorData = e.response?.data || {
        success: false,
        message: e.message,
      };
      callBackFunction && callBackFunction(errorData);
      apiDispatch && apiDispatch({ apiStatus: apiStatusConstants.failure });
    }
  },
};

export default apiServices;
