import React from 'react';
import EmployementTypeForm from '../../../features/masters/components/employement-types/EmployementTypeForm';
import { Breadcrumb } from '../../../components/Breadcrumb/Breadcrumb';
import useBreadcrumbs from '../../../hooks/useBreadCrumbs';
import { icons } from '../../../Utils/constants';
import EmployementTypes from '../../../features/masters/components/employement-types/EmployementTypes';

const EmployeeTypesPage = () => {
  useBreadcrumbs([
    {
      icon: icons.masters,
      path: '/masters/employement-types',
    },
    {
      label: 'Employement types',
      path: '/masters',
    },
  ]);

  return (
    <div>
      <Breadcrumb />
      <EmployementTypes />
    </div>
  );
};

export default EmployeeTypesPage;
