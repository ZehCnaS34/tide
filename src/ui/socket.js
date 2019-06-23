import minimist from "minimist";
import io from "socket.io-client";
const socket = io();

let ID = 1;
function parseCommand(input) {
  const parsed = minimist(input.trim().split(/\s+/));
  console.log("parsed", parsed, input);
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

export const getMeta = (payload) => new Promise((resolve) => {
  function handle(result) {
    if (payload.id !== result.id) return;
    resolve(result);
    socket.off("meta-result", handle);
  }
  socket.on("meta-result", handle);
  socket.emit("meta-get", payload);
});

export const rpc = (command) => new Promise((resolve) => {
  const payload = parseCommand(command);
  function handle(result) {
    if (payload.id !== result.id) return;
    resolve(result);
    socket.off("result", handle);
  }
  socket.on("result", handle);
  socket.emit("run", payload);
});


export default socket;
