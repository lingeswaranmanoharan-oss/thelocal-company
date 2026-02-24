import React from 'react';
import useRouteInformation from '../../../hooks/useRouteInformation';
import useBreadcrumbs from '../../../hooks/useBreadCrumbs';
import { icons } from '../../../Utils/constants';
import { Breadcrumb } from '../../../components/Breadcrumb/Breadcrumb';
import ViewEmployeesDetail from '../../../features/employee/components/ViewEmployeeDetailsData/ViewEmployeeDetails';
import ViewEmployeeDetailsData from '../../../features/employee/components/ViewEmployeeDetailsData/ViewEmployeeDetailsData';

const ViewEmployeeDetailsV2 = () => {
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
      {/* <ViewEmployeeDetailsData /> */}
      <ViewEmployeesDetail/>
    </div>
  );
};

export default ViewEmployeeDetailsV2;
