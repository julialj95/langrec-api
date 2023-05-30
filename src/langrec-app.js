require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config.js");
// const api_authorization = require("./api_validation");
const { requireAuth } = require("./middleware/jwt-auth");
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

app.use("/api/authorization", AuthorizationRouter);
app.use("/api/users", UsersRouter);
app.use("/api/resources", ResourcesRouter);
app.use(errorHandler);

module.exports = app;
