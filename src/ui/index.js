// @flow
import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo
} from "react";
import ReactDOM from "react-dom";
import minimist from "minimist";
import { Provider, connect } from "react-redux";
import { Signal } from "../common/signal";
import { configureStore } from "./store";
import { ResultsList, thunk } from "./results";

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

const socket = io();

const addSocket = (name, fn) => {
  socket.on(name, fn);
  return () => {
    socket.off(name, fn);
  };
};

const addSockets = (...names) => {
  let output = {};
  for (const name of names) {
    output[name] = fn => addSocket(name, fn);
  }
  return output;
};

const SocketContext = createContext({});

function Socket({ children }) {
  const [results, setResults] = useState({});

  return (
    <SocketContext.Provider
      value={{
        ...addSockets("onContext", "onResult"),
        emit(...args) {
          socket.emit(...args);
        },
        results,
        run(command) {
          return new Promise(resolve => {
            const payload = parseCommand(command);
            function handle(result) {
              if (result.id != payload.id) return;
              let newResults = { ...results, [payload.id]: payload };
              socket.off("result", handle);
              resolve(result);
              setResults(newResults);
            }
            socket.on("result", handle);
            socket.emit("run", payload);
          });
        },
        send(msg) {
          socket.emit("send", msg);
        }
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

function useSignal() {
  return useMemo(() => {
    return new Signal();
  }, []);
}

function useInput(defaultValue = "") {
  const { value: present, add } = useHistory();
  const [value, setValue] = useState(defaultValue);

  let keyMap = {
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
      let stream = keyMap[e.key];
      if (!stream) {
        console.log(e.key);
        return;
      }
      // NOTE: Maybe prevent default
      stream.touch(value);
    }
  };

  return {
    inputProps,
    clear() {
      setValue("");
    },
    value,
    $stream: keyMap
  };
}

function useHistory() {
  let [past, setPast] = useState([]);
  let [present, setPresent] = useState(null);
  let [future, setFuture] = useState([]);

  const back = () => {
    if (past.length === 0) {
      return;
    }
    let newPresent = past.slice(-1);
    let newPast = past.slice(0, -1);
    let newFuture = future.concat([present]);
    setPresent(newPresent);
    setPast(newPast);
    setFuture(newFuture);
  };

  const forward = () => {
    if (future.length === 0) return;

    let newPresent = future[0];
    let newPast = past.concat([present]);
    let newFuture = future.slice(1);
    setPresent(newPresent);
    setPast(newPast);
    setFuture(newFuture);
  };

  const add = value => {
    let { newPast: past, newPresent: present, newFuture } = _reset();

    let newPast = past.concat([present]);
    let newPresent = value;

    setPast(newPast);
    setPresent(newPresent);
    setFuture(newFuture);
  };

  const _reset = () => {
    let newPast = past.concat([present]).concat(future.slice(0, -1));
    let newPresent = future.slice(-1);
    return {
      newPast,
      newPresent,
      newFuture: []
    };
  };

  const reset = () => {
    const { newPast, newPresent, newFuture } = _reset();
    setPast(newPast);
    setPresent(newPresent);
    setFuture(newFuture);
  };

  return {
    value: present,
    add,
    back,
    forward
  };
}

function CommandBar({ run }) {
  const { inputProps, $enter, clear, $stream, value } = useInput();

  useEffect(() => {
    let subscription = $stream.Enter.subscribe(async value => {
      if (!value) return;
      const result = await run(value);
      console.log("...result", result);
      clear();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <input {...inputProps} autoFocus={true} />
    </div>
  );
}

CommandBar = connect(
  () => ({}),
  dispatch => ({
    run: (...args) => dispatch(thunk.run(...args))
  })
)(CommandBar);

function Index() {
  const { onContext, emit } = useContext(SocketContext);

  useEffect(() => {
    emit("ready");
    return onContext(context => {
      console.log("got that context baby", context);
    });
  }, []);

  return (
    <div>
      <CommandBar />
      <ResultsList />
    </div>
  );
}

function App() {
  return (
    <Socket>
      <Provider store={store}>
        <Index />
      </Provider>
    </Socket>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
