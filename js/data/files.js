define(['../lib/Directory'], function (Directory) {
  'use strict';

  function native (main) {
    return {
      isExecutable: true,
      isCompiled: true,
      isNative: true,
      code: function (argv) {
        main.call(this, argv);
        this.kill();
      }
    };
  }

  return function (os) {
    let rootUser = os.user.getRoot();
    let root = os.fs.root = new Directory('ROOT', rootUser);
    root.name = '/';
    let binDir = root.addDir('bin', rootUser);
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

    binDir.addFile('pwd', rootUser, native(function (argv) {
      this.stdout.writeln(this.cwd);
    }));

    binDir.addFile('echo', rootUser, native(function (argv) {
      argv.shift();
      this.stdout.writeln(argv.join(' '));
    }));

    binDir.addFile('cat', rootUser, native(function (argv) {
      let dataListener = data => {
        if (data === null) {
          this.stdin.removeEventListener('data', dataListener);
          this.kill();
        } else {
          this.stdout.write(data);
        }
      }
      this.stdin.addEventListener('data', dataListener);
    }));

    binDir.addFile('ls', rootUser, native(function (argv) {
      argv.shift();
      if (!argv.length) argv.push(this.cwd);
      if (argv.length === 1) {
        let node = os.fs.realpath(this.cwd, argv[0]);
        if (node.isDirectory) {
          for (let dir of node.list()) {
            this.stdout.writeln(dir);
          }
        } else this.stdout.writeln(node);
        return;
      }
      for (let arg of argv) {
        try {
          this.stdout.writeln(os.fs.realpath(this.cwd, arg));
        } catch (err) {
          this.stderr.writeln(err.message || err);
        }
      }
    }));

    binDir.addFile('glob', rootUser, native(function (argv) {
      let pattern = argv[1];
      let path = os.fs.joinpath(this.cwd, pattern);
      let parts = os.fs.splitpath(path);
      let paths = [os.fs.root];
      while (parts.length) {
        let pathList = [];
        let part = parts.shift();
        for (let path of paths) {
          if (part === '*') {
            Object.keys(path.children).forEach(child => pathList.push(path.children[child]));
          } else {
            if (path.children[part]) pathList.push(path.children[part]);
          }
        }
        paths = pathList;
      }
      for (let path of paths) {
        this.stdout.write(path);
      }
    }));

    binDir.addFile('mkdir', rootUser, native(function (argv) {
      if (!argv[1]) return;
      let path = os.fs.joinpath(this.cwd, argv[1]);
      let parent = os.fs.dirname(path);
      let name = os.fs.basename(path);
      os.fs.dir(parent).addDir(name, os.user.getPlayer());
    }));

    binDir.addFile('touch', rootUser, native(function (argv) {
      if (!argv[1]) return;
      let path = os.fs.joinpath(this.cwd, argv[1]);
      let parent = os.fs.dirname(path);
      let name = os.fs.basename(path);
      os.fs.dir(parent).addFile(name, os.user.getPlayer());
    }));

    binDir.addFile('rmdir', rootUser, native(function (argv) {
      if (!argv[1]) return;
      let path = os.fs.joinpath(this.cwd, argv[1]);
      let dir = os.fs.dir(path);
      dir.remove();
    }))

    binDir.addFile('rm', rootUser, native(function (argv) {
      if (!argv[1]) return;
      let path = os.fs.joinpath(this.cwd, argv[1]);
      let file = os.fs.file(path);
      file.remove();
    }))

    root.addDir('home', os.user.getPlayer());
  };
});