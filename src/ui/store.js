import { reducer as results } from "./results";
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger, { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

function configureStore() {
  const reducer = combineReducers({
    results
  });
  const store = createStore(
    reducer,
    {},
    composeWithDevTools(
      applyMiddleware(
        thunk.withExtraArgument({ socket: io() }),
        createLogger({
          collapsed: true,
          diff: true
        })
      )
    )
  );
  global.store = store;

  return store;
}

export { configureStore };
