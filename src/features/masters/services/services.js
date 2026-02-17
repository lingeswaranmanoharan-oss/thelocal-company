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

export const getSalaryComponent = async () => {
  const url = apiEndpoints.getSalaryComponent(getCompanyId());
  const response = await HttpService.get(url);
  return response;
}

export const addSalaryComponent = async (data) => {
  const response = await HttpService.post(apiEndpoints.addSalaryComponent, {
    ...data,
    companyId: getCompanyId(),
  });
  return response;
};

export const getSalaryComponentById = async (id) => {
  const response = await HttpService.get(apiEndpoints.getSalaryComponentById(id));
  return response;
};

export const updateSalaryComponent = async (id, data) => {
  const response = await HttpService.put(apiEndpoints.updateSalaryComponent(id), {
    ...data,
    companyId: getCompanyId(),
  });
  return response;
};

