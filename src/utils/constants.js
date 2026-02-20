import { apiStatusConstants, UserRole, UserStatus } from './enum';

export const USER_STATUS = {
  [UserStatus.ACTIVE]: 'Active',
  [UserStatus.INACTIVE]: 'Inactive',
};

export const USER_ROLE = {
  [UserRole.ADMIN]: { label: 'Admin', value: UserRole.ADMIN },
  [UserRole.USER]: { label: 'User', value: UserRole.USER },
};

export const apiStatusConditions = {
  failure: (apiState) => apiState.apiStatus === apiStatusConstants.failure,
  success: (apiState) => apiState.apiStatus === apiStatusConstants.success,
  inProgress: (apiState) => apiState.apiStatus === apiStatusConstants.inProgress,
  initial: (apiState) => apiState.apiStatus === apiStatusConstants.initial,
};
export const COMPANY_LOGO_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-teal-500',
];
export const icons = {
  employees: 'streamline-ultimate:human-resources-search-employees-bold',
  masters: 'hugeicons:menu-square',
  eyeIcon: 'lsicon:view-outline',
  uploadExcel: 'material-symbols:upload-rounded',
  payroll: 'streamline-freehand:cash-payment-bill',

  checkCircle: 'mdi:check-circle',
  cardAccount: 'mdi:card-account-details-outline',
  star: 'mdi:star-outline',
  calendar: 'mdi:calendar-outline',
  officeBuilding: 'mdi:office-building-outline',
  message: 'mdi:message-outline',
  phone: 'mdi:phone-outline',
  email: 'mdi:email-outline',
  copy: 'mdi:content-copy',
  gender: 'mdi:gender-male-female',
  birthday: 'mdi:cake-variant-outline',
  mapMarker: 'mdi:map-marker-outline',
  passport: 'mdi:passport',
  account: 'mdi:account-outline',
  pencil: 'mdi:pencil-outline',
  religion: 'mdi:church',
  marital: 'mdi:ring',
  briefcase: 'mdi:briefcase-outline',
  children: 'mdi:baby-bottle-outline',
  holidays: 'flowbite:calendar-week-solid',
  payslip: 'mdi:receipt-text-outline',
};

export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
