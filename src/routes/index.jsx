import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage_';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import App from '../App';
import EmployeeOnboard from '../pages/Employee/Onboard/Onboard';
import EmployeePage from '../pages/Employee/employee_page';
import ViewEmployeeDetails from '../pages/employee/ViewEmployeeDetails/ViewEmployeeDetails';
import Designation from '../pages/masters/designations/Designation';
import Department from '../pages/masters/departments/Department';
import EmployeeTypesPage from '../pages/masters/employement-types/employeeTypespage';
import Payroll from '../pages/payroll/Payroll';
import PaySlip from '../pages/payroll/PaySlip';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import SalaryComponentListPage from '../pages/masters/salary-component/SalaryComponentPage';
import SalaryComponentFormPage from '../pages/masters/salary-component/SalaryComponentFormPage';
import HolidaysPage from '../pages/holidays/HolidaysPage';
import EmployeeEditPage from '../pages/Employee/employee_edit_page';
import ChangePasswordPage from '../pages/auth/ChangePasswordPage';
import GeneratePayslipPage from '../pages/payroll/GeneratePayslipPage';
import UploadPayslipPage from '../pages/payroll/UploadPayslipPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: '/change-password',
    element: (
      <>
        <ChangePasswordPage />
      </>
    ),
  },
  {
    path: '/reset',
    element: <ResetPasswordPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [{ index: true, element: <Navigate to="/employees/pending" /> }],
  },

  {
    path: '/masters',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'employement-types',
        element: <EmployeeTypesPage />,
      },
      {
        path: 'departments',
        element: <Department />,
      },
      {
        path: 'designations',
        element: <Designation />,
      },
      {
        path: 'salary-component',
        element: <SalaryComponentListPage />,
      },
      {
        path: 'salary-component/add-salary-component',
        element: <SalaryComponentFormPage />,
      },
      {
        path: 'salary-component/edit-salary-component/:id',
        element: <SalaryComponentFormPage />,
      },
    ],
  },
  {
    path: '*',
    element: <ProtectedRoute />,
    children: [{ index: true, element: <Navigate to="employees" /> }],
  },
  {
    path: '/employees',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/employees/pending',
        element: <EmployeePage />,
      },
      {
        path: '/employees/onboarded',
        element: <EmployeePage />,
      },
      {
        path: '/employees/requested',
        element: <EmployeePage />,
      },
      {
        path: '/employees/reported',
        element: <EmployeePage />,
      },
      {
        path: '/employees/pending/add-employee',
        element: <EmployeeOnboard />,
      },
      {
        path: '/employees/requests',
        element: <EmployeePage />,
      },
      {
        path: '/employees/:status/viewEmployeeDetails/:companyId',
        element: <ViewEmployeeDetails />,
      },
      {
        path: '/employees/:status/:id',
        element: <EmployeeEditPage />,
      },
    ],
  },
  {
    path: '/payroll',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'upload-excel',
        element: <Payroll />,
      },
      {
        path: 'pay-slip',
        element: <PaySlip />,
      },
      {
        path: 'generate-payslip',
        element: <GeneratePayslipPage />,
      },
       {
        path: 'upload-payslip',
        element: <UploadPayslipPage />,
      }
    ],
  },
  {
    path: '/holidays',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <HolidaysPage />,
      },
    ],
  },
]);
