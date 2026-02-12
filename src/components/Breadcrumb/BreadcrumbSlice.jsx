import { createSlice } from '@reduxjs/toolkit';

const BreadcrumbSlice = createSlice({
  name: 'breadcrumbs',
  initialState: [],
  reducers: {
    handleBreadCrubms: (_, action) => action.payload,
  },
});

export const { handleBreadCrubms } = BreadcrumbSlice.actions;
export default BreadcrumbSlice;
