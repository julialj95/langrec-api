const bcrypt = require("bcryptjs");

function makeUsersArray() {
  return [
    { id: 1, username: "TestUser1", password: bcrypt.hashSync("Password") },
    { id: 2, username: "User2Test", password: bcrypt.hashSync("Password") },
    { id: 3, username: "AnotherUser", password: bcrypt.hashSync("Password") },
  ];
}

module.exports = { makeUsersArray };
