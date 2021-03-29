const ResourcesService = {
  getAllResources(knex) {
    return knex.select("*").from("resources");
  },
  getResourceById(knex, id) {
    return knex.select("*").where({ id }).first();
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

  submitResource(knex, newResource) {
    return knex("resources")
      .insert(newResource)
      .returning("*")
      .then((rows) => rows[0]);
  },

  updateResource(knex, id, updatedResource) {
    return knex.from("resources").where("id", id).update(updatedResource);
  },
};

module.exports = ResourcesService;
