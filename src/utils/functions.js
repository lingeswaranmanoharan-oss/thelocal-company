import config from '../config/config';
import StorageService from '../services/storageService';
import { apiStatusConstants } from './enum';

const getClientStorage = () => {
  return JSON.parse(sessionStorage.getItem('loginCred'));
};

const getAuthorization = (token) => {
  const jwt = token || getClientStorage()?.token || '';
  return jwt ? `Bearer ${jwt}` : null;
};

const initialState = {
  apiStatus: apiStatusConstants.initial,
};

const apiReducer = (state = initialState, action) => {
  switch (action.apiStatus) {
    case apiStatusConstants.success:
      return {
        apiStatus: apiStatusConstants.success,
        data: action.payload,
      };
    case apiStatusConstants.failure:
      return {
        ...state,
        apiStatus: apiStatusConstants.failure,
        data: action.payload,
      };
    case apiStatusConstants.inProgress:
      return {
        ...state,
        apiStatus: apiStatusConstants.inProgress,
      };
    case apiStatusConstants.initial:
      return {
        apiStatus: apiStatusConstants.initial,
      };
    // direct update within modal(api-response)
    default:
      return {
        ...state,
        data: {
          ...state.data,
          data: { ...state.data.data, ...action },
        },
      };
  }
};
const handleQueryParams = (params) => {
  for (const key in params) {
    if (!params[key] && params[key] !== 0) {
      delete params[key];
    }
  }
  const queryParams = new URLSearchParams({ ...params });
  return queryParams.toString();
};

const getAuthTokenDetails = () => {
  try {
    const token = StorageService?.get(config.hrmToken);

    if (!token) return null;

    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));

    return payload;
  } catch (error) {
    console.error('Invalid token format:', error);
    return null;
  }
};
// console.log(getAuthTokenDetails())
const getCompanyId = () => getAuthTokenDetails()?.sub;
const apiStatusConditions = {
  failure: (apiState) => apiState.apiStatus === apiStatusConstants.failure,
  success: (apiState) => apiState.apiStatus === apiStatusConstants.success,
  inProgress: (apiState) => apiState.apiStatus === apiStatusConstants.inProgress,
  initial: (apiState) => apiState.apiStatus === apiStatusConstants.initial,
};

const getDateToDDMMYYYYformat = (timezone, nullShow) => {
  let originalDate = new Date();
  if (timezone || nullShow) {
    if (nullShow && !timezone) {
      return '---';
    }
    originalDate = new Date(timezone);
  }
  const year = originalDate.getFullYear();
  const month = String(originalDate.getMonth() + 1).padStart(2, '0');
  const day = String(originalDate.getDate()).padStart(2, '0');

  return `${day}-${month}-${year}`;
};
export {
  apiReducer,
  initialState,
  getClientStorage,
  getAuthorization,
  handleQueryParams,
  getAuthTokenDetails,
  getCompanyId,
  apiStatusConditions,
  getDateToDDMMYYYYformat,
};
