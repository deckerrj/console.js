define(['./lib/DocumentTTY', './lib/Shell', './os'], function (DocumentTTY, Shell, os) {
  'use strict';
  function onLoad (fn) {
    if (document.readyState === 'complete') return fn();
    window.addEventListener('load', fn);
  }
  return function () {
    onLoad(function () {
      os.boot();
      let tty = new DocumentTTY(document.getElementById('console'));
      tty.on('stdin', function (text) {
        tty.printLn(tty.statusLine(text).replace(/ /g, '&nbsp;'));
      });
      let shellFile = os.fs.realpath('/bin/sh');
      let shellProcess = os.process.spawn(['/bin/sh'], {PATH: '/bin:/home/bin', HOME: '/home'}, shellFile.code);
      shellProcess.tty = tty;
      //let shell = new Shell(shellProcess, tty);
      //shell.os = os;
      //shellProcess.exec(['/bin/sh'], {PATH: '/bin:/home/bin', HOME: '/home'}, shell.processFn);
      shellProcess.cwd = os.fs.realpath('/home');
      document.addEventListener('keydown', tty.keyDown);
      tty.printLn('Type `help` for more information');
      shellProcess.run();
    });
  }
});