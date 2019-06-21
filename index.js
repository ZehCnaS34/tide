const minimist = require("minimist");
const server = require("./lib");
const path = require("path");

const atlas = {
  static: path.resolve(__dirname, "./static"),
  dist: path.resolve(__dirname, "./dist")
};

server.start({ atlas }).then(() => {
  console.log("Started");
});
