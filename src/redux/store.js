import { configureStore } from '@reduxjs/toolkit';
import BreadcrumbSlice from '../components/Breadcrumb/BreadcrumbSlice';
import profileSlice from '../features/profile/profileSlice';

const store = configureStore({
  reducer: {
    breadcrumbs: BreadcrumbSlice.reducer,
    profile: profileSlice.reducer,
  },
});

export default store;
