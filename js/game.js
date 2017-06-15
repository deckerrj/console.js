define(['./lib/DocumentTTY', './os'], function (DocumentTTY, os) {
  'use strict';
  function onLoad (fn) {
    if (document.readyState === 'complete') return fn();
    window.addEventListener('load', fn);
  }
  return function () {
    onLoad(function () {
      os.boot();
      let tty = new DocumentTTY(document.getElementById('console'));
      let shellFile = os.fs.file('/bin/sh');
      let shellProcess = os.process.spawn(shellFile.code, ['/bin/sh'], {
        stdin: tty.stdin,
        stdout: tty.stdout,
        stderr: tty.stderr,
        env: {PATH: '/bin:/home/bin', HOME: '/home'},
        cwd: os.fs.dir('/home'),
        tty
      });
      document.addEventListener('keydown', tty.keyDown);
      tty.stdout.write('Type `help` for more information\n');
      shellProcess.run();
    });
  }
});