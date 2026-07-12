import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import addressReducer from './slices/addressSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    address: addressReducer,
    cart: cartReducer,
    order: orderReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
