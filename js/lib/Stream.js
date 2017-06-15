define(['./EventEmitter'], function (EventEmitter) {
  function wrapStream (dataFn, closeFn) {
    let stream = function () {
      if (stream.closed) throw new Error('Stream closed');
      if (dataFn) dataFn(...arguments);
    };
    stream.close = function () {
      if (stream.closed) throw new Error('Stream closed');
      if (closeFn) closeFn();
      stream.closed = true;
    };
    return stream;
  }

  return {
    Readable: function (handler, closeFn) {
      return wrapStream(handler, closeFn);
    },
    Writable: function (writer, closeFn) {
      return wrapStream(writer, closeFn);
    },
    Duplex: function () {
      throw new Error('Unsupported');
    },
    nullIn: wrapStream(),
    nullOut: wrapStream()
  };
})