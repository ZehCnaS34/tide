// @flow
import { of } from "rxjs";
import type { Command, Payload, Result } from "./index";
import type { Context } from "../context";
import fs from "fs";
import path from "path";

class LS {
  get name() {
    return "ls";
  }

  run(context: Context, payload: Payload): Observable<Result> {
    const [relativeDirectory = "."] = payload.arguments; 
    let fullPath = path.resolve(context.currentDirectory, relativeDirectory);
    const nodes = fs.readdirSync(fullPath).map((node) => {
      let stat = fs.statSync(path.resolve(fullPath, node));

      let type;

      if (stat.isFile()) {
        type = "f";
      } else if (stat.isDirectory()) {
        type = "d";
      }
      
      return {
        text: node,
        type
      }
    });

    return of({ id: payload.id, data: nodes, type: "fileList" });
  }
}

export { LS };
