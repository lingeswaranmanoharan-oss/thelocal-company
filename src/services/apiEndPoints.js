import { getClientStorage, handleQueryParams } from '../utils/functions';

const apiEndpoints = {
  getEmployeTypes: (query) => `/get/all/employment-types?${handleQueryParams(query)}`,
  getEmpApprovalReqsApi: (companyId) => `/get/requested/employees/company/${companyId}`,
  getEmployeeReqDetails: (empId) => `/v1/admin/get/employee/details/id/${empId}`,
  updateEmployeeProfileStatus: `/v1/admin/update/profileStatus`,
  getDesignations: (companyId, query) =>
    `/v1/designation/company/${companyId}?${handleQueryParams(query)}`,
  getDepartments: (query) => `/department/get-all?${handleQueryParams(query)}`,
  onboardEmployee: `/v1/admin/partial/employee/register`,
  createDepartment: `/department/create`,
  createDesignation: `/v1/designation/save`,
  createEmployementType: `/create/employment-type`,
  updateDepartmentStatus: (id) => `/department/update/${id}`,
  updateDesignationStatus: (id) => `/v1/designation/update/${id}`,
  updateEmployementTypeStatus: (id) => `/update/employment-type/id/${id}`,
  getEmployees: (companyId, query) =>
    `/v1/admin/getAll/employees/company/${companyId}?${handleQueryParams(query)}`,
  imageUpload: '/image',
  getCompanyProfile: (id) => `/v1/admin/companies/${id}`,
  generateCompanyAddresses: `/v1/admin/employee-profile`,


  getSalaryComponent: (companyId) => `/v1/salary-components/company/${companyId}`,
  getSalaryComponentById: (id) => `/v1/salary-components/${id}`,
  addSalaryComponent: `/v1/salary-components`,
  updateSalaryComponent: (id) => `/v1/salary-components/${id}`,

};
export default apiEndpoints;
