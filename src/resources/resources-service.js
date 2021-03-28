const ResourcesService = {
  getAllResources(knex) {
    return knex.select("*").from("resources");
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

  // getResourcesByUserId(knex, id) {
  //   return knex.select("*").from("resources").where({ id });
  // },

  submitResource(knex, newResource) {
    return knex("resources")
      .insert(newResource)
      .returning("*")
      .then((rows) => rows[0]);
  },
};

module.exports = ResourcesService;
