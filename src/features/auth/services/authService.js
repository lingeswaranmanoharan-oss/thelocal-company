import HttpService from '../../../services/httpService';

export const signIn = async (payload) => {
  const response = await HttpService.post('/auth/login', payload);
  return response;
};

export const getNewToken = async () => {
  const response = await HttpService.post('/auth/refresh', {});
  return response.data;
};

export const signOut = async () => {
  const response = await HttpService.post('/hrm/api-hrm/logout', {});
  return response.data;
};

export const forgotPasswordApi = async (payload) => {
  const response = await HttpService.post('/auth/forgot-password', payload);
  return response;
};

export const resetPasswordApi = async (payload) => {
  const response = await HttpService.post('/auth/reset-password', payload);
  return response;
};
