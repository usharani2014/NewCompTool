// sidebarSlice.js

import { createSlice } from '@reduxjs/toolkit';

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    showSidebar: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
  },
});

export const { toggleSidebar } = sidebarSlice.actions;

export const selectShowSidebar = state => state.sidebar.showSidebar;

export default sidebarSlice.reducer;
