define(function () {
  'use strict';
  function line (text) {
    return text.split(/\s+/);
    let [command, ...args] = text.split(/\s+/);
    return {command, args};
  }
  function options (opt, args) {
    //
  }
  return {line};
});