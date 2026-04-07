import React from 'react';
import useBreadcrumbs from '../../../hooks/useBreadCrumbs';
import useRouteInformation from '../../../hooks/useRouteInformation';
import { Breadcrumb } from '../../../components/Breadcrumb/Breadcrumb';
import EmployeeDetailsNew from '../../../features/employee/components/ViewEmployeeDetailsData/EmployeeDetailsNew';
import { icons } from '../../../Utils/constants';

const EmployeeDetailsNewPage = () => {
  useBreadcrumbs([
    {
      icon: icons.employees,
      path: '/employees/pending',
    },
    {
      label: 'On Boarded',
      path: '/employees/onboarded',
    },
    {
      label: 'View Employee',
      path: '/employees/add-employee',
    },
  ]);
  return (
    <div>
      <Breadcrumb />
      <EmployeeDetailsNew />
    </div>
  );
};

export default EmployeeDetailsNewPage;
