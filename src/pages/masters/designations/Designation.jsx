import React from 'react';
import Designations from '../../../features/masters/components/designations/Designations';
import useBreadcrumbs from '../../../hooks/useBreadCrumbs';
import { icons } from '../../../Utils/constants';
import { Breadcrumb } from '../../../components/Breadcrumb/Breadcrumb';

const Designation = () => {
  useBreadcrumbs([
    {
      icon: icons.masters,
      path: '/masters/employement-types',
    },
    {
      label: 'Designations',
      path: '/masters/designations',
    },
  ]);

  return (
    <div>
      <Breadcrumb />
      <Designations />
    </div>
  );
};

export default Designation;
