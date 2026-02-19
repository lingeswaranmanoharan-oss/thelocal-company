import React from 'react'
import Holidays from '../../features/holidays/components/holidays'
import useBreadcrumbs from '../../hooks/useBreadCrumbs';
import { icons } from '../../Utils/constants';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';


const HolidaysPage = () => {

   useBreadcrumbs([
    {
      icon: icons.holidays,
      path: '/holidays',
    },
    {
      label: 'Holidays',
      path: '/holidays',
    },
  ]);


  return (
    <div>
      <Breadcrumb/>
        <Holidays/>
    </div>
  )
}

export default HolidaysPage