CREATE TABLE saved_resources (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  resource_id INTEGER REFERENCES resources(id) NOT NULL
);