import { createAction, createReducer } from "redux-starter-kit";
import { combineReducers } from "redux";

const setValue = createAction("commandBar/setValue");

const value = createReducer("", {
  [setValue](state, action) {
    return action.payload;
  }
});

export default combineReducers({
  value
});

export { setValue };
