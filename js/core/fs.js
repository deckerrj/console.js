define(['../lib/Directory', '../lib/Node'], function (Directory, Node) {
  'use strict';
  let rootRegex = /^\/+$/m;
  let splitRegex = /\/+/;
  let root;
  function getRoot() { return root; }
  function setRoot(node) { root = node; }

  function safePathToNode (pathname) {
    if (!pathname) throw new Error('Invalid pathname');
    let components = pathname.split(/\/+/);
    components.shift();
    let cur = root;
    while (components.length) {
      let part = components.shift();
      if (part === '' || part === '.') continue;
      if (part === '..') {
        cur = cur.parent;
        if (!cur) cur = root;
        continue;
      }
      if (cur.children[part]) cur = cur.children[part];
      else throw new Error(`${pathname}: No such file or directory`);
      if (!cur.isDirectory && components.length) throw new Error(`${pathname}: Not a directory`);
    }
    return cur;
  }

  function pathToNode (pathname) {
    if (!pathname) throw new Error('Invalid pathname');
    let components = pathname.split(/\/+/);
    let rootPath = components.shift();
    let cur;
    switch (rootPath) {
      case '.': cur = cwd; break;
      case '': cur = root; break;
      default: throw new Error(`${rootPath}: Root path invalid`);
    }
    while (components.length) {
      let part = components.shift();
      if (part === '' || part === '.') continue;
      if (part === '..') {
        cur = cur.parent;
        if (!cur) cur = root;
        continue;
      }
      if (cur.children[part]) cur = cur.children[part];
      else throw new Error(`${pathname}: No such file or directory`);
      if (!cur.isDirectory && components.length) throw new Error(`${pathname}: Not a directory`);
    }
    return cur;
  }

  function pathToDirectory (pathname) {
    let dir = pathToNode(pathname);
    if (!dir.isDirectory) throw new Error(`${path}: Not a directory`);
    return dir;
  }

  function pathToFile (pathname) {
    let file = pathToNode(pathname);
    if (!file.isFile) throw new Error(`${pathname}: is a directory`);
    return file;
  }

  function findFile(paths, filename) {
    for (let path of paths) {
      try {
        let validPath = pathToFile(`${path}/${filename}`);
        if (validPath) return validPath;
      } catch (e) {}
    }
    throw new Error(`${filename}: No such file or directory`);
  }
  root = new Directory('root', 'FAKE');
  root.name = '/';
  function dirname (path) {
    if (path.match(rootRegex)) return '/';
    let parts = path.split(splitRegex);
    parts.pop();
    return parts.join('/') + '/';
  }
  function basename (path) {
    if (path.match(rootRegex)) return '';
    let parts = path.split(splitRegex);
    return parts.pop();
  }
  function realpath (cwd, path) {
    if (!path) {
      path = cwd;
      cwd = '/';
    }
    if (path instanceof Node) return path;
    if (!path.startsWith('/')) return realpath('/', cwd + '/' + path);
    return safePathToNode(path);
  }
  return {
    get root () { return root; },
    set root (v) { if (!v) throw new Error('Null Root'); root = v; },
    basename,
    dirname,
    realpath
  };
});