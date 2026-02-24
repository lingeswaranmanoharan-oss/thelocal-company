import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiStatusConditions, icons } from '../../Utils/constants';
import { useSelector } from 'react-redux';

const menuConfig = [
  {
    key: 'employee',
    label: 'Employees',
    icon: icons.employees,
    children: [
      { label: 'Pending', path: '/employees/pending' },
      { label: 'Requested', path: '/employees/requested' },
      { label: 'Onboarded', path: '/employees/onboarded' },
      { label: 'Reported', path: '/employees/reported' },
      // { label: 'Approval Requests', path: '/employees/requests' },
    ],
  },
  // {
  //   key: 'employeeReq',
  //   label: 'Employees Requests',
  //   icon: 'carbon:user-profile',
  //   children: [{ label: 'Employees Requests', path: '/employees-requests' }],
  // },
  {
    key: 'masters',
    label: 'Masters',
    icon: icons.masters,
    children: [
      { label: 'Employement-Types', path: '/masters/employement-types' },
      { label: 'Designations', path: '/masters/designations' },
      { label: 'Departments', path: '/masters/departments' },
      { label: 'Salary component', path: '/masters/salary-component' },
    ],
  },
  {
    key: 'payroll',
    label: 'Payroll',
    icon: icons.payroll,
    children: [
      { label: 'Upload Excel', path: '/payroll/upload-excel' },
      { label: 'Upload Payslip', path: '/payroll/upload-payslip' },
      // { label: 'Pay Slip', path: '/payroll/pay-slip' }
    ],
  },
  {
    key: 'holidays',
    label: 'Holidays',
    icon: icons.holidays,
    children: [
      { label: 'Holiday List', path: '/holidays/holiday-list' },
      {
        label: 'Business Days',
        path: '/holidays/business-days',
      },
    ],
  },
];

const SideNav = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [expandedMenu, setExpandedMenu] = useState({});
  const proflie = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const toggleMenu = (key) => {
    setExpandedMenu((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 border-b">
            <div className="flex items-center my-2">
              <img
                src={
                  apiStatusConditions.success(proflie)
                    ? proflie?.data?.data?.logoUrl
                    : `https://placehold.co/600x400?text=${apiStatusConditions.failure(proflie)
                      ? 'failed to fetch the logo'
                      : 'fetching logo...'
                    }`
                }
                alt="logo"
                className="h-14 w-full rounded-full object-contain"
              />
            </div>

            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
              <Icon icon="mdi:close" />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            {menuConfig.map((menu) => (
              <div key={menu.key} className="mb-1">
                <button
                  onClick={() => toggleMenu(menu.key)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Icon icon={menu.icon} className="w-5 h-5" />
                    <span className="font-medium">{menu.label}</span>
                  </div>

                  <Icon
                    icon={expandedMenu[menu.key] ? 'mdi:chevron-down' : 'mdi:chevron-right'}
                    className="text-xs"
                  />
                </button>

                {expandedMenu[menu.key] && (
                  <div className="ml-8 mt-1 space-y-1">
                    {menu.children.map((child) => (
                      <button
                        key={child.path}
                        onClick={() => handleNavigate(child.path)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg ${pathname.includes(child.path)
                          ? 'bg-orange-600 text-white'
                          : 'text-gray-600'
                          }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SideNav;
