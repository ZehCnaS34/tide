// @flow
import { of } from "rxjs";
import type { Command, Payload, Result } from "./index";
import type { Context } from "../context";
import fs from "fs";
import path from "path";

class CD {
  get name() {
    return "cd";
  }

  run(context: Context, payload: Payload): Observable<Result> {
    const [relativeDirectory = "."] = payload.arguments; 
    context.currentDirectory = path.resolve(context.currentDirectory, relativeDirectory);
    return of({ id: payload.id, data: true, type: "result" });
  }
}

export { CD };
