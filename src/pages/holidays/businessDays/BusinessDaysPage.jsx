import React from 'react';
import BusinessDays from '../../../features/holidays/components/businessDays/BusinessDays';
import useBreadcrumbs from '../../../hooks/useBreadCrumbs';
import { icons } from '../../../Utils/constants';
import { Breadcrumb } from '../../../components/Breadcrumb/Breadcrumb';

const BusinessDaysPage = () => {
  useBreadcrumbs([
    {
      icon: icons.holidays,
      path: '/holidays/holiday-list',
    },
    {
      label: 'Business Days',
      path: '/holidays/business-days',
    },
  ]);

  return (
    <div>
      <Breadcrumb />
      <BusinessDays />
    </div>
  );
};

export default BusinessDaysPage;
