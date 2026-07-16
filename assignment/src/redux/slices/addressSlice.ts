import { createSlice } from '@reduxjs/toolkit';

export const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addressItem: [],
  },

  reducers: {
    setAddress: (state, action) => {
      state.addressItem = action.payload;
    },

    addAddress: (state, action) => {
      state.addressItem = action.payload;
    },

    clearAddress: (state) => {
      state.addressItem = [];
    },
  },
});

export const { setAddress, addAddress, clearAddress } = addressSlice.actions;
export default addressSlice.reducer;
