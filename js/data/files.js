define(['../lib/Directory'], function (Directory) {
  'use strict';

  function native (code) {
    return {
      isExecutable: true,
      isCompiled: true,
      isNative: true,
      code
    };
  }

  return function (os) {
    let root = os.user.getRoot();
    os.fs.root = new Directory('ROOT', root);
    os.fs.root.name = '/';
    let binDir = os.fs.root.addDir('bin', root);
    /*
    binDir.addFile('cd', root, native(function (pathname) {
      if (!pathname || !pathname.length) return;
      try {
        if (pathname.startsWith('/')) {
          os.fs.cwd = os.fs.pathToDirectory(pathname);
        } else {
          os.fs.cwd = os.fs.pathToDirectory('./' + pathname);
        }
      } catch (err) {
        return err.message || err;
      }
    }));
    */

    binDir.addFile('pwd', root, native(function (argv) {
      this.stdout(this.cwd);
    }));

    binDir.addFile('echo', root, native(function (argv) {
      argv.shift();
      this.stdout(argv.join(' '));
    }));

    binDir.addFile('ls', root, native(function (argv) {
      argv.shift();
      if (!argv.length) argv.push(this.cwd);
      if (argv.length === 1) {
        let node = os.fs.realpath(this.cwd, argv[0]);
        if (node.isDirectory) {
          for (let dir of node.list()) {
            this.stdout(dir);
          }
        } else this.stdout(node);
        return;
      }
      for (let arg of argv) {
        try {
          this.stdout(os.fs.realpath(this.cwd, arg));
        } catch (err) {
          this.stdout(err.message || err);
        }
      }
    }));

    os.fs.root.addDir('home', os.user.getPlayer());
  };
});