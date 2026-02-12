import { useEffect } from 'react';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import Employee from '../../features/employee/components/employee/employee';
import { icons } from '../../Utils/constants';
import useBreadcrumbs from '../../hooks/useBreadCrumbs';
import useRouteInformation from '../../hooks/useRouteInformation';
import { combineSlices } from '@reduxjs/toolkit';
import { capitalize } from '@mui/material';

const EmployeePage = () => {
  const { pathname } = useRouteInformation();
  const names = pathname.split('/');
  useBreadcrumbs([
    {
      icon: icons.employees,
      path: '/employees/pending',
    },
    {
      label: pathname.includes('requests') ? 'Approvals Requests' : capitalize(`${names[2]}`),
      path: pathname.includes('requests') ? '/employees/requests' : '/employees',
    },
  ]);

  return (
    <div>
      <Breadcrumb />
      <Employee />
    </div>
  );
};

export default EmployeePage;
