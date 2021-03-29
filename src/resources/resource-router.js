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
    const {
      title,
      image_link,
      language,
      level,
      type,
      rating,
      url,
      description,
      cost,
    } = req.body;
    const newResource = {
      title,
      image_link,
      language,
      level,
      type,
      rating,
      url,
      description,
      cost,
    };

    for (const [key, value] of Object.entries(newResource)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` },
        });
      }
    }

    ResourcesService.submitResource(req.app.get("db"), newResource)
      .then((resource) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl) + `/${resource[0].id}`)
          .json(serializeResource(resource[0]));
      })
      .catch(next);
  });

ResourcesRouter.route("/recs").get((req, res, next) => {
  const { language, level, type, cost } = req.query;

  ResourcesService.getRecommendedResources(
    req.app.get("db"),
    language,
    level,
    type,
    cost
  )
    .then((resources) => {
      if (!resources) {
        return res.status(400).send("No resources found.");
      }
      res.json(resources);
    })
    .catch(next);
});
ResourcesRouter.route("/:resource_id")
  .all((req, res, next) => {
    const { resource_id } = req.params;
    ResourcesService.getResourceById(req.app.get("db"), resource_id).then(
      (resource) => {
        if (!resource) {
          return res.status(404).json({
            error: { message: `Resource doesn't exist` },
          });
        }
        res.resource = resource;
        next();
      }
    );
  })
  .patch(jsonParser, (req, res, next) => {
    const { resource_id } = req.params;
    const {
      title,
      image_link,
      language,
      level,
      type,
      rating,
      url,
      description,
      cost,
    } = req.body;
    const updatedResource = {
      title,
      image_link,
      language,
      level,
      type,
      rating,
      url,
      description,
      cost,
    };

    ResourcesService.updateResource(
      req.app.get("db"),
      resource_id,
      updatedResource
    )
      .then((res) => {
        res.status(204).end();
      })
      .catch(next);
  });
module.exports = ResourcesRouter;
