define(['../lib/Shell', './parser', './fs'], function (parser, fs) {
  'use strict';
  function spawn () {
    //
  }
  function exec (line) {
    let cmd = parser.line(line);
    let file = fs.find(['/bin'], cmd.command);
    if (file && file.isExecutable) {
      let response = file.run(...cmd.args);
      if (Array.isArray(response)) return response;
      else return [response]
    }
    return [`Unknown command: ${cmd.command}`];
  }
  return {exec, spawn};
});