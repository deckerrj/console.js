define(function () {
  function cd (process, os, argv) {
    let pathname = argv[1];
    try {
      process.cwd = os.fs.realpath(process.cwd, pathname || process.env.HOME);
    } catch (err) {
      return err.message || err;
    }
  }
  function exit (process, os, argv) {
    process.terminate();
  }
  return {cd, exit};
})