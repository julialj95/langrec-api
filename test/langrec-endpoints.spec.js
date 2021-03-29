const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/langrec-app");
const { API_KEY } = require("../src/config");
const { makeResourcesArray } = require("./resources-fixture");
const supertest = require("supertest");

describe("Langrec endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE resources, users RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE resources, users RESTART IDENTITY CASCADE")
  );
  describe("Resources endpoints", () => {
    describe("GET /api/resources", () => {
      context(`Given no resources`, () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app)
            .get("/api/resources")
            .set("Authorization", "Bearer " + API_KEY)
            .expect(200, []);
        });
      });

      context(`Given there are resources in the database`, () => {
        const testResources = makeResourcesArray();
        beforeEach("insert test resources", () => {
          return db.into("resources").insert(testResources);
        });

        it("responds with 200 and all of the resources", () => {
          return supertest(app)
            .get("/api/resources")
            .set("Authorization", "Bearer " + API_KEY)
            .expect(200, testResources);
        });
      });
    });
    describe("GET /api/resources/recs", () => {
      const testResources = makeResourcesArray();
      beforeEach("insert test resources", () => {
        return db.into("resources").insert(testResources);
      });
      context(
        "Given resources in the database, but none match the requirements",
        () => {
          it("Responds with 200 and an empty list", () => {
            const testQuery =
              "language=Spanish&type=Workbook&level=Advanced&cost=Paid";
            return supertest(app)
              .get(`/api/resources/recs?${testQuery}`)
              .set("Authorization", "Bearer " + API_KEY)
              .expect(200, []);
          });
        }
      );
      context("Given a resource matches the requirements", () => {
        it("Responds with 200 and the matching resources", () => {
          const testQuery =
            "language=Spanish&type=Textbook&level=Beginner&cost=Paid";
          return supertest(app)
            .get(`/api/resources/recs?${testQuery}`)
            .set("Authorization", "Bearer " + API_KEY)
            .expect(200, [testResources[1]]);
        });
      });
    });
    describe("PATCH /api/resources/:resource_id", () => {
      context(`Given no resources in the database`, () => {
        it(`responds with 404`, () => {
          const resource_id = 123456789;
          return supertest(app)
            .patch(`/api/resources/${resource_id}`)
            .set("Authorization", "Bearer " + API_KEY)
            .expect(404, { error: { message: `Resource doesn't exist` } });
        });
      });
      context(`Given resources in the database`, () => {
        const testResources = makeResourcesArray();
        beforeEach("insert test resources", () => {
          return db.into("resources").insert(testResources);
        });
        it(`Responds with 204 and updates the resource`, () => {
          const idToUpdate = 2;
          const updateResource = {
            title: "Updated Resource Name",
            image_link: "http://www.image.jpg",
            language: "Spanish",
            level: "Beginner",
            type: "Textbook",
            rating: 5,
            url: "http://www.amazon.com/resource",
            description: "Updated resource description",
            cost: "Free",
          };
          const expectedResource = {
            ...testResources[idToUpdate - 1],
            ...updateResource,
          };
          return supertest(app)
            .patch(`/api/resources/${idToUpdate}`)
            .set("Authorization", "Bearer " + API_KEY)
            .send(updateResource)
            .expect(204)
            .then(() =>
              supertest(app)
                .get(`/api/resources/${idToUpdate}`)
                .set("Authorization", "Bearer " + API_KEY)
                .expect(expectedResource)
            );
        });
      });
    });
  });
});
