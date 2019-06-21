import { createAction, createReducer } from "redux-starter-kit";
import { combineReducers } from "redux";

const addResult = createAction("results/add");

const results = createReducer(
  {},
  {
    [addResult](state, action) {
      console.log(action.payload);
      return {
        ...state,
        [action.payload.id]: action.payload
      };
    }
  }
);

export default results;
export { addResult };
