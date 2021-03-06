// @flow
import { of, Observable } from "rxjs";
import type { Command, Payload, Result } from "./index";
import type { Context } from "../context";
import fs from "fs";
import path from "path";

class Read {
  get name() {
    return "read";
  }

  inferFileType(file: string) {
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
    if (file === null) {
      return of({ id: payload.id, data: "A file must be provided", type: "error" });
    }

    const fileType = this.inferFileType(file);

    // Might wanna do a sync
    const content = fs.readFileSync(path.resolve(context.currentDirectory, file));

    return of({ id: payload.id, data: { content: content.toString(), fileType }, type: "file" });
  }
}

export { Read };
