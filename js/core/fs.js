define(['../lib/Node'], function (Node) {
  'use strict';
  let rootRegex = /^\/+$/m;
  let splitRegex = /\/+/;
  let root;

  function findNode (pathname) {
    if (!pathname) throw new Error('Invalid pathname');
    let components = splitpath(pathname);
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
    return findNode(path);
  }

  function node (path) {
    if (!path) throw new Error(`${path}: invalid name`);
    if (path instanceof Node) return path;
    if (!path.startsWith('/')) throw new Error(`${path}: path not absolute`);
    return findNode(path);
  }

  function dir (path) {
    let dir = node(path);
    if (!dir.isDirectory) throw new Error(`${path}: Not a directory`);
    return dir;
  }

  function file (path) {
    let file = node(path);
    if (!file.isFile) throw new Error(`${path}: is a directory`);
    return file;
  }

  function findFirstFile (files, name) {
  }

  function splitpath (path) {
    if (!path) throw new Error('No path specified');
    if (path.startsWith('/')) path = path.substr(1);
    let parts = path.split(splitRegex);
    return parts;
  }

  function joinpath (...paths) {
    if (!paths.length) throw new Error('Must specify at least one path');
    let fullPath = paths.shift();
    if (fullPath instanceof Node) fullPath = fullPath.getFullPath();
    while (paths.length) {
      let path = paths.shift();
      if (path instanceof Node) fullPath = path.getFullPath();
      else if (path.startsWith('/')) fullPath = path;
      else fullPath = fullPath + '/' + path;
    }
    return fullPath;
  }

  function traversePath(path, cb) {}
  return {
    get root () { return root; },
    set root (v) { if (!v) throw new Error('Null Root'); root = v; },
    basename,
    dirname,
    splitpath,
    realpath,
    joinpath,
    file,
    dir
  };
});