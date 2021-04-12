const express = require("express");
const xss = require("xss");
const path = require("path");
const UsersService = require("./users-service");
const { hashedPassword } = require("./users-service");
const jsonParser = express.json();
const UsersRouter = express.Router();

UsersRouter.route("/")
  .get((req, res, next) => {
    UsersService.getAllUsers(req.app.get("db"))
      .then((users) => {
        res.json((users) => {
          if (!users) {
            return res.status(400).send("No users found.");
          }
          res.json(users);
        });
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { username, password } = req.body;

    for (const field of ["username", "password"]) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        });
      }
    }

    const passwordInvalid = UsersService.validatePassword(password);

    if (passwordInvalid)
      return res.status(400).json({ error: passwordInvalid });

    UsersService.isUsernameAvailable(req.app.get("db"), username).then(
      (username) => {
        if (username) {
          return res.status(400).json({ error: "Username is not available." });
        }
      }
    );

    UsersService.hashPassword(password)
      .then((hashedPassword) => {
        const newUser = {
          username: username,
          password: hashedPassword,
        };

        UsersService.createNewUser(req.app.get("db"), newUser).then((user) => {
          return res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${user.id}`))
            .json({
              id: user.id,
              username: xss(user.username),
            });
        });
      })
      .catch(next);
  });

UsersRouter.route("/:user_id").all((req, res, next) => {
  UsersService.getUserById(req.app.get("db"), req.params.user_id).then(
    (user) => {
      if (!user) {
        return res.status(404).json({
          error: { message: `User doesn't exist` },
        });
      }
      res.user = user;
      next();
    }
  );
});

module.exports = UsersRouter;
