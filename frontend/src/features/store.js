// store.js

import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sidebarSlice';
import { tableReducer } from './tableReducer'; // Import the new reducer
import userReducer from './userReducer';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    table: tableReducer,
    user: userReducer,
  },
});
