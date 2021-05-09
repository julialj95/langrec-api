const express = require("express");
const xss = require("xss");
const path = require("path");
const ResourcesService = require("./resources-service");
const { requireAuth } = require("../middleware/jwt-auth");
const jsonParser = express.json();
const ResourcesRouter = express.Router();

serializeResource = (newResource) => ({
  id: newResource.id,
  user_id: newResource.user_id,
  title: xss(newResource.title),
  image_link: xss(newResource.image_link),
  language: newResource.language,
  level: newResource.level,
  type: newResource.type,
  rating: newResource.rating,
  url: xss(newResource.url),
  description: xss(newResource.description),
  cost: newResource.cost,
});

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
  .post(requireAuth, jsonParser, (req, res, next) => {
    const user_id = req.user.id;
    const {
      title,
      image_link,
      language,
      level,
      type,
      rating,
      url,
      cost,
      description,
    } = req.body;
    const newResource = {
      user_id,
      title,
      image_link,
      language,
      level,
      type,
      rating,
      url,
      cost,
      description,
    };

    ResourcesService.submitResource(req.app.get("db"), newResource).then(
      (response) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `${user_id}`))
          .send(() => serializeResource(response));
      }
    );
  });

ResourcesRouter.route("/saved-resources").get(requireAuth, (req, res, next) => {
  const user_id = req.user.id;

  ResourcesService.getSavedResourceIds(req.app.get("db"), user_id)
    .then((resources) => {
      if (!resources) {
        return res.status(404).json({
          error: { message: `No saved resources` },
        });
      }
      const resourceIds = resources.map((resource) => resource.resource_id);
      return ResourcesService.getSavedResourcesFromIds(
        req.app.get("db"),
        resourceIds
      ).then((response) => {
        if (!response) {
          return res.status(404).json({
            error: { message: `No resources found` },
          });
        }
        return res.json(response);
      });
    })
    .catch(next);
});
ResourcesRouter.route("/saved-resources/:resource_id").delete(
  requireAuth,
  (req, res, next) => {
    const resource_id = req.params.resource_id;
    const user_id = req.user.id;
    ResourcesService.getSavedResourceIds(req.app.get("db"), user_id)
      .then((resource) => {
        const results = resource.filter(
          (item) => item.resource_id === Number(resource_id)
        );
        if (results.length === 0) {
          return res.status(404).json({
            error: `Resource doesn't exist.`,
          });
        }
      })
      .catch(next);

    ResourcesService.deleteResourceFromFavorites(
      req.app.get("db"),
      user_id,
      resource_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  }
);

ResourcesRouter.route("/recs")
  .get((req, res, next) => {
    const { language, level, type, cost } = req.query;

    ResourcesService.getRecommendedResources(
      req.app.get("db"),
      language,
      level,
      type,
      cost
    )
      .then((resources) => {
        if (resources.length === 0) {
          return res.status(200).send("No resources found.");
        }
        res.json(resources);
      })
      .catch(next);
  })
  .post(jsonParser, requireAuth, (req, res, next) => {
    const user_id = req.user.id;
    const { resource_id } = req.body;
    const newSavedResource = { user_id, resource_id };

    for (const [key, value] of Object.entries(newSavedResource))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    ResourcesService.saveAResource(req.app.get("db"), newSavedResource)
      .then((resource) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${resource.id}`))
          .json({
            id: resource.id,
            user_id: resource.user_id,
            resource_id: resource.resource_id,
          });
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
  .patch(requireAuth, jsonParser, (req, res, next) => {
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
