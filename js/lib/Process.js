define(function () {
  'use strict';
  let processId = 0;
  return class Process {
    constructor (command, tty, cwd, env, fn) {
      this.processId = processId++;
      Object.assign(this, {command, tty, cwd, env, fn});
      this.children = {};
    }

    get name () { return command[0]; }

    stdout (text) {
      this.tty.printLn(text);
    }

    stdin (handler) {
      this.tty.on('stdin', handler.bind(this));
    }

    fork () {
      let p = new Process(this.command, this.tty, this.cwd, this.env, this.fn);
      this.children[p.processId] = p;
      return p;
    }

    run () {
      this.fn.apply(this, this.command);
    }

    spawn (command, env, fn) {
      return this.fork().exec(command, env, fn);
    }

    exec (command, env, fn){
      if (this.processId === 0) throw new Error('Cannot exec process 0');
      env = env || this.env;
      Object.assign(this, {command, env, fn});
      return this;
    }

    terminate () {
      for (let pid of Object.keys(this.children)) {
        this.children[pid].terminate();
      }
      this.children = {};
    }
  };
})