define(function () {
  'use strict';
  let nodeId = 0;
  return class Node {
    constructor (name, owner) {
      if (name.indexOf('/') > -1) throw new Error(`Invalid file name ${name}`);
      if (name.length === 0) throw new Error('Empty file name');
      if (!owner) throw new Error(`No owner for file ${name}`);
      this.inode = nodeId++;
      this.name = name;
      this.owner = owner;
    }

    toString () { return this.getFullPath(); }

    remove () {
      if (this.parent) delete this.parent.children[this.name]
    }

    getFullPath (recurse) {
      if (this.parent) return `${this.parent.getFullPath(recurse || true)}/${this.name}`;
      return recurse ? '' : this.name;
    }
  };
});