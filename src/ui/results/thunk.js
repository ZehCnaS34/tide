import { rpc } from "../socket";
import { addResult } from "./reducer";

export const run = command => async (dispatch, __, { socket }) => {
  let time = Date.now();
  const result = await rpc(command);
  result.time = time;
  dispatch(addResult(result));
};

global.run = run;
