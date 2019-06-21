import { createSelector } from "reselect";

const resultsMap = state => state.results;

export const resultsList = createSelector(
  resultsMap,
  (map) => {
    let keys = Object.keys(map).sort((a, b) => Number(b) - Number(a));
    return keys.map((key) => {
      return map[key];
    });
  }
)
