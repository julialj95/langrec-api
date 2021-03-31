const bcrypt = require("bcryptjs");
const usersService = {
  isUsernameAvailable(knex, username) {
    return knex
      .select("*")
      .from("users")
      .where({ username })
      .first()
      .then((user) => !!user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Please make a password containing 8 or more characters.";
    }
    if (password.length > 72) {
      return "Please make a password containing fewer than 72 characters.";
    }
    if (password.includes(" ")) {
      return "Password must not contain empty spaces";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  createNewUser(knex, newUser) {
    return knex
      .into("users")
      .insert(newUser)
      .returning("*")
      .then((users) => users[0]);
  },

  getAllUsers(knex) {
    return knex.select("*").from("users");
  },
  getUserByUsername(knex, username) {
    return knex.select("*").from("users").where({ username }).first();
  },
  getSavedResourcesIds(knex, user_id) {
    return knex.select("*").from("saved_resources").where({ user_id });
  },
  getResourcesById(knex, id) {
    return knex.select("*").from("resources").where({ id });
  },
};

module.exports = usersService;
