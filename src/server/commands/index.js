/* @flow */
import type { Observable } from "rxjs";
import { Context } from "../context";

type Flags = { [id: string]: any };
type Arguments = any[];

type Payload = {
  flags: Flags,
  arguments: Arguments,
  id: number
};

type Result = {
  id: number,
  data: any,
  type: string
};

type Command = {
  run(ctx: Context, payload: Payload): Observable<Result>,
  +pipe?: (ctx: Context, result: Result) => Observable<Result>,
  +name: string
};

class Registry {
  commands: { [name: string]: Command };
  constructor() {
    this.commands = {};
  }

  get(name: string) {
    if (!this.commands[name]) {
      throw new Error("No command");
    }
    return this.commands[name];
  }

  register(command: Command) {
    this.commands[command.name] = command;
  }
}

export type { Command, Payload, Flags, Arguments, Result };
export { Registry };
