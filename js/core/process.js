define(['../lib/Process'], function (Process) {
  'use strict';
  let rootProcess;
  function init () {
    if (rootProcess) rootProcess.terminate();
    rootProcess = new Process(['init'], {}, function() {});
  }
  function getRoot () { return rootProcess; }
  return {init, getRoot};
})