const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = require("../src/langrec-app");
const { makeResourcesArray } = require("./resources-fixture");
const { makeUsersArray } = require("./users-fixture");
const { makeSavedResourcesArray } = require("./saved-resources-fixture");
const supertest = require("supertest");

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ id: user.id }, secret, {
    subject: user.username,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

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
    db.raw(
      "TRUNCATE resources, users, saved_resources RESTART IDENTITY CASCADE"
    )
  );

  afterEach("cleanup", () =>
    db.raw(
      "TRUNCATE resources, users, saved_resources RESTART IDENTITY CASCADE"
    )
  );
  describe("Resources endpoints", () => {
    describe("GET /api/resources", () => {
      context(`Given no resources`, () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app).get("/api/resources").expect(200, []);
        });
      });

      context(`Given there are resources in the database`, () => {
        const testResources = makeResourcesArray();
        const testUsers = makeUsersArray();
        beforeEach("insert test resources", () => {
          return db.into("resources").insert(testResources);
        });

        it("responds with 200 and all of the resources", () => {
          return supertest(app)
            .get("/api/resources")
            .expect(200, testResources);
        });
      });
    });

    //  ***Resource submission functionality has been removed from this iteration due to time constraints. Will be added later.
    // describe("POST /api/resources", () => {
    //   const testUsers = makeUsersArray();
    //   beforeEach("insert test users into database", () => {
    //     return db.into("users").insert(testUsers);
    //   });
    //   it("Creates a new resource and responds with 201 and the submitted resource", () => {
    //     const newResource = {
    //       title: "Test resource",
    //       image_link: "http://www.google.com/images",
    //       language: "Spanish",
    //       level: "Beginner",
    //       type: "Storybook",
    //       rating: 4,
    //       url: "http://www.amazon.com",
    //       description: "Test resource description",
    //       cost: "Paid",
    //     };
    //     return supertest(app)
    //       .post("/api/resources")
    //       .set("Authorization", makeAuthHeader(testUsers[0]))
    //       .send(newResource)
    //       .expect(201)
    //       .expect((res) => {
    //         expect(res.body.title).to.eql(newResource.title);
    //         expect(res.body.image_link).to.eql(newResource.image_link);
    //         expect(res.body.language).to.eql(newResource.language);
    //         expect(res.body.level).to.eql(newResource.level);
    //         expect(res.body.type).to.eql(newResource.type);
    //         expect(res.body.rating).to.eql(newResource.rating);
    //         expect(res.body.url).to.eql(newResource.url);
    //         expect(res.body.description).to.eql(newResource.description);
    //         expect(res.body.cost).to.eql(newResource.cost);
    //         expect(res.body).to.have.property("id");
    //         expect(res.headers.location).to.eql(
    //           `/api/resources/${res.body.id}`
    //         );
    //       })
    //       .then((res) =>
    //         supertest(app)
    //           .get(`/api/resources/${res.body.id}`)
    //           .set("Authorization", makeAuthHeader(testUsers[0]))
    //           .expect(res.body)
    //       );
    //   });
    // });

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
              .expect(200, {});
          });
        }
      );
      context("Given a resource matches the requirements", () => {
        it("Responds with 200 and the matching resources", () => {
          const testQuery =
            "language=Spanish&type=Textbook&level=Beginner&cost=Paid";
          return supertest(app)
            .get(`/api/resources/recs?${testQuery}`)
            .expect(200, [testResources[1]]);
        });
      });
    });

    describe("POST /api/resources/recs", () => {
      const testUsers = makeUsersArray();
      beforeEach("insert test users into database", () => {
        return db.into("users").insert(testUsers);
      });
      it("Adds a new saved resource and returns 201", () => {});
    });
    //Patch functionality has been removed from this iteration of the app (will be added later as time allows)
    // describe("PATCH /api/resources/:resource_id", () => {
    //   const testUsers = makeUsersArray();
    //   beforeEach("insert test users into database", () => {
    //     return db.into("users").insert(testUsers);
    //   });
    //   context(`Given no resources in the database`, () => {
    //     it(`responds with 404`, () => {
    //       const resource_id = 123456789;
    //       return supertest(app)
    //         .patch(`/api/resources/${resource_id}`)
    //         .set("Authorization", "Bearer " + API_KEY)
    //         .expect(404, { error: { message: `Resource doesn't exist` } });
    //     });
    //   });
    //   context(`Given resources in the database`, () => {
    //     const testResources = makeResourcesArray();
    //     beforeEach("insert test resources", () => {
    //       return db.into("resources").insert(testResources);
    //     });
    //     const testUsers = makeUsersArray();
    //     beforeEach("insert test users into database", () => {
    //       return db.into("users").insert(testUsers);
    //     });
    //     it(`Responds with 204 and updates the resource`, () => {
    //       const idToUpdate = 2;
    //       const updateResource = {
    //         title: "Updated Resource Name",
    //         image_link: "http://www.image.jpg",
    //         language: "Spanish",
    //         level: "Beginner",
    //         type: "Textbook",
    //         rating: 5,
    //         url: "http://www.amazon.com/resource",
    //         description: "Updated resource description",
    //         cost: "Free",
    //       };
    //       const expectedResource = {
    //         ...testResources[idToUpdate - 1],
    //         ...updateResource,
    //       };
    //       return supertest(app)
    //         .patch(`/api/resources/${idToUpdate}`)
    //         .set("Authorization", "Bearer " + API_KEY)
    //         .send(updateResource)
    //         .expect(204)
    //         .then(() =>
    //           supertest(app)
    //             .get(`/api/resources/${idToUpdate}`)
    //             .set("Authorization", "Bearer " + API_KEY)
    //             .expect(expectedResource)
    //         );
    //     });
    //   });
    // });

    describe("GET /api/resources/saved-resources", () => {
      const testResources = makeResourcesArray();
      const testUsers = makeUsersArray();
      const savedResources = makeSavedResourcesArray();
      beforeEach("insert test resources", () => {
        return db
          .into("resources")
          .insert(testResources)
          .then(() => {
            return db.into("users").insert(testUsers);
          })
          .then(() => {
            return db.into("saved_resources").insert(savedResources);
          });
      });
      context("Given there are no saved resources", () => {});
      context("Given there are saved resources", () => {
        it("Returns a list of saved resources and responds with 200", () => {
          const expected = [testResources[0], testResources[1]];
          return supertest(app)
            .get(`/api/resources/saved-resources`)
            .set("Authorization", makeAuthHeader(testUsers[0]))
            .expect(200, expected);
        });
      });
    });
    describe("DELETE /api/resources/saved-resource/:resource_id", () => {
      const testUsers = makeUsersArray();
      beforeEach("insert test users into database", () => {
        return db.into("users").insert(testUsers);
      });
      context("Given the resource doesn't exist", () => {
        it("Returns 404", () => {
          const resource_id = 123456;
          return supertest(app)
            .delete(`/api/resources/saved-resources/${resource_id}`)
            .set("Authorization", makeAuthHeader(testUsers[0]))
            .expect(404, { error: `Resource doesn't exist.` });
        });
      });
      context("Given the resource exists", () => {
        const testResources = makeResourcesArray();
        const testUsers = makeUsersArray();
        const savedResources = makeSavedResourcesArray();
        beforeEach("insert test resources", () => {
          return db
            .into("resources")
            .insert(testResources)
            .then(() => {
              return db.into("saved_resources").insert(savedResources);
            });
        });
        it("Deletes the resource and returns 204", () => {
          const idToRemove = 1;
          const expected = [testResources[1]];
          return supertest(app)
            .delete(`/api/resources/saved-resources/${idToRemove}`)
            .set("Authorization", makeAuthHeader(testUsers[0]))
            .expect(204)
            .then(() =>
              supertest(app)
                .get(`/api/resources/saved-resources`)
                .set("Authorization", makeAuthHeader(testUsers[0]))
                .expect(expected)
            );
        });
      });
    });
  });
});
