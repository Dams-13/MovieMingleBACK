const axios = require("axios");
const fs = require("fs");
const https = require("https");
const Movie = require("../models/movie.model");

function downloadImage(url, imagePath, cb) {
  https
    .get(url, (response) => {
      if (response.statusCode !== 200) {
        cb(
          new Error(
            `Échec du téléchargement de l'image. Code : ${response.statusCode}`
          )
        );
        return;
      }

      const file = fs.createWriteStream(imagePath);
      response.pipe(file);

      file.on("finish", () => {
        file.close(cb);
      });
    })
    .on("error", (error) => {
      fs.unlink(imagePath, () => {
        cb(error);
      });
    });
}

const downloadAllImages = async () => {
  try {
    const movies = await Movie.findAll();

    for (const movie of movies) {
      if (movie.backdrop_path) {
        const imageUrl = `${process.env.BASE_IMAGE_URL}${movie.backdrop_path}`;
        const folder = "./images/backdrops";
        const fileName = `${folder}/backdrop_${movie.id}.jpg`;

        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }

        await new Promise((resolve, reject) => {
          downloadImage(imageUrl, fileName, (error) => {
            if (error) {
              console.error(
                `Erreur lors du téléchargement de l'image ${imageUrl}:`,
                error
              );
              reject(error);
            } else {
              console.log(`Backdrop téléchargé et enregistré à: ${fileName}`);
              resolve();
            }
          });
        });
      }

      if (movie.poster_path) {
        const imageUrl = `${process.env.BASE_IMAGE_URL}${movie.poster_path}`;
        const folder = "./images/posters";
        const fileName = `${folder}/poster_${movie.id}.jpg`;

        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }

        await new Promise((resolve, reject) => {
          downloadImage(imageUrl, fileName, (error) => {
            if (error) {
              console.error(
                `Erreur lors du téléchargement de l'image ${imageUrl}:`,
                error
              );
              reject(error);
            } else {
              console.log(`Poster téléchargé et enregistré à: ${fileName}`);
              resolve();
            }
          });
        });
      }
    }
  } catch (error) {
    console.error("Erreur lors du téléchargement des images:", error);
  }
};

module.exports = downloadAllImages;