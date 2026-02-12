import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiStatusConstants } from '../../utils/enum';
import HttpService from '../../services/httpService';
import apiEndpoints from '../../services/apiEndPoints';
import { getCompanyId } from '../../utils/functions';

const fetchProfile = createAsyncThunk('profile/fetchProfile', async (_, thunkAPI) => {
  try {
    const response = await HttpService.get(apiEndpoints.getCompanyProfile(getCompanyId()));
    if (!response?.success) {
      return thunkAPI.rejectWithValue(response?.data);
    }
    return response;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    apiStatus: apiStatusConstants.initial,
    data: {},
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.apiStatus = apiStatusConstants.inProgress;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.apiStatus = apiStatusConstants.success;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.apiStatus = apiStatusConstants.failure;
        state.data = action.payload;
      }),
});

export { fetchProfile };
export default profileSlice;
