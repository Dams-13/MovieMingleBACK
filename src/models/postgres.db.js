const { Sequelize } = require('sequelize');

const isTestEnvironment = process.env.NODE_ENV === 'test';

const dbName = isTestEnvironment ? process.env.TEST_DB_NAME : process.env.DB_NAME;
const dbUser = isTestEnvironment ? process.env.TEST_DB_USER : process.env.DB_USER;
const dbPassword = isTestEnvironment ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD;
const dbHost = isTestEnvironment ? process.env.TEST_DB_HOST : process.env.DB_HOST;

exports.sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'postgres',
  logging: isTestEnvironment ? false : console.log,
});