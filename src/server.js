const app = require("./langrec-app");
const knex = require("knex");
const { PORT, DATABASE_URL } = require("./config");

const db = knex({
  client: "pg",
  connection: DATABASE_URL,
});
app.set("db", db);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = { app };
