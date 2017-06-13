define(['./Node', './File'], function (Node, File) {
  'use strict';
  return class Directory extends Node {
    constructor (name, owner) {
      super(name, owner);
      this.isDirectory = true;
      this.children = {};
    }

    addDir (name, owner) {
      let dir = new Directory(name, owner);
      if (this.children[dir.name]) throw new Error('File already exists');
      dir.parent = this;
      this.children[dir.name] = dir;
      return dir;
    }

    addFile (name, owner, attr) {
      let file = new File(name, owner, attr);
      if (this.children[file.name]) throw new Error('File already exists');
      file.parent = this;
      this.children[file.name] = file;
      return file;
    }

    list () {
      return ['.', '..', ...Object.keys(this.children)];
    }
  };
});