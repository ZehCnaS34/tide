// @flow
import http from "http";
import express from "express";
import SocketIO from "socket.io";
import { Context } from "./context";
import { Registry } from "./commands";
import { slog as log } from "../common/logger";

import { LS } from "./commands/ls";
import { CD } from "./commands/cd";
import { Read } from "./commands/read";
import { Help } from "./commands/help";
import { Edit } from "./commands/edit";

const state = {};


type StartOptions = {
  atlas: { dist: string, static: string };
}


function start({ atlas }: StartOptions) {
  log.debug("starting server");
  let registry = new Registry();

  [LS, CD, Read, Help, Edit].map(C => registry.register(new C()));

  return new Promise<void>((resolve, reject) => {
    const app = express();
    const server = http.createServer(app);
    const io = SocketIO(server);

    app.set("view engine", "ejs");
    app.use("/dist", express.static(atlas.dist));
    app.use("/static", express.static(atlas.static));
    app.use("/", (req, res) => {
      res.render("index");
    });

    io.on("connection", socket => {
      const context = new Context();

      socket.on("ready", () => {
        socket.emit("onContext", context);
      });

      socket.on("run", payload => {
        try {
          let command = registry.get(payload.command);
          let subscription = command.run(context, payload).subscribe(result => {
            result.context = context;
            result.payload = payload;
            socket.emit("result", result);
          });
        } catch (e) {
          socket.emit("result", {
            id: payload.id,
            data: "Failed to run command",
            context,
            payload,
            type: "error"
          });
        }
      });
    });

    server.listen(3434, error => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

function stop() {}

function restart() {}

export { start, state, stop, restart };
