import apiEndpoints from '../../../services/apiEndPoints';
import HttpService from '../../../services/httpService';

export const getPayslipTemplate = async ({ companyId, month, year }) => {
  const response = await HttpService.get(apiEndpoints.getPayslipTemplate(), {
    params: { companyId, month, year },
    responseType: 'blob',
  });
  return response;
};

export const uploadPayslip = async (file, { companyId, month, year }) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await HttpService.post(apiEndpoints.uploadPayslip(), formData, {
    params: { companyId, month, year },
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });
  return response;
};
