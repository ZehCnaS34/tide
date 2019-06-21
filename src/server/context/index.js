// @flow

class Context {
  currentDirectory: string;

  constructor() {
    this.currentDirectory = process.env.HOME || "/";
  }
}


export { Context }
