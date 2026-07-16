import { createSlice } from '@reduxjs/toolkit';

export const productSlice = createSlice({
  name: 'products',
  initialState: {
    productItem: null,
  },

  reducers: {
    setProduct: (state, action) => {
      state.productItem = action.payload;
    },

    clearProduct: (state) => {
      state.productItem = null;
    },
  },
});

export const { setProduct, clearProduct } = productSlice.actions;
export default productSlice.reducer;
