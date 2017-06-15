define(['./Stream'], function (Stream) {
  'use strict';
  function ttyError () {
    throw new Error('Raw TTY error');
  }
  return class TTY {
    constructor () {
      this.stdin = new Stream();
      this.stdout = new Stream(this.onStdout.bind(this));
      this.stderr = new Stream(this.onStderr.bind(this));
    }

    onStdout (text) {
      ttyError();
    }

    onStderr (text) {
      ttyError();
    }
  };
});