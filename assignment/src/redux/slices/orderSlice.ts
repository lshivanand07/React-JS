import { createSlice } from '@reduxjs/toolkit';

export const ordersSlice = createSlice({
  name: 'order',
  initialState: {
    orderItem: [],
  },

  reducers: {
    setOrderItem: (state, action) => {
      state.orderItem = action.payload;
    },

    clearOrderItem: (state) => {
      state.orderItem = [];
    },
  },
});

export const { setOrderItem, clearOrderItem } = ordersSlice.actions;
export default ordersSlice.reducer;
