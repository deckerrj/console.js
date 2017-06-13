define(function () {
  'use strict';
  return class EventEmitter {
    constructor () {
      this.handlers = {};
    }

    emit (eventName, ...args) {
      if (!this.handlers[eventName]) return;
      for (let handler of this.handlers[eventName]) {
        setTimeout(function () { handler.apply(this, args); }, 0)
      }
    }

    on (eventName, handler) {
      if (!this.handlers[eventName]) this.handlers[eventName] = [];
      this.handlers[eventName].push(handler);
    }
  };
});