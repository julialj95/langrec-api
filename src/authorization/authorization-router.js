const express = require("express");
const AuthorizationService = require("./authorization-service");

const authorizationRouter = express.Router();
const jsonBodyParser = express.json();

authorizationRouter.post("/login", jsonBodyParser, (req, res, next) => {
  const { username, password } = req.body;
  const loginUser = { username, password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  AuthorizationService.getUserWithUserName(
    req.app.get("db"),
    loginUser.username
  )
    .then((user) => {
      if (!user)
        return res.status(400).json({
          error: "Incorrect username or password",
        });

      return AuthorizationService.comparePasswords(
        loginUser.password,
        user.password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: "Incorrect username or password",
          });

        const sub = user.username;
        const payload = { user_id: user.id };
        res.send({
          authToken: AuthorizationService.createJwt(sub, payload),
        });
      });
    })
    .catch(next);
});

authorizationRouter.post("/refresh", (req, res) => {
  const sub = req.user.username;
  const payload = { user_id: req.user.id };
  res.send({
    authToken: AuthorizationService.createJwt(sub, payload),
  });
});

module.exports = authorizationRouter;
