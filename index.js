require("dotenv").config();
const { sequelize } = require("./src/models/postgres.db");
const WebServer = require("./src/core/web-server");
const setupAssociations = require("./src/models/associations");
const downloadAllImages = require('./src/config/image.downloader');

const appPromise = (async () => {
  try {
    setupAssociations();
    //await downloadAllImages();
    await sequelize.sync();
    const webServer = new WebServer();
    const app = webServer.getApp();
    webServer.start();
    const server = webServer.getServer();
    return { app, server };
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = appPromise;