// tableActions.js

export const SET_TABLE_STATE = 'SET_TABLE_STATE';

export const setTableState = (rowData) => ({
  type: SET_TABLE_STATE,
  payload: rowData,
});
