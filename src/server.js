// const app = require("./app");
// const { PORT } = require("./config");

// app.listen(PORT, () => {
//   console.log(`Server listening at http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const { CLIENT_ORIGIN } = require("./config");
const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

const PORT = process.env.PORT || 3000;

app.get("/api/*", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = { app };