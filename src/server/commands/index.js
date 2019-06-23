/* @flow */
import type { Observable, of } from "rxjs";
import { Context } from "../context";

type Flags = { [id: string]: any };
type Arguments = any[];

type Payload = {
  flags: Flags,
  arguments: Arguments,
  id: number
};

class IPL implements Payload {
  flags: Flags;
  arguments: Arguments;
  id: number

  static fromObject(obj: Payload): IPL {
    let ipl = new IPL();

    ipl.flags = obj.flags;
    ipl.arguments = obj.arguments;
    ipl.id = obj.id;

    return ipl
  }
}

type Result = {
  id: number,
  data: any,
  type: string
};

function ErrorResult(id, data) {
  return of({
    type: "error",
    data,
    id
  });
}

type Command = {
  run(ctx: Context, payload: Payload): Observable<Result>,
  +man: string,
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
export { Registry, ErrorResult };
