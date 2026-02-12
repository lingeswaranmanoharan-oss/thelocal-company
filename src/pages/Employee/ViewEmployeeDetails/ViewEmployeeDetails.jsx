import React from 'react';
import ViewEmployeeDetailsData from '../../../features/employee/components/ViewEmployeeDetailsData/ViewEmployeeDetailsData';
import useRouteInformation from '../../../hooks/useRouteInformation';
import useBreadcrumbs from '../../../hooks/useBreadCrumbs';
import { icons } from '../../../Utils/constants';
import { Breadcrumb } from '../../../components/Breadcrumb/Breadcrumb';

const ViewEmployeeDetails = () => {
  const { pathname } = useRouteInformation();
  const name = pathname?.split('/');
  useBreadcrumbs([
    {
      icon: icons.employees,
      path: `/employees/${name[2]}`,
    },
    {
      label: 'View Employee',
      path: '/employees/add-employee',
    },
  ]);
  return (
    <div>
      <Breadcrumb />
      <ViewEmployeeDetailsData />
    </div>
  );
};

export default ViewEmployeeDetails;
