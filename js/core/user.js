define(function () {
  'use strict';
  let users = {};
  let player;
  function addUser (user) {
    return users[user.name] = user;
  }
  function getUsers () { return Object.keys(users).map(user => users[user]); }
  function getUserById (id) {throw new Error('fart')}
  function getUser (username) {throw new Error('fart')}

  function getRoot () { return users.root; }
  function setPlayer (user) { player = user; }
  function getPlayer () { return player; }
  return {addUser, getUsers, getUserById, getUser, getRoot, getPlayer, setPlayer};
});