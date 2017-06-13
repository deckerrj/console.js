define(function () {
  'use strict';
  let userId = 0;
  return class User {
    constructor (name) {
      this.id = userId++;
      this.name = name;
    }
  };
});