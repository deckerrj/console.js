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
    let binDir = os.fs.realpath('/bin');
    function spawn (process, argv) {
      let child = process.spawn(argv);
      let name = argv[0];
      if (name.startsWith('./')) {
        console.log(os.fs.realpath(process.cwd, name));
      } else {
        let paths = process.env.PATH.split(':');
        let validPath;
        for (let path of paths) {
          try {
            validPath = os.fs.realpath(path, name);
          } catch (e) {}
        }
        if (validPath) return validPath.code.call(child, argv);
      }
    }

    function inputHandler (text) {
      let command = parser.line(text);
      if (builtins[command[0]]) {
        builtins[command[0]](this, os, command);
      } else {
        spawn(this, command);
      }
    }

    let root = os.user.getRoot();
    binDir.addFile('sh', root, native(function (argv) {
      this.stdin(inputHandler);
    }));
  };
});