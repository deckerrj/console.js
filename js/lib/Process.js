define(['./EventEmitter', './Stream'], function (EventEmitter, Stream) {
  'use strict';
  let processId = 0;
  function attrs (process) {
    let obj = {};
    for (let attr of ['stdin', 'stdout', 'stderr', 'env', 'cwd']) obj[attr] = process[attr];
    return obj;
  }

  return class Process extends EventEmitter {
    constructor (fn, command, attr) {
      super();
      this.processId = processId++;
      Object.assign(this, {
        stdin: Stream.empty,
        stdout: Stream.empty,
        stderr: Stream.empty,
        env: {},
        cwd: null,
        children: {}
      }, {fn, command}, attr);
    }

    get name () { return command[0]; }

    fork () {
      let p = new Process(this.fn, this.command, attrs(this));
      this.children[p.processId] = p;
      return p;
    }

    run () {
      this.fn.call(this, this.command);
    }

    spawn (fn, command, attr) {
      return this.fork().exec(fn, command, attr);
    }

    exec (fn, command, attr){
      if (this.processId === 0) throw new Error('Cannot exec process 0');
      // TODO: Merge env
      Object.assign(this, {fn, command, env: this.env}, attr);
      return this;
    }

    kill (signal) {
      for (let pid of Object.keys(this.children)) {
        this.children[pid].kill(signal);
      }
      this.stdin.close();
      this.stdout.close();
      this.stderr.close();
      this.children = {};
      this.emit('terminate', signal);
      this.removeEventListener();
    }
  };
})