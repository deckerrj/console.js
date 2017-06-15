define(['../lib/Process', '../lib/Signal'], function (Process, Signal) {
  'use strict';
  let rootProcess;
  function init () {
    if (rootProcess) rootProcess.kill(Signal.TERM);
    rootProcess = new Process(null, ['init']);
  }
  function getRoot () { return rootProcess; }
  return {init, getRoot};
})