import apiEndpoints from '../../../services/apiEndPoints';
import HttpService from '../../../services/httpService';
import { getCompanyId } from '../../../utils/functions';

export const createDepartment = async (data) => {
  const response = await HttpService.post(apiEndpoints.createDepartment, {
    ...data,
    companyId: getCompanyId(),
  });
  return response;
};

export const createDesignation = async (data) => {
  const response = await HttpService.post(apiEndpoints.createDesignation, {
    ...data,
    companyId: getCompanyId(),
  });

  return response;
};

export const createEmployementType = async (data) => {
  const response = await HttpService.post(apiEndpoints.createEmployementType, {
    ...data,
    companyId: getCompanyId(),
  });
  return response;
};

export const updateDepartmentStatus = async (data, id) => {
  const response = await HttpService.put(apiEndpoints.updateDepartmentStatus(id), data);
  return response;
};

export const updateDesignationStatus = async (data, id) => {
  const response = await HttpService.put(apiEndpoints.updateDesignationStatus(id),data);
  return response;
};

export const updateEmployementTypeStatus = async (data, id) => {
  const response = await HttpService.put(apiEndpoints.updateEmployementTypeStatus(id),data);
  return response;
};

