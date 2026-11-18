// src/store/index.js
// Redux Toolkit store – combines all slices

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import toolReducer from '../slices/toolSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tools: toolReducer,
  },
});

export default store;

