define(['./EventEmitter'], function (EventEmitter) {
  class Stream extends EventEmitter {
    constructor (onData) {
      super();
      this.readQueue = '';
      if (onData) this.addEventListener('data', onData);
    }

    write (data) {
      if (this.readQueue === null) throw new Error('EOF');
      if (data === null) {
        this.flush(true);
      } else {
        this.readQueue += data;
      }
      setTimeout(() => this.flush(), 0);
    }

    writeln (data) {
      this.write(data + '\n');
    }

    flush (eof) {
      if (this.readQueue === null) return;
      if (eof) {
        this.emit('data', this.readQueue);
        this.readQueue = null;
        this.emit('data', null);
      } else {
        this.emit('data', this.readQueue);
        this.readQueue = '';
      }
    }

    read () {
      let data = this.readQueue;
      if (this.readQueue !== null) this.readQueue = '';
      return data;
    }

    close () {
      this.emit('close');
    }
  }
  Stream.empty = new Stream(function () { this.read(); });
  return Stream;
});