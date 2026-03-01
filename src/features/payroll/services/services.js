import apiEndpoints from '../../../services/apiEndPoints';
import HttpService from '../../../services/httpService';

export const getPayslipTemplate = async ({ companyId, month, year }) => {
  const response = await HttpService.get(apiEndpoints.getPayslipTemplate(), {
    params: { companyId, month, year }
  });
  return response;
};

export const getPayslipByCompany = async ({ companyId, month, year }) => {
  const response = await HttpService.get(apiEndpoints.getPayslipByCompany(companyId), {
    params: { month, year },
  });
  return response;
};

export const updatePayslipAttendance = async (payslipId, { presentDays, workingDays }) => {
  const response = await HttpService.put(apiEndpoints.updatePayslipAttendance(payslipId), {
    presentDays,
    workingDays,
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

export const finalizePayslip = async ({ companyId, month, year }) => {
  const response = await HttpService.post(apiEndpoints.finalizePayslip(companyId, month, year));
  return response;
};

export const getGeneratePayslip = async({companyId, employeeId, month, year}) => {
  const response = await HttpService.get(apiEndpoints.generatePayslip(companyId, employeeId, month, year));
  return response;
}
