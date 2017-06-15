define(function () {
  'use strict';
  return class EventEmitter {
    constructor () {
      this.handlers = {};
    }

    emit (eventName, ...args) {
      if (!this.handlers[eventName]) return;
      for (let handler of this.handlers[eventName]) {
        setTimeout(function () { handler.apply(this, args); }, 0);
      }
    }

    addEventListener (eventName, handler) {
      if (!this.handlers[eventName]) this.handlers[eventName] = [];
      this.handlers[eventName].push(handler);
      return true;
    }

    removeEventListener (eventName, handler) {
      if (handler) {
        let eventHandlers = this.handlers[eventName]
        if (!eventHandlers) return false;
        let idx = eventHandlers.indexOf(handler);
        if (idx < 0) return false;
        eventHandlers.splice(idx, 1);
      } else if (eventName) {
        delete this.handlers[eventName];
      } else {
        this.handlers = {};
      }
      return true;
    }
  };
});