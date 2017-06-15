define(['./Stream'], function (Stream) {
  'use strict';
  function ttyError () {
    throw new Error('Raw TTY error');
  }
  return class TTY {
    constructor () {
      this._stdin = [];
    }

    _removeHandler (handler) {
      if (!handler) return;
      let idx = this._stdin.indexOf(handler);
      if (idx >= 0) this._stdin.splice(idx, 1);
    }

    stdin () {
      let stream = Stream.Readable(handler => {
        if (stream.handler) this._removeHandler(stream.handler);
        stream.handler = handler;
        this._stdin.push(handler);
      }, close => this._removeHandler(stream.handler));
      return stream;
    }

    stdout () {
      return Stream.Writable(text => this.toStdout(text));
    }

    stderr () {
      return Stream.Writable(text => this.toStderr(text));
    }

    toStdin (text) {
      for (let handler of this._stdin) {
        handler(text);
      }
    }

    toStdout (text) {
      ttyError();
    }

    toStderr (text) {
      ttyError();
    }
  };
});