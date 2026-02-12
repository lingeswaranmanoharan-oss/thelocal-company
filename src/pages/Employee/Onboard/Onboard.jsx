import React from 'react';
import EmployeeOnboardForm from '../../../features/employee/components/onboard/onboard';
import { Breadcrumb } from '../../../components/Breadcrumb/Breadcrumb';
import useBreadcrumbs from '../../../hooks/useBreadCrumbs';
import { icons } from '../../../Utils/constants';

const EmployeeOnboard = () => {
  useBreadcrumbs([
    {
      icon: icons.employees,
      path: '/employees/pending',
    },
    {
      label: 'Pending',
      path: '/employees/pending',
    },
    {
      path: '/add-employee',
      label: 'Add Employee',
    },
  ]);
  return (
    <div>
      <Breadcrumb />
      <EmployeeOnboardForm />
    </div>
  );
};

export default EmployeeOnboard;
