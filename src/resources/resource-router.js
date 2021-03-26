const express = require("express");
const xss = require("xss");
const path = require("path");
const ResourcesService = require("./resources-service");
const jsonParser = express.json();
const ResourcesRouter = express.Router();

ResourcesRouter.route("/")
  .get((req, res, next) => {
    ResourcesService.getAllResources(req.app.get("db"))
      .then((resources) => {
        if (!resources) {
          return res.status(400).send("No resources found.");
        }
        res.json(resources);
      })
      .catch(next);
  })
  .post((req, res, next) => {
    ResourcesService.submitResource(req.app.get("db")).then(response);
  });

module.exports = ResourcesRouter;
