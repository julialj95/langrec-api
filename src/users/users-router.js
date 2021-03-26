const express = require("express");
const xss = require("xss");
const path = require("path");
const UsersService = require("./users-service");
const jsonParser = express.json();
const UsersRouter = express.Router();

UsersRouter.route("/").get((req, res, next) => {});

module.exports = UsersRouter;
