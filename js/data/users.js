define(['../lib/User'], function (User) {
  'use strict';
  return function (os) {
    os.user.addUser(new User('root'));
    os.user.setPlayer(os.user.addUser(new User('player')));
  };
});