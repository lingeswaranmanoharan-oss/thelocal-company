import apiEndpoints from '../../services/apiEndPoints';
import HttpService from '../../services/httpService';

export const imageUpload = async (data) => {
  const response = await HttpService.post(apiEndpoints.imageUpload, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};
