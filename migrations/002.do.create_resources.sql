CREATE TABLE resources(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id INTEGER references users(id) NOT NULL,
  title TEXT NOT NULL,
  image_link TEXT NOT NULL,
  language TEXT NOT NULL,
  level TEXT NOT NULL,
  type TEXT NOT NULL,
  rating INTEGER NOT NULL,
  url TEXT NOT NULL,
  cost TEXT NOT NULL,
  description TEXT
);