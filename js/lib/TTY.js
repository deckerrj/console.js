define(['./EventEmitter'], function (EventEmitter) {
  'use strict';
  return class TTY extends EventEmitter {
    printLn (line) {
      throw new Error('Raw TTY error');
    }

    statusLine (text) {
      throw new Error('Raw TTY error');
    }
  };
});