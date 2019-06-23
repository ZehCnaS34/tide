import { getMeta } from "../socket";
import { addResult } from "./reducer";

export const getCompletions = command => async (dispatch, __, { socket }) => {
  let time = Date.now();
  const result = await getMeta({ type: "completions", command });
  result.time = time;
  console.log(result);
};
