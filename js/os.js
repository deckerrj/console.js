define(['./core/process', './core/fs', './core/user'], function (process, fs, user) {
  'use strict';
  let os;

  function boot () {
    process.init();
    os.process = process.getRoot();
  }

  function spawnShell (tty) {/*
    let shell = new Shell(os, tty, {
      PATH: '/bin:/home/bin'
    });
    return shell;
  */}

  function system (shell, command, args) {
    let file;
    try {
      if (command.startsWith('/')) {
        file = fs.pathToFile(command);
      } else {
        let paths = shell.env.PATH.split(':');
        if (command.startsWith('./')) paths.push(fs.getCWD().getFullPath());
        file = fs.findFile(paths, command);
      }
      if (!file.isExecutable) throw new Error(`${command}: is not executable`);
    } catch (err) {
      console.log(err);
      return err.message || err;
    }
    return file.code(...args);
  }

  function exec (command, args) {
    throw new Error('Do not use exec');
  }

  return os = {spawnShell, system, exec, fs, boot, user};
});