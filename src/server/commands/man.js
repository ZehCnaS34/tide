// @flow
import { Observable, of } from "rxjs";
import type { Command, Payload, Result } from "./index";
import type { Context } from "../context";
import { ErrorResult } from "./index";
import fs from "fs";
import path from "path";


class Man {
  get name() {
    return "man";
  }

  get man(): string {
    return "# Man is awesome";
  }

  run(context: Context, payload: Payload): Observable<Result> {
    const [commandName = null] = payload.arguments;
    let command = null;

    if (commandName == null) {
      return ErrorResult(payload.id, "Need to provide a command.");
    }

    try {
      command = context.registry.get(commandName);
    } catch (error) {
      return ErrorResult(payload.id, "Failed to get command");
    }

    let man = command.man;
    if (!man) {
      man = `# No Man Page

      ${command.name} doesn't provide a man page.
      `;
    }

    return of({ id: payload.id, data: man, type: "markdown" });
  }
}

export { Man };
