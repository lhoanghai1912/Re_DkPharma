// src/redux/store.ts
import {configureStore} from '@reduxjs/toolkit';
import {itemReducer, userReducer} from './slice_index';

// Cấu hình store và chỉ định loại reducer
const store = configureStore({
  reducer: {
    user: userReducer,
    item: itemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // Loại trạng thái toàn cục
export type AppDispatch = typeof store.dispatch; // Loại dispatch

export default store;
