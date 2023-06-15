const express = require("express");
const cors = require("cors");
const { DateTime } = require("luxon");
const { expressjwt: jwt } = require("express-jwt");

const initJsonHandlerMiddlware = (app) => app.use(express.json());

const initCorsMiddlware = (app) => app.use(cors());

const initLoggerMiddlware = (app) => {
  app.use((req, res, next) => {
    const begin = new DateTime(new Date());

    res.on("finish", () => {
      const requestDate = begin.toString();
      const remoteIP = `IP: ${req.connection.remoteAddress}`;
      const httpInfo = `${req.method} ${req.baseUrl || req.path}`;

      const end = new DateTime(new Date());
      const requestDurationMs = end.diff(begin).toMillis();
      const requestDuration = `Duration: ${requestDurationMs}ms`;

      console.log(
        `[${requestDate}] - [${remoteIP}] - [${httpInfo}] - [${requestDuration}]`
      );
    });
    next();
  });
};

const initJwtMiddleware = (app) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  app.use(
    jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }).unless({
      path: [
        { url: "/auth/login", method: "POST" },
        { url: "/users/signup", method: "POST" },
        { url: "/movies/movie", method: "GET" },
        { url: "/movies/by-genres", method: "GET" },
        { url: "/movies/search", method: "GET" },
        { url: "/auth/verify-token", method: "GET" },
        { url: /^\/movies\/.*\/vote$/, method: "GET" },
        { url: /^\/comments\/.*$/, method: "GET" },
      ],
    })
  );
};

exports.initializeConfigMiddlewares = (app) => {
  initJsonHandlerMiddlware(app);
  initCorsMiddlware(app);
  initJwtMiddleware(app);
  initLoggerMiddlware(app);

  // Middleware pour gérer les erreurs JWT
  app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
      if (err.message === "No authorization token was found") {
        return res.status(401).send("No authorization token was found");
      } else if (err.message === "jwt expired") {
        return res.status(401).send("JWT token has expired");
      }
    }
    next(err);
  });
};

exports.initializeErrorMiddlwares = (app) => {
  app.use((err, req, res, next) => {
    if (err.code === "permission_denied") {
      res.status(403).send("Forbidden");
      return;
    }

    res.status(500).send(err.message);
  });
};
