import React from 'react';
import Departments from '../../../features/masters/components/departments/Departments';
import { icons } from '../../../Utils/constants';
import useBreadcrumbs from '../../../hooks/useBreadCrumbs';
import { Breadcrumb } from '../../../components/Breadcrumb/Breadcrumb';

const Department = () => {
  useBreadcrumbs([
    {
      icon: icons.masters,
      path: '/masters/employement-types',
    },
    {
      label: 'Departments',
      path: '/masters/departments',
    },
  ]);

  return (
    <div>
      <Breadcrumb />
      <Departments />
    </div>
  );
};

export default Department;
