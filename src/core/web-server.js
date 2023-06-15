const express = require("express");
const {
  initializeConfigMiddlewares,
  initializeErrorMiddlwares,
} = require("./middlewares");
const userRoutes = require("../controllers/routes/user.routes");
const authRoutes = require("../controllers/routes/auth.routes");
const movieRoutes = require("../controllers/routes/movie.routes");
const favoriteMovieRoutes = require("../controllers/routes/favorite-movie.routes");
const commentRoutes = require("../controllers/routes/comments.routes");
const { sequelize } = require("../models/postgres.db");

class WebServer {
  app = undefined;
  port = process.env.PORT || 3333;
  server = undefined;

  constructor() {
    this.app = express();
    sequelize.sync();
    initializeConfigMiddlewares(this.app);
    this._initializeRoutes();
    initializeErrorMiddlwares(this.app);
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Port : ${this.port}`);
    });
  }
  stop() {
    this.server.close();
  }

  _initializeRoutes() {
    this.app.use("/users", userRoutes.initializeRoutes());
    this.app.use("/auth", authRoutes.initializeRoutes());
    this.app.use("/movies", movieRoutes.initializeRoutes());
    this.app.use("/favorite-movies", favoriteMovieRoutes.initializeRoutes());
    this.app.use("/comments", commentRoutes.initializeRoutes());
  }

  getApp() {
    return this.app;
  }
  getServer() {
    return this.server;
  }
}

module.exports = WebServer;
