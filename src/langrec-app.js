require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config.js");
const api_authorization = require("./api_validation");
const errorHandler = require("./error-handler");
const { CLIENT_ORIGIN } = require("./config");
const ResourcesRouter = require("./resources/resource-router");
const UsersRouter = require("./users/users-router");
const AuthorizationRouter = require("./authorization/authorization-router");
const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// app.use(
//   cors({
//     origin: CLIENT_ORIGIN,
//   })
// );

app.use(api_authorization);

app.use(errorHandler);

app.use("/api/resources", ResourcesRouter);
app.use("/api/users", UsersRouter);
app.use("/api/authorization", AuthorizationRouter);

module.exports = app;
