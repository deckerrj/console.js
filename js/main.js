requirejs(['./game', './os', './data/files', './data/users', './data/shell'], function (game, os, files, users, shell) {
  'use strict';
  users(os);
  files(os);
  shell(os);
  game();
});