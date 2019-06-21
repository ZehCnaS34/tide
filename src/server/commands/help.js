// @flow
import { Observable, of } from "rxjs";
import type { Command, Payload, Result } from "./index";
import type { Context } from "../context";
import fs from "fs";
import path from "path";


const markdown = `
# TIDE (Name subject to change.)

It's kinda like bash?

I have no intentions to make this posix compatible.
`


class Help {
  get name() {
    return "help";
  }

  run(context: Context, payload: Payload): Observable<Result> {
    return of({ id: payload.id, data: markdown, type: "markdown" });
  }
}

export { Help };
