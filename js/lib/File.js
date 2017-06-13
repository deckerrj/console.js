define(['./Node'], function (Node) {
  return class File extends Node {
    constructor (name, owner, attr) {
      super(name, owner);
      Object.assign(this, attr);
      this.isFile = true;
    }
  };
});