// @flow
import type { Observable } from "rxjs";

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
  run: (ctx: Context, payload: Payload) => Observable<Result>,
  name: string
};

class Registry {
  commands: { [name: string]: Command };
  constructor() {
    this.commands = {};
  }

  get(name) {
    if (!this.commands[name]) {
      throw new Error("No command");
    }
    return this.commands[name];
  }

  register(command: Command) {
    this.commands[command.name] = command;
  }
}

export type { Command, Payload, Flags, Arguments };
export { Registry };
