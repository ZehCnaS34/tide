// @flow
import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo,
  lazy,
  Suspense
} from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import minimist from "minimist";
import { Provider, connect } from "react-redux";
import { Signal } from "../common/signal";
import { configureStore } from "./store";
import { ResultsList, thunk } from "./results";
const CommandBar = lazy(() => import("./command-bar"));


const store = configureStore();

let ID = 1;
function parseCommand(input) {
  const parsed = minimist(input.split(/\s+/));
  const {
    _: [command, ...args],
    ...flags
  } = parsed;

  return {
    command,
    arguments: args,
    flags,
    id: ID++
  };
}

function useSignal() {
  return useMemo(() => {
    return new Signal();
  }, []);
}

function useInput(defaultValue = "") {
  const [value, setValue] = useState(defaultValue);

  let $stream = {
    Enter: useSignal(),
    ArrowUp: useSignal(),
    ArrowDown: useSignal(),
    ArrowLeft: useSignal(),
    ArrowRight: useSignal(),
    Tab: useSignal()
  };

  const inputProps = {
    value,
    onChange(e) {
      console.log("setting value");
      setValue(e.target.value);
    },
    onKeyDown(e) {
      let stream = $stream[e.key];
      if (!stream) {
        console.log(e.key);
        return;
      }
      // NOTE: Maybe prevent default
      e.persist();
      stream.touch({ value, event: e });
    }
  };

  return {
    inputProps,
    clear() {
      setValue("");
    },
    value,
    $stream
  };
}






function Index() {
  return (
    <div>
      <CommandBar />
      <ResultsList />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <Provider store={store}>
        <Index />
      </Provider>
    </Suspense>
  );
}

let root = document.getElementById("app");
if (root) {
  ReactDOM.render(<App />, root);
} else {
  alert("No app root round.");
}
