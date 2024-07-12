// tableReducer.js
import { SET_TABLE_STATE } from './tableActions'; // Import the action type

export const tableReducer = (state = null, action) => {
    switch (action.type) {
      case SET_TABLE_STATE:
        return action.payload;
      default:
        return state;
    }
  };
  