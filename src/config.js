module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  API_KEY: process.env.API_KEY,
  JWT_SECRET: process.env.JWT_SECRET || "my-jwt-secret-is-here",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "3h",
};
