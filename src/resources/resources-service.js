const ResourcesService = {
  getAllResources(knex) {
    return knex.select("*").from("resources");
  },
  getResourceById(knex, id) {
    return knex.select("*").from("resources").where({ id }).first();
  },
  getResourcesByLanguage(knex, language) {
    return knex.select("*").from("resources").where({ language });
  },
  getRecommendedResources(knex, language, level, type, cost) {
    return knex
      .select("*")
      .from("resources")
      .where({ language, level, type, cost });
  },
  getSavedResourceIds(knex, user_id) {
    return knex
      .select("resource_id")
      .from("saved_resources")
      .where({ user_id });
  },
  getSavedResourcesFromIds(knex, resourceIds) {
    return knex.select("*").from("resources").whereIn("id", resourceIds);
  },

  submitResource(knex, newResource) {
    return knex("resources")
      .insert(newResource)
      .returning("*")
      .then((rows) => rows[0]);
  },

  updateResource(knex, id, updatedResource) {
    return knex.from("resources").where("id", id).update(updatedResource);
  },
  saveAResource(knex, savedResource) {
    return knex("saved_resources")
      .insert(savedResource)
      .returning("*")
      .then((rows) => rows[0]);
  },
  deleteResourceFromFavorites(knex, user_id, resource_id) {
    return knex
      .from("saved_resources")
      .where("user_id", user_id)
      .andWhere("resource_id", resource_id)
      .delete();
  },
};

module.exports = ResourcesService;
