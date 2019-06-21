// @flow
import { Observable } from "rxjs";

class Signal {
  constructor() {
    const self = this;
    this._queue = [];
    this.$stream = new Observable((o) => {
      const handle = () => {
        while (this._queue.length > 0) {
          let item = this._queue.shift();
          o.next(item);
        }
        setTimeout(handle, 20);
      };
      handle();
    }) 
  }

  subscribe(fn) {
    return this.$stream.subscribe(fn);
  }

  touch(value) {
    this._queue.push(value);
  }
}


export { Signal };
