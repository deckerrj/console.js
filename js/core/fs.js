define(['../lib/Node'], function (Node) {
  'use strict';
  let rootRegex = /^\/+$/m;
  let splitRegex = /\/+/;
  let root;

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