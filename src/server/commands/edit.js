// @flow
import { of } from "rxjs";
import type { Command, Payload, Result } from "./index";
import type { Context } from "../context";
import fs from "fs";
import path from "path";

class Edit {
  get name() {
    return "edit";
  }

  inferFileType(file) {
    let [name, ext] = file.split(".");

    if (/(txt)/.test(ext)) {
      return "text";
    } else if (/(jsx?)/.test(ext)) {
      return "javascript"
    } else if (/(py)/.test(ext)) {
      return "python"
    } else if (/(rb)/.test(ext)) {
      return "ruby"
    } else if (/(bashrc|zshrc)/.test(ext)) {
      return "shell"
    }

    return 'txt';
  }

  run(context: Context, payload: Payload): Observable<Result> {
    const [file = null] = payload.arguments; 

    const fileType = this.inferFileType(file);

    // Might wanna do a sync
    const content = fs.readFileSync(path.resolve(context.currentDirectory, file));

    return of({ id: payload.id, data: { content: content.toString(), fileType }, type: "edit" });
  }
}

export { Edit };
