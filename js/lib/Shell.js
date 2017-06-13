define(['../util/builtins', '../util/parser'], function (builtins, parser) {
  'use strict';
  return class Shell {
    constructor (process, tty) {
      Object.assign(this, {process, tty});
      this._onStdin = this.onStdin.bind(this)
      this.tty.on('stdin', this._onStdin);
    }

    get env () { return this.process.env; }

    spawn (argv) {
      let child = this.process.spawn(argv);
      let name = argv[0];
      if (name.startsWith('./')) {
        console.log(this.os.fs.realpath(this.process.cwd, name));
      } else {
        let paths = this.env.PATH.split(':');
        let validPath;
        for (let path of paths) {
          try {
            validPath = this.os.fs.realpath(path, name);
          } catch (e) {}
        }
        if (validPath) return validPath.code.apply(this.process, argv);
      }

      // this.tty.removeListener('stdin', this._onStdin);
    }

    onStdin (text) {
      this.tty.printLn(`> ${text}`);
      let command = parser.line(text);
      let lines;
      if (builtins[command[0]]) {
        lines = builtins[command[0]](this, command);
      } else {
        lines = this.spawn(command);
      }
      if (!lines) return;
      if (!Array.isArray(lines)) {
        this.tty.printLn(lines);
        return;
      }
      for (let line of lines) this.tty.printLn(line);
    }
  }
});