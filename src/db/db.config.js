module.exports = {
  HOST: "localhost",
  PORT: 5438,
  USER: "postgres",
  PASSWORD: "postgres",
  DB: "postgres",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};