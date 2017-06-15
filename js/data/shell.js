define(['../util/parser', '../util/builtins'], function (parser, builtins) {
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
    let binDir = os.fs.dir('/bin');
    function spawn (process, argv) {
      let name = argv[0];
      let paths;
      if (name.startsWith('./')) {
        paths = [os.fs.joinpath(process.cwd, name)];
      } else {
        paths = process.env.PATH.split(':').map(path => os.fs.joinpath(path, name));
      }
      let file;
      for (let path of paths) {
        try {
          file = os.fs.file(path);
          break;
        } catch (err) {}
      }
      try {
        if (!file) throw new Error(`${name}: No such file or directory`);
        if (!file.isFile) throw new Error(`${name}: is a directory`);
        if (!file.isExecutable) throw new Error(`${name}: is not exectuable`);
        process.stdin.removeEventListener('data', process._onData);
        let child = process.spawn(file.code, argv);
        child.addEventListener('terminate', function (signal) {
          process.stdin.addEventListener('data', process._onData);
        });
        child.run();
      } catch (err) {
        console.log(err);
        process.stderr.writeln(err.message || err);
      }
    }

    function onDataReady () {
      let text = this.stdin.read();
      if (!text) return;
      let parsed = parser.line(text);
      for (let line of parsed.lines) {
        if (builtins[line[0]]) {
          builtins[line[0]](this, os, line);
        } else {
          spawn(this, line);
        }
      }
    }

    let root = os.user.getRoot();
    binDir.addFile('sh', root, native(function (argv) {
      let self = this;
      this._onData = function (text) {
        if (!text) return;
        let parsed = parser.line(text.trim());
        for (let line of parsed.lines) {
          if (builtins[line[0]]) {
            builtins[line[0]](self, os, line);
          } else {
            spawn(self, line);
          }
        }
      };
      this.stdin.addEventListener('data', this._onData);
    }));
  };
});