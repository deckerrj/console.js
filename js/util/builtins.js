define(['../lib/Signal'], function (Signal) {
  function cd (process, os, argv) {
    let pathname = argv[1];
    try {
      process.cwd = os.fs.dir(os.fs.joinpath(process.cwd, pathname || process.env.HOME));
    } catch (err) {
      return err.message || err;
    }
  }
  function exit (process, os, argv) {
    process.kill(Signal.TERM);
  }
  return {cd, exit};
})