import React from 'react';
import EmployeeOnboardForm from '../../features/employee/components/onboard/onboard';
import EmpProfileForm from '../../features/employee/components/employee-profile/EmpProfileForm';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import useBreadcrumbs from '../../hooks/useBreadCrumbs';
import { icons } from '../../Utils/constants';
import useRouteInformation from '../../hooks/useRouteInformation';

const EmployeeEditPage = () => {
  const { pathParams } = useRouteInformation();
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
      label: pathParams.id,
      path: `/employees/pending/${pathParams.id}`,
    },
  ]);
  return (
    <div>
      <Breadcrumb />
      <EmpProfileForm />
    </div>
  );
};

export default EmployeeEditPage;
